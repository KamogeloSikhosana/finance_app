const xlsx = require('xlsx');

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function normalizeMonth(m) {
  if (!m) return null;
  const s = String(m).trim();
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    if (n >= 1 && n <= 12) return MONTHS[n - 1];
  }
  const found = MONTHS.find(mm => mm.toLowerCase().startsWith(s.toLowerCase().slice(0,3)));
  if (found) return found;
  const exact = MONTHS.find(mm => mm.toLowerCase() === s.toLowerCase());
  return exact || null;
}

function parseExcel(buffer, userId, year) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

  if (!rows.length) throw new Error('Excel file contains no data');

  const records = [];
  rows.forEach((row, i) => {
    const keys = Object.keys(row);
    const monthKey = keys.find(k => k.toLowerCase().includes('month')) || keys[0];
    const amountKey = keys.find(k => k.toLowerCase().includes('amount')) || keys[1];

    const month = normalizeMonth(row[monthKey]);
    const amount = Number(row[amountKey]);

    if (!month) throw new Error(`Invalid month at row ${i + 2}`);
    if (Number.isNaN(amount)) throw new Error(`Invalid amount at row ${i + 2}`);

    records.push({ user_id: userId, year, month, amount });
  });

  return records;
}

module.exports = { parseExcel };
