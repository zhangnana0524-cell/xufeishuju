import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // 先按行数组读取，自动定位真实表头行（含 student_id 的那一行）
        // 兼容首行是说明文字/合并标题的情况
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        const headerIdx = rows.findIndex(row =>
          row.some(cell => String(cell).trim().toLowerCase() === 'student_id')
        );

        if (headerIdx === -1) {
          // 找不到 student_id 列时，退回默认解析（首行作表头）
          resolve(XLSX.utils.sheet_to_json(sheet));
          return;
        }

        const headers = rows[headerIdx].map(h => String(h).trim());
        const records = rows.slice(headerIdx + 1).map(row => {
          const obj = {};
          headers.forEach((h, i) => {
            if (h) obj[h] = row[i];
          });
          return obj;
        });

        resolve(records);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsArrayBuffer(file);
  });
};
