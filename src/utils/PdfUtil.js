import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import i18n from 'i18next';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { calculateChangedData, formatTime } from './AppUtils';
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

export async function exportDoc(doc) {
  const img = await getBase64FromUrl('/docs/assets/images/docheader.png');
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.addImage(img, 'PNG', 8, 3, doc.internal.pageSize.width - 15, 30);
  }
  doc.save();
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
  const blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const workbook = new ExcelJS.Workbook();
  workbook.views = [{ x: 0, y: 0, width: 5000, firstSheet: 0, activeTab: 0, visibility: 'visible' }];
  const base64ImgUrl = await getBase64FromUrl('/docs/assets/images/docheader.png');
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
    const blob = new Blob([data], { type: blobType });
    FileSaver.saveAs(blob, 'DatamotiveReport.xlsx');
  });
}

function worksheetSummary(wb, dashboard, base64ImgUrl) {
  const workbook = wb;
  const worksheet = workbook.addWorksheet('Summary', { pageSetup: { paperSize: 5, orientation: 'landscape' } });
  addingHeaderItemToWorksheet(16, workbook, worksheet, base64ImgUrl, 'System Overview');
  summaryInfo(worksheet, dashboard);
}

function addRowColToWS(wb, ws, rowLength, oTable, title, base64ImgUrl) {
  const worksheet = ws;
  const workbook = wb;
  addingHeaderItemToWorksheet(oTable, workbook, worksheet, base64ImgUrl, title);
  if (rowLength > 0) {
    // loops through rows
    for (let i = 0; i < rowLength; i += 1) {
      // gets cells of current row
      const oCells = oTable.rows.item(i).cells;
      // gets amount of cells of current row
      const cellLength = oCells.length;
      const columns = [];
      // loops through each cell in current row
      const row = {};
      const val = [];
      for (let j = 0; j < cellLength; j += 1) {
        // get your cell info here
        const cellVal = oCells.item(j).innerText;
        if (i > 0) {
          const f = oTable.rows.item(0).cells;
          const b = f.item(j).innerText;
          if (b) {
            // adding value to the column key
            row[b] = cellVal;
          }
        } else {
          columns.push({ header: cellVal, key: cellVal, style: { font: { name: 'times new roman' }, alignment: { vertical: 'middle', horizontal: 'center' } } });
          val.push(cellVal);
        }
      }
      if (i > 0) {
        // adding rows to the worksheet
        worksheet.addRow(row);
      } else {
        // adding column header of the worksheet
        worksheet.columns = columns;
        // tp set the first row of the worksheet
        worksheet.getRow(5).values = val;
      }
      AdjustColumnWidth(worksheet);
    }
  }
}

function AdjustColumnWidth(ws) {
  const worksheet = ws;
  let firstRowWidth = 0;
  worksheet.columns.forEach((col) => {
    const column = col;
    const lengths = column.values.map((v) => { if (v) { return v.toString().length + 6; } });
    const maxLength = Math.max(...lengths.filter((v) => typeof v === 'number'));
    column.width = maxLength;
    firstRowWidth += maxLength;
  });
  worksheet.columns[0].width = firstRowWidth;
  addingStyleToWS(worksheet);
}

function addingStyleToWS(ws) {
  const worksheet = ws;
  worksheet.columns.forEach((col) => {
    const column = col;
    column.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    column.font = { name: 'Century Gothic', size: 9 };
  });
  ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5'].map((key) => {
    worksheet.getCell(key).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DFF6FF' }, bgColor: { argb: 'DFF6FF' } };
    worksheet.getCell(key).font = { size: 12 };
  });
  ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3', 'I3'].map((key) => {
    worksheet.getCell(key).font = { size: 14 };
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
  const aplpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
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
  worksheet.addImage(imageId, `A1:${aplpha[totalCol - 1]}2`);
  worksheet.mergeCells(`A1:${aplpha[totalCol - 1]}2`);
  worksheet.mergeCells('A3', `${aplpha[totalCol - 1]}4`);
  // for setting title to the worksheet
  worksheet.getCell('A3').value = title;
  worksheet.getCell('A3').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };
}

