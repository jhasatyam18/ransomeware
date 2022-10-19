import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import i18n from 'i18next';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { BLUE, LIGHT_NAVY_BLUE, LIGHT_GREY, REPORT_TYPES, DARK_NAVY_BLUE, EXCEL_WORKSHEET_TABLE_HEADER_CELL, EXCEL_WORKSHEET_TITLE, ALPHABETS, BORDER_STYLE } from '../constants/ReportConstants';
import { calculateChangedData, formatTime, getAppDateFormat, getStorageWithUnit } from './AppUtils';
import { getCookie } from './CookieUtils';
import { APPLICATION_API_USER } from '../constants/UserConstant';

/**
 * Create empty pdf document object
 */
export function createPDFDoc() {
  const doc = new JsPDF('p', 'pt', 'a4');
  return doc;
}

/**
 * Add table to pdf document by id
 * @param {*} id
 */
export function addTableFromHtml(doc, id, title) {
  const elem = document.getElementById(id);
  if (elem) {
    doc.addPage();
    doc.text(title, 20, 30);
    const res = doc.autoTableHtmlToJson(elem);
    autoTable(doc, {
      head: [res.columns],
      body: res.data,
      theme: 'grid',
      options: {
        startY: doc.lastAutoTable.finalY + 45,
        rowPageBreak: 'auto',
        margin: { top: 160, left: 5 },
        bodyStyles: { valign: 'top' },
        styles: { overflow: 'linebreak', cellWidth: 'wrap' },
        columnStyles: { text: { cellWidth: 'auto' } },
      },
    });
  }
}

export function addHeading(doc, title) {
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(7, 15, title);
}

export function addTable(doc, data, columns, title, styles = { }) {
  addHeading(doc, title);
  doc.setFontSize(12);
  doc.autoTable(columns, data, {
    columnStyles: styles,
    margin: { top: 60 },
  });
}

export const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};
export function addHeaderPage(doc) {
  doc.setFontSize(48);
  doc.setTextColor('#16a085');
  doc.text(250, 300, 'Datamotive', 'left');
  doc.setFontSize(12);
  doc.setTextColor('#2c3e50');
  doc.text(350, 340, 'Audit report', 'left');
  doc.text(350, 380, `Owner: ${getCookie(APPLICATION_API_USER)}`, 'left');
}

export function systemOverview(doc, data) {
  const { titles, recoveryStats, replicationStats } = data;
  const { sites = 0, protectionPlans = 0, vms = 0, storage = 0 } = titles;
  const { testExecutions = 0, fullRecovery = 0, migrations = 0 } = recoveryStats;
  const { completed, running, failures, dataReduction = 0, changedRate = 0, rpo = 0 } = replicationStats;
  autoTable(doc, {
    head: [
      [
        {
          content: 'System Overview',
          colSpan: 2,
          styles: { halign: 'center' },
        },
      ],
    ],
    body: [
      ['Sites', `${sites}`],
      ['Protection Plans', `${protectionPlans}`],
      ['Protection Machines', `${vms}`],
      ['Protected Storage', (storage > 1024 ? `${storage} TB` : `${storage} GB`)],
      ['Recovery Point Objective', formatTime(rpo)],
      [{ content: 'Replication Statistics', colSpan: 2, styles: { halign: 'center' } }],
      ['Completed', completed],
      ['Running', running],
      ['Failures', failures],
      ['Data Reduction', calculateDataReduction(dataReduction)],
      ['Change Rate', calculateChangedData(changedRate)],
      [{ content: 'Recovery Statistics', colSpan: 2, styles: { halign: 'center' } }],
      ['Test Recoveries', testExecutions],
      ['Full Recoveries', fullRecovery],
      ['Migrations', migrations],
    ],
    theme: 'grid',
    options: {
      startY: doc.lastAutoTable.finalY + 45,
      rowPageBreak: 'auto',
      margin: { top: 160 },
      bodyStyles: { valign: 'top' },
      styles: { overflow: 'linebreak', cellWidth: 'wrap' },
      columnStyles: { text: { cellWidth: 'auto' } },
    },
  });
}

export async function exportDoc(doc, name) {
  const img = await getBase64FromUrl(REPORT_TYPES.HEADER_IMG_URL);
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.addImage(img, 'PNG', 8, 3, doc.internal.pageSize.width - 15, 30);
  }
  doc.save(name);
}

// function getDateFormat(date) {
//   const mNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   const m = mNames[date.getMonth()];
//   const d = date.getDate();
//   const y = date.getFullYear();
//   return `${m} ${d}, ${y}`;
// }

function calculateDataReduction(val) {
  if (val === 0) {
    return;
  }
  return `${parseInt(val, 10)}%`;
}

export function addFooters(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(6);
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.text(`Page No - ${String(i)}`, 20, doc.internal.pageSize.height - 10);
    doc.text(i18n.t('report.pdf.title'), 250, doc.internal.pageSize.height - 10);
  }
}

