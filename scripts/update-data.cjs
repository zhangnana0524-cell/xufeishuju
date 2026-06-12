// 把Excel数据转换为看板内置数据 public/data.json
// 用法: node scripts/update-data.cjs [Excel文件路径]
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const src = process.argv[2] ||
  '/Users/wuwei/Documents/小班课续费数据/各级别续费数据-续费动作已结束班期0612.xlsx';

const wb = XLSX.readFile(src);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// 自动定位真实表头行（含 student_id 的行），兼容首行为说明文字的情况
const headerIdx = rows.findIndex(r =>
  r.some(c => String(c).trim().toLowerCase() === 'student_id')
);
if (headerIdx === -1) {
  console.error('❌ 未找到包含 student_id 的表头行');
  process.exit(1);
}

const headers = rows[headerIdx].map(h => String(h).trim());
const records = rows
  .slice(headerIdx + 1)
  .map(r => {
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = r[i]; });
    return obj;
  })
  // 去掉完全空白的行（保留有任意内容的行，避免破坏合并单元格的向下填充）
  .filter(r => Object.values(r).some(v => String(v ?? '').trim() !== ''));

const updatedAt = new Date().toLocaleString('zh-CN', { hour12: false });
const out = path.join(__dirname, '..', 'public', 'data.json');
fs.writeFileSync(out, JSON.stringify({ updatedAt, rows: records }));
console.log(`✅ 已更新 public/data.json：${records.length} 条记录，更新时间 ${updatedAt}`);
console.log('   下一步: git add -A && git commit -m "data: update" && git push（Vercel自动发布）');
