import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import i18n from 'i18next';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NUMBER, PLATFORM_TYPES, REPORT_DURATION, STATIC_KEYS, PLAYBOOK_NAMES, NODE_TYPES } from '../constants/InputConstants';
import { ALPHABETS, BLUE, BORDER_STYLE, DARK_NAVY_BLUE, EXCEL_WORKSHEET_TABLE_HEADER_CELL, EXCEL_WORKSHEET_TITLE, LIGHT_GREY, LIGHT_NAVY_BLUE, REPORT_TYPES } from '../constants/ReportConstants';
import { ALERTS_COLUMNS, EVENTS_COLUMNS, NODE_COLUMNS, PROTECTED_VMS_COLUMNS, PROTECTION_PLAN_COLUMNS, RECOVERY_JOB_COLUMNS, REPLICATION_JOB_COLUMNS, SITE_COLUMNS, TABLE_REPORTS_CHECKPOINTS } from '../constants/TableConstants';
import { APPLICATION_API_USER } from '../constants/UserConstant';
import { calculateChangedData, convertMinutesToDaysHourFormat, formatTime, getAppDateFormat, getStorageWithUnit } from './AppUtils';
import { getCookie } from './CookieUtils';
import { getValue } from './InputUtils';

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

export function addTableFromData(doc, columns, title, data) {
  if (data.length <= 0) {
    return;
  }
  doc.addPage();
  doc.text(title, 10, 30);
  const rows = data.map((item) => columns.map((col) => {
    const keys = (col.field.split('.'));
    let value = getValueFromNestedObject(item, keys);
    if (value === null || value === '') {
      value = '-';
    } else if (col.type) {
      value = convertValueAccordingToType(value, col.type, item);
    }
    if (typeof value === 'string' && value.length > NUMBER.TWO_HUNDRED) {
      const words = value.split(' ').slice(0, 5);
      value = `${words.join(' ')}...`;
    } else if (typeof value === 'boolean' || value instanceof Boolean) {
      value = value ? 'Yes' : 'No';
    }
    return value;
  }));
  const columnHeaders = columns.map((col) => col.header);
  autoTable(doc, {
    head: [
      [
        {
          content: title,
          colSpan: 1,
          styles: { fontSize: 12, fillColor: 'white', textColor: 'black' },
        },
      ],
    ],
  });
  autoTable(doc, {
    head: [columnHeaders],
    body: rows,
    theme: 'grid',
    tableWidth: 576, // Wrap the table width according to content
    margin: { top: 50, left: 10 }, // Centered horizontally
    styles: { fontSize: 8 },
  });
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
  const { testExecutions = 0, fullRecovery = 0, migrations = 0, rto = 0 } = recoveryStats;
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
      ['Protected Storage', getStorageWithUnit(storage)],
      ['Recovery Point Objective', formatTime(rpo)],
      ['Recovery Time Objective', formatTime(rto)],
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
    doc.text(i18n.t('report.pdf.title'), 330, doc.internal.pageSize.height - 10);
  }
}

const columnsMapping = {
  protectedVMS: PROTECTED_VMS_COLUMNS,
  replication: REPLICATION_JOB_COLUMNS,
  sites: SITE_COLUMNS,
  plans: PROTECTION_PLAN_COLUMNS,
  nodes: NODE_COLUMNS,
  alerts: ALERTS_COLUMNS,
  events: EVENTS_COLUMNS,
  recovery: RECOVERY_JOB_COLUMNS,
  point_in_time_checkpoints: TABLE_REPORTS_CHECKPOINTS,
};