export async function exportTableToExcel(dashboard) {
  const arrayOfIDS = ['rpt-nodes', 'rpt-sites', 'rpt-protection_plans', 'rpt-protected_machines', 'rpt-replication_jobs', 'rpt-recovery_jobs', 'rpt-events', 'rpt-alerts'];
  const nameOfWorksheet = ['Node', 'Sites', 'Protection Plans', 'Protected Machine', 'Replication Jobs', 'Recovery Jobs', 'Events', 'Alerts'];
  const workbook = new ExcelJS.Workbook();
  workbook.views = [{ x: 0, y: 0, width: 5000, firstSheet: 0, activeTab: 0, visibility: 'visible' }];
  const base64ImgUrl = await getBase64FromUrl(REPORT_TYPES.HEADER_IMG_URL);
  worksheetSummary(workbook, dashboard, base64ImgUrl);
  for (let a = 0; a < arrayOfIDS.length; a += 1) {
    const oTable = document.getElementById(arrayOfIDS[a]);
    // gets rows of table
    if (oTable) {
      const rowLength = oTable.rows.length;
      const worksheet = workbook.addWorksheet(nameOfWorksheet[a], { pageSetup: { paperSize: 5, orientation: 'landscape' } });
      addRowColToWS(workbook, worksheet, rowLength, oTable, nameOfWorksheet[a], base64ImgUrl);
    }
  }
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: REPORT_TYPES.EXCEL_BLOBTYPE });
    const someDate = new Date();
    const dateFormated = getAppDateFormat(someDate, false);

    FileSaver.saveAs(blob, `Datamotive-Report-${dateFormated}.xlsx`);
  });
}

function worksheetSummary(wb, dashboard, base64ImgUrl) {
  const workbook = wb;
  const worksheet = workbook.addWorksheet('Summary', { pageSetup: { paperSize: 5, orientation: 'landscape' } });
  addingHeaderItemToWorksheet(16, workbook, worksheet, base64ImgUrl, 'System Overview');
  summaryInfo(worksheet, dashboard);
}

function addRowColToWS(wb, ws, rowLength, Table, title, base64ImgUrl) {
  const worksheet = ws;
  const workbook = wb;
  addingHeaderItemToWorksheet(Table, workbook, worksheet, base64ImgUrl, title);
  if (rowLength > 0) {
    // loops through rows
    for (let i = 0; i < rowLength; i += 1) {
      // gets cells of current row
      const oCells = Table.rows.item(i).cells;
      // to get the length of column of current row
      const cellLength = oCells.length;
      const columns = [];
      // loops through each column in current row
      const row = {};
      const val = [];
      for (let j = 0; j < cellLength; j += 1) {
        // get your cell info here
        const cellVal = oCells.item(j).innerText;
        if (i > 0) {
          const f = Table.rows.item(0).cells;
          const b = f.item(j).innerText;
          if (b) {
            // to add value to the column key
            row[b] = cellVal;
          }
        } else {
          columns.push({ header: cellVal, key: cellVal, style: { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } } });
          val.push(cellVal);
        }
      }
      if (i > 0) {
        // adds rows to the worksheet
        worksheet.addRow(row);
      } else {
        // adds column header of the worksheet
        worksheet.columns = columns;
        // to set the first row of the worksheet
        worksheet.getRow(5).values = val;
      }
      AdjustColumnWidth(worksheet);
    }
  }
}

function AdjustColumnWidth(ws) {
  const worksheet = ws;
  worksheet.columns.forEach((col) => {
    const column = col;
    const lengths = column.values.map((v) => { if (v) { return v.toString().length + 6; } });
    const maxLength = Math.max(...lengths.filter((v) => typeof v === 'number'));
    column.width = maxLength;
  });
  addingStyleToWorksheet(worksheet);
}

function addingStyleToWorksheet(ws) {
  const worksheet = ws;
  worksheet.columns.forEach((col) => {
    // style Each column in worksheet
    const column = col;
    column.border = BORDER_STYLE;
    column.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK_NAVY_BLUE }, bgColor: { argb: DARK_NAVY_BLUE } };
    column.font = { color: { argb: LIGHT_GREY } };
  });
  // apply blue font color and light blue background color in the header of the table
  EXCEL_WORKSHEET_TABLE_HEADER_CELL.map((key) => {
    worksheet.getCell(key).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_NAVY_BLUE }, bgColor: { argb: LIGHT_NAVY_BLUE } };
    worksheet.getCell(key).font = { size: 12 };
    worksheet.getCell(key).font = { color: { argb: BLUE } };
  });
  // apply gray font color and dark blue background color to the title of the Table
  EXCEL_WORKSHEET_TITLE.map((key) => {
    worksheet.getCell(key).font = { size: 14 };
    worksheet.getCell(key).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK_NAVY_BLUE }, bgColor: { argb: DARK_NAVY_BLUE } };
    worksheet.getCell(key).font = { color: { argb: LIGHT_GREY } };
  });
}
/**
 *
 * @param {*} oTable
 * @param {*} wb = workbook
 * @param {*} ws =worksheet
 * @param {*} base64ImgUrl = image url to base64
 * @param {*} title = title of the worksheet
 */

