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

export function exportTableToExcel() {
  const arrayOfIDS = ['rpt-protection_plans', 'rpt-sites', 'rpt-nodes', 'rpt-protected_machines', 'rpt-events', 'rpt-alerts', 'rpt-replication_jobs', 'rpt-recovery_jobs'];
  const nameOfWorksheet = ['Protection Plans', 'Sites', 'Node', 'Protected Machine', 'Events', 'Alerts', 'Replication Jobs', 'Recovery Jobs'];
  const blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const workbook = new ExcelJS.Workbook();
  for (let a = 0; a < arrayOfIDS.length; a += 1) {
    const oTable = document.getElementById(arrayOfIDS[a]);
    // gets rows of table
    if (oTable) {
      const rowLength = oTable.rows.length;
      const worksheet = workbook.addWorksheet(nameOfWorksheet[a], { pageSetup: { paperSize: 5, orientation: 'landscape' } });
      workbook.views = [{ x: 0, y: 0, width: 10000, firstSheet: 0, activeTab: 1, visibility: 'visible' }];
      addRowColToWS(worksheet, rowLength, oTable);
    }
  }
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: blobType });
    FileSaver.saveAs(blob, 'DatamotiveReport.xlsx');
  });
}

function addRowColToWS(ws, rowLength, oTable) {
  const worksheet = ws;
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
      for (let j = 0; j < cellLength; j += 1) {
        // get your cell info here
        const cellVal = oCells.item(j).innerText;
        if (i > 0) {
          const f = oTable.rows.item(0).cells;
          const b = f.item(j).innerText;
          if (b) {
            row[b] = cellVal;
          }
        } else {
          columns.push({ header: cellVal, key: cellVal, style: { font: { name: 'times new roman' }, alignment: { vertical: 'middle', horizontal: 'center' } } });
        }
      }
      if (i > 0) {
        worksheet.addRow(row);
      } else {
        worksheet.columns = columns;
      }
      AdjustColumnWidth(worksheet, i);
    }
  }
}

function AdjustColumnWidth(ws) {
  const worksheet = ws;
  worksheet.columns.forEach((col) => {
    const column = col;
    const lengths = column.values.map((v) => v.toString().length + 3);
    const maxLength = Math.max(...lengths.filter((v) => typeof v === 'number'));
    column.width = maxLength;
  });
  addingStyleToWS(worksheet);
}

function addingStyleToWS(ws) {
  const worksheet = ws;
  worksheet.columns.forEach((col) => {
    const column = col;
    column.border = {
      top: { style: 'thick' },
      left: { style: 'thick' },
      bottom: { style: 'thick' },
      right: { style: 'thick' },
    };
  });
  ['A1',
    'B1',
    'C1',
    'D1',
    'E1',
    'F1',
    'G1',
    'H1',
    'I1'].map((key) => {
    worksheet.getCell(key).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '96C8FB' },
      bgColor: { argb: '96C8FB' },
    };
  });
}