export async function exportTableToExcel(dashboard, data) {
  const nameOfWorksheet = ['nodes', 'sites', 'plans', 'protectedVMS', 'replication', 'recovery', 'events', 'alerts', 'point_in_time_checkpoints'];
  const workbook = new ExcelJS.Workbook();
  workbook.views = [{ x: 0, y: 0, width: 5000, firstSheet: 0, activeTab: 0, visibility: 'visible' }];
  const base64ImgUrl = await getBase64FromUrl(REPORT_TYPES.HEADER_IMG_URL);
  worksheetSummary(workbook, dashboard, base64ImgUrl);
  for (let a = 0; a < nameOfWorksheet.length; a += 1) {
    const worksheetName = nameOfWorksheet[a];
    if (data[worksheetName] && data[worksheetName].length > 0) {
      const worksheet = workbook.addWorksheet(worksheetName.split('_').join(' '), { pageSetup: { paperSize: 5, orientation: 'landscape' } });
      worksheet.columns = columnsMapping[worksheetName].map((col) => ({ header: col.header, key: col.field }));
      addDataToWorksheet(worksheet, columnsMapping[worksheetName], data[worksheetName], workbook, base64ImgUrl, worksheetName);
    }
  }
  workbook.xlsx.writeBuffer().then((d) => {
    const blob = new Blob([d], { type: REPORT_TYPES.EXCEL_BLOBTYPE });
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
  // for getting the aplabets row in the excelsheet
  let totalCol = '';
  if (typeof oTable === 'object') {
    totalCol = oTable.rows.item(0).cells.length - 1;
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
  const { fullRecovery, migrations, testExecutions, rto } = recoveryStats;
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
    { mergeCell: 'J15:L15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: testExecutions },
    { mergeCell: 'M13:N14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Recovery', fontSize: 8 },
    { mergeCell: 'M15:N15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: fullRecovery },
    { mergeCell: 'O13:P14', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Migration', fontSize: 8 },
    { mergeCell: 'O15:P15', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: migrations },
    { mergeCell: 'B17:D18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Change Rate', fontSize: 8 },
    { mergeCell: 'B19:D19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: calculateChangedData(changedRate) },
    { mergeCell: 'F17:H18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'Data Reduction', fontSize: 8 },
    { mergeCell: 'F19:H19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: `${parseInt(dataReduction, 10)}%` },
    { mergeCell: 'J17:L18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'RPO', fontSize: 8 },
    { mergeCell: 'J19:L19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: formatTime(rpo) },
    { mergeCell: 'N17:P18', fontColor: BLUE, backgroundColor: LIGHT_NAVY_BLUE, value: 'RTO', fontSize: 8 },
    { mergeCell: 'N19:P19', fontColor: LIGHT_GREY, backgroundColor: LIGHT_NAVY_BLUE, value: formatTime(rto) },
  ];
  return excel;
}

export async function exportIssues(data) {
  let issues = data;
  if (typeof issues === 'undefined') {
    issues = [];
  }
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Identified_Issues');
  worksheet.addRow(['Name', 'Error Messages']);
  issues.forEach((entry) => {
    entry.errorMessages.forEach((errorMessage, index) => {
      if (index === 0) {
        worksheet.addRow([entry.name, errorMessage]);
      } else {
        // For subsequent messages, leave the name column empty
        worksheet.addRow(['', errorMessage]);
      }
    });
  });
  // Define columns widths for better readability
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Error Messages', key: 'errorMessage', width: 50 },
  ];

  // Write the Excel file to disk
  workbook.xlsx.writeBuffer().then((d) => {
    const blob = new Blob([d], { type: REPORT_TYPES.EXCEL_BLOBTYPE });
    const someDate = new Date();
    const dateFormated = getAppDateFormat(someDate, false);

    FileSaver.saveAs(blob, `${PLAYBOOK_NAMES.ISSUES}-${dateFormated}.xlsx`);
  });
}

function formatTimeValue(value) {
  if (value === 0) {
    return '-';
  }
  // Convert milliseconds to readable time
  const milliseconds = value * 1000;
  const date = new Date(milliseconds);
  return date.toLocaleString();
}

function formatSize(size) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (size < MB) {
    return `${(size / KB).toFixed(2)} KB`;
  }
  if (size >= MB && size < GB) {
    return `${(size / MB).toFixed(2)} MB`;
  }
  return `${(size / GB).toFixed(2)} GB`;
}

export function getRecoveryStatus(data) {
  let { recoveryStatus, reverseStatus } = data;

  if (recoveryStatus) {
    recoveryStatus = recoveryStatus.charAt(0).toUpperCase() + recoveryStatus.slice(1);
    return recoveryStatus;
  }
  if (reverseStatus) {
    reverseStatus = reverseStatus.charAt(0).toUpperCase() + reverseStatus.slice(1);
    return reverseStatus;
  }
  return '-';
}

export function getAlertTitleWithOccurrence(data) {
  const { title, occurrence } = data;
  if (!title) {
    return '-';
  }
  if (occurrence && occurrence > 1) {
    return `${title} (${occurrence})`;
  }
  return title;
}

export function getVMNameWithSyncStatus(data) {
  const { vmName, syncStatus } = data;
  if (!syncStatus && vmName) {
    return vmName;
  }
  if (vmName && syncStatus) {
    return `${vmName}\n \n ${syncStatus}`;
  }
  return '-';
}

export function getRecoveryTimingAndDuration(data) {
  const { startTime = 0, endTime = 0 } = data;
  const start = formatTimeValue(startTime);
  const end = formatTimeValue(endTime);
  const duration = timeDuration(data);
  return `${start} - ${end} - ${duration}`;
}

function convertValueAccordingToType(value, type, data = {}) {
  switch (type) {
    case REPORT_DURATION.SIZE:
      return formatSize(value);
    case REPORT_DURATION.DATE:
      return formatTimeValue(value);
    case REPORT_DURATION.TIME:
      return convertMinutesToDaysHourFormat(value);
    case REPORT_DURATION.DURATION:
      return timeDuration(data);
    case REPORT_DURATION.LOCATION:
      return SetLocationAccordingToPlatform(data);
    case STATIC_KEYS.REPORT_STATUS_TYPE:
      return SetAlertStatus(data);
    case STATIC_KEYS.PORTS_RENDERER:
      return getPortsOfNode(data);
    case STATIC_KEYS.RECOVER_STATUS:
      return getRecoveryStatus(data);
    case STATIC_KEYS.ALERT_TITLE:
      return getAlertTitleWithOccurrence(data);
    case STATIC_KEYS.REPLICATION_JOB_VM_NAME:
      return getVMNameWithSyncStatus(data);
    case STATIC_KEYS.RECOVERY_DATE_DURATION:
      return getRecoveryTimingAndDuration(data);
    default:
      return value;
  }
}

function addDataToWorksheet(worksheet, columns, data, workbook, base64ImgUrl, header) {
  addingHeaderItemToWorksheet(columns.length - 1, workbook, worksheet, base64ImgUrl, header.split('_').join(' ').toUpperCase());
  const headerRow = columns.map((col) => col.header);
  const heading = worksheet.addRow(headerRow);
  heading.eachCell((cell) => {
    const headerCell = cell;
    headerCell.font = {
      color: { rgb: '000' },
      bold: true,
    };
    headerCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  });
  data.forEach((item) => {
    const row = {};
    columns.forEach((col) => {
      const keys = (col.field.split('.'));
      let value = getValueFromNestedObject(item, keys);
      if (value === null || value === '') {
        value = '-';
      } else if (col.type) {
        value = convertValueAccordingToType(value, col.type, item);
      }
      if (typeof value === 'string') {
        const words = value.split(' ');
        if (words.length > NUMBER.TWO_HUNDRED) {
          value = `${words.slice(0, 5).join(' ')}...`;
        }
      }
      row[col.field] = value;
    });
    const dataRow = worksheet.addRow(row);
    dataRow.eachCell((cell) => {
      const dataCell = cell;
      dataCell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
  });
  AdjustColumnWidth(worksheet);
}

function getValueFromNestedObject(item, keys) {
  return keys.reduce((acc, key) => acc && acc[key], item);
}

export function getReportDurationOptions() {
  return [
    { label: 'Custom', value: REPORT_DURATION.CUSTOM },
    { label: 'Current Week', value: REPORT_DURATION.WEEK },
    { label: 'Current Month', value: REPORT_DURATION.MONTH },
    { label: 'Current Year', value: REPORT_DURATION.YEAR },
  ];
}

export const showReportDurationDate = (user) => {
  const { values } = user;
  const durationType = getValue(STATIC_KEYS.REPORT_DURATION_TYPE, values);
  if (durationType === REPORT_DURATION.CUSTOM) {
    return true;
  }
  return false;
};

export function getStartDate(type) {
  const today = new Date();
  switch (type) {
    case REPORT_DURATION.WEEK:
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      today.setDate(diff);
      break;
    case REPORT_DURATION.MONTH:
      today.setDate(1);
      break;
    case REPORT_DURATION.YEAR:
      today.setMonth(0, 1);
      break;
    default:
      break;
  }
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

export function setMinDateForReport({ user }) {
  const { values } = user;
  const startDate = getValue(STATIC_KEYS.REPORT_DURATION_START_DATE, values);
  return startDate === '' ? new Date() : startDate;
}

export function timeDuration(data) {
  const { startTime, endTime } = data;
  if (endTime === 0) {
    return formatTimeValue(startTime);
  }
  if (startTime && endTime) {
    const sDate = new Date(startTime * 1000);
    const eDate = new Date(endTime * 1000);
    const duration = formatTime(Math.ceil(eDate - sDate) / 1000);
    return duration;
  }
  return '-';
}

export function SetLocationAccordingToPlatform(data) {
  const { availZone, hostname, region, platformType } = data.platformDetails;
  if (platformType === PLATFORM_TYPES.VMware) {
    return hostname;
  }
  if (platformType === PLATFORM_TYPES.Azure) {
    return region;
  }
  return availZone;
}

export function SetAlertStatus(data = {}) {
  const isAcknowledged = data.isAcknowledge;
  if (isAcknowledged) {
    return 'Acknowledged';
  }
  return 'Not Acknowledged';
}

function getPortsOfNode(data) {
  const mgmtPort = data.managementPort;
  const replCtrlPort = data.replicationCtrlPort;
  const replDataPort = data.replicationDataPort;
  let replPort = 0;
  if (mgmtPort === 0 && replCtrlPort === 0 && replDataPort === 0 && data.nodeType === NODE_TYPES.PrepNode) {
    return '5985-5986';
  }
  if (mgmtPort === 0 && replCtrlPort === 0 && replDataPort === 0) {
    return '-';
  }

  if (replCtrlPort !== 0 && replDataPort !== 0) {
    replPort = `${replCtrlPort}, ${replDataPort}`;
  } else if (replCtrlPort !== 0) {
    replPort = replCtrlPort;
  } else if (replDataPort !== 0) {
    replPort = replDataPort;
  }
  if (mgmtPort === 0) {
    return replPort;
  }
  return `${mgmtPort}, ${replPort}`;
}