function addingHeaderItemToWorksheet(oTable, wb, ws, base64ImgUrl, title) {
  const workbook = wb;
  const worksheet = ws;
  // for getting the aplabets in the excelsheet
  let totalCol = '';
  if (typeof oTable === 'object') {
    totalCol = oTable.rows.item(0).cells.length;
  } else {
    totalCol = oTable;
  }
  // setting the image header in the worksheet
  const imageId = workbook.addImage({
    base64: base64ImgUrl,
    extension: 'png',
  });
  worksheet.addImage(imageId, `A1:${ALPHABETS[totalCol]}2`);
  worksheet.mergeCells(`A1:${ALPHABETS[totalCol]}2`);
  worksheet.mergeCells('A3', `${ALPHABETS[totalCol]}4`);
  // for setting title to the worksheet
  worksheet.getCell('A3').value = title;
  worksheet.getCell('A3').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };
}

function summaryInfo(ws, dashboard) {
  const worksheet = ws;
  const excelData = getExcelData(dashboard);
  excelData.forEach((e) => {
    mergeCells(worksheet, e);
  });
  // for setting summary page title
  ['A3'].map((key) => {
    worksheet.getCell(key).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_NAVY_BLUE }, bgColor: { argb: LIGHT_NAVY_BLUE } };
    worksheet.getCell(key).font = { color: { argb: LIGHT_GREY }, size: 12 };
  });
}

/**
 *It will set boxes for summary and set its style
 * @param {*} ws= worksheet
 * @param {*} obj has cell information
 */
export function mergeCells(ws, obj) {
  const worksheet = ws;
  const { mergeCell, value, backgroundColor, fontColor, fontSize } = obj;
  const firstCell = mergeCell.split(':');
  worksheet.mergeCells(mergeCell);
  worksheet.getCell(firstCell[0]).value = value;
  worksheet.getCell(firstCell[0]).style = { font: { name: 'Century Gothic', color: { argb: fontColor }, size: fontSize || 8 }, alignment: { vertical: 'middle', horizontal: 'center' } };
  worksheet.getCell(firstCell[0]).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: backgroundColor }, bgColor: { argb: backgroundColor } };
}

function getExcelData(dashboard) {
  const { titles, replicationStats, recoveryStats } = dashboard;
  const { sites, vms, storage, protectionPlans } = titles;
  const { running, completed, failures, changedRate, dataReduction, rpo } = replicationStats;
  const { fullRecovery, migration, tsestExecutions, rto } = recoveryStats;
  const excel = [
    { mergeCell: 'B6:D7', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Sites', fontSize: 8 },
    { mergeCell: 'B8:D9', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: sites },
    { mergeCell: 'F6:H7', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Protection Plans', fontSize: 8 },
    { mergeCell: 'F8:H9', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: protectionPlans },
    { mergeCell: 'J6:L7', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Protected Machine', fontSize: 8 },
    { mergeCell: 'J8:L9', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: vms },
    { mergeCell: 'N6:P7', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Storage', fontSize: 8 },
    { mergeCell: 'N8:P9', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: getStorageWithUnit(storage) },
    { mergeCell: 'B11:H12', fontColor: LIGHT_GREY, backgroundColor: DARK_NAVY_BLUE, value: 'Replication Statistics', fontSize: 10 },
    { mergeCell: 'J11:P12', fontColor: LIGHT_GREY, backgroundColor: DARK_NAVY_BLUE, value: 'Recovery Statistics', fontSize: 10 },
    { mergeCell: 'B13:D14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Completed', fontSize: 8 },
    { mergeCell: 'B15:D15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: completed },
    { mergeCell: 'E13:F14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Running', fontSize: 8 },
    { mergeCell: 'E15:F15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: running },
    { mergeCell: 'G13:H14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Failure', fontSize: 8 },
    { mergeCell: 'G15:H15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: failures },
    { mergeCell: 'J13:L14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Test Recovery', fontSize: 8 },
    { mergeCell: 'J15:L15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: tsestExecutions },
    { mergeCell: 'M13:N14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Recovery', fontSize: 8 },
    { mergeCell: 'M15:N15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: fullRecovery },
    { mergeCell: 'O13:P14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Migration', fontSize: 8 },
    { mergeCell: 'O15:P15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: migration },
    { mergeCell: 'B17:D18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Change Rate', fontSize: 8 },
    { mergeCell: 'B19:D19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: calculateChangedData(changedRate) },
    { mergeCell: 'F17:H18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Data Reduction', fontSize: 8 },
    { mergeCell: 'F19:H19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: `${parseInt(dataReduction, 10)}%` },
    { mergeCell: 'J17:L18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'RPO', fontSize: 8 },
    { mergeCell: 'J19:L19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: formatTime(rpo) },
    { mergeCell: 'N17:P18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'RPO', fontSize: 8 },
    { mergeCell: 'N19:P19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: formatTime(rto) },
  ];
  return excel;
}