function summaryInfo(ws, dashboard) {
  const { titles, replicationStats, recoveryStats } = dashboard;
  const { sites, vms, storage, protectionPlans } = titles;
  const { running, completed, failures, changedRate, dataReduction, rpo } = replicationStats;
  const { fullRecovery, migration, tsestExecutions, rto } = recoveryStats;
  const worksheet = ws;
  worksheet.mergeCells('B6:D7');
  worksheet.getCell('B6').value = 'Sites';
  worksheet.getCell('B6').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('B8:D9');
  worksheet.getCell('B8').value = sites;
  worksheet.getCell('B8').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('F6:H7');
  worksheet.getCell('F6').value = 'Protection Plans';
  worksheet.getCell('F6').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('F8:H9');
  worksheet.getCell('F8').value = protectionPlans;
  worksheet.getCell('F8').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('J6:L7');
  worksheet.getCell('J6').value = 'Protected Machines';
  worksheet.getCell('J6').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('J8:L9');
  worksheet.getCell('J8').value = vms;
  worksheet.getCell('J8').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('N6:P7');
  worksheet.getCell('N6').value = 'Storage';
  worksheet.getCell('N6').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('N8:P9');
  worksheet.getCell('N8').value = storage > 1024 ? `${storage} TB` : `${storage} GB`;
  worksheet.getCell('N8').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('B11:H12');
  worksheet.getCell('B11').value = 'Replication Statistics';
  worksheet.getCell('B11').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('J11:P12');
  worksheet.getCell('J11').value = 'Recovery Statistics';
  worksheet.getCell('J11').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('B13:D14');
  worksheet.getCell('B13').value = 'Completed';
  worksheet.getCell('B13').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('B15:D15');
  worksheet.getCell('B15').value = completed;
  worksheet.getCell('B15').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('E13:F14');
  worksheet.getCell('E13').value = 'Running';
  worksheet.getCell('E13').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('E15:F15');
  worksheet.getCell('E15').value = running;
  worksheet.getCell('E15').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('G13:H14');
  worksheet.getCell('G13').value = 'Failure';
  worksheet.getCell('G13').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('G15:H15');
  worksheet.getCell('G15').value = failures;
  worksheet.getCell('G15').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('J13:L14');
  worksheet.getCell('J13').value = 'Test Recovery';
  worksheet.getCell('J13').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('J15:L15');
  worksheet.getCell('J15').value = tsestExecutions || '-';
  worksheet.getCell('J15').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('M13:N14');
  worksheet.getCell('M13').value = 'Recovery';
  worksheet.getCell('M13').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('M15:N15');
  worksheet.getCell('M15').value = fullRecovery;
  worksheet.getCell('M15').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('O13:P14');
  worksheet.getCell('O13').value = 'Migration';
  worksheet.getCell('O13').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('O15:P15');
  worksheet.getCell('O15').value = migration || '-';
  worksheet.getCell('O15').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('B17:D18');
  worksheet.getCell('B17').value = 'Change Rate';
  worksheet.getCell('B17').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('B19:D19');
  worksheet.getCell('B19').value = calculateChangedData(changedRate);
  worksheet.getCell('B19').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('F17:H18');
  worksheet.getCell('F17').value = 'Data Reduction';
  worksheet.getCell('F17').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('F19:H19');
  worksheet.getCell('F19').value = `${parseInt(dataReduction, 10)}%`;
  worksheet.getCell('F19').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('J17:L18');
  worksheet.getCell('J17').value = 'RPO';
  worksheet.getCell('J17').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  const formatedRPO = formatTime(rpo);
  worksheet.mergeCells('J19:L19');
  worksheet.getCell('J19').value = formatedRPO;
  worksheet.getCell('J19').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  worksheet.mergeCells('N17:P18');
  worksheet.getCell('N17').value = 'RTO';
  worksheet.getCell('N17').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  const formatedRTO = formatTime(rto);
  worksheet.mergeCells('N19:P19');
  worksheet.getCell('N19').value = formatedRTO;
  worksheet.getCell('N19').style = { font: { name: 'Century Gothic' }, alignment: { vertical: 'middle', horizontal: 'center' } };

  ['B8', 'F8', 'J8', 'N8', 'B13', 'B15', 'E13', 'E15', 'G13', 'G15', 'J13', 'J15', 'M13', 'M15', 'O13', 'O15', 'B17', 'B19', 'F17', 'F19', 'J17', 'J19', 'N17', 'N19'].map((key) => {
    worksheet.getCell(key).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DFF6FF' }, bgColor: { argb: 'DFF6FF' } };
  });
  ['B6', 'F6', 'J6', 'N6', 'B11', 'J11'].map((key) => {
    worksheet.getCell(key).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BCCEF8' }, bgColor: { argb: 'BCCEF8' } };
  });
}
