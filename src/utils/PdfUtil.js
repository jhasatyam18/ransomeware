import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatTime } from './AppUtils';

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
        margin: { top: 160 },
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

export function addHeaderPage(doc) {
  doc.setFontSize(48);
  doc.setTextColor('#16a085');
  doc.text(250, 300, 'Datamotive', 'left');
  doc.setFontSize(12);
  doc.setTextColor('#2c3e50');
  doc.text(350, 340, 'Audit report', 'left');
  // doc.text(350, 380, `${getDateFormat(startDate)} To ${getDateFormat(endDate)}`, 'left');
  doc.text(350, 380, 'Owner: admin', 'left');
}

export function systemOverview(doc, data) {
  const { titles, recoveryStats, replicationStats } = data;
  const { sites = 0, protectionPlans = 0, vms = 0, storage = 0 } = titles;
  const { testExecutions = 0, fullRecovery = 0, migrations = 0 } = recoveryStats;
  const { completed, running, failures, dataReduction = 0, changedData = 0, rpo = 0 } = replicationStats;
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
      ['Change Rate', calculateChangedData(changedData)],
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

export function exportDoc(doc, name) {
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

function calculateChangedData(val) {
  if (val === 0) {
    return;
  }
  return `${parseInt(val / 1024, 10)} GB`;
}
