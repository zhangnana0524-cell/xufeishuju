// Excel中班级/教师列使用合并单元格，仅每组首行有值，需向下填充
const FILL_COLUMNS = ['级别', 'Batch Name', 'Classes Name', '带班老师姓名', '教辅老师名称'];

const forwardFill = (rows) => {
  const last = {};
  return rows.map(row => {
    const filled = { ...row };
    FILL_COLUMNS.forEach(col => {
      const val = filled[col];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        last[col] = val;
      } else if (last[col] !== undefined) {
        filled[col] = last[col];
      }
    });
    return filled;
  });
};

// 检查是否为应该排除的状态（退费、休学等）
const isExcludedStatus = (status) => {
  if (!status) return false;
  const statusStr = String(status).trim().toLowerCase();

  return statusStr.includes('退费') ||
         statusStr.includes('休学') ||
         statusStr.includes('已退') ||
         statusStr.includes('已休');
};

// 规范化续费状态
// 注意判断顺序："未续费"包含"续费"子串，必须先于"已续费"判断
const normalizeRenewalStatus = (status) => {
  if (!status) return '未知';
  const statusStr = String(status).trim().toLowerCase();

  // 联报状态
  if (statusStr.includes('联报')) {
    return '联报';
  }
  // 未续费状态（必须在"已续费"之前判断）
  if (statusStr.includes('未续费') || statusStr.includes('不续') || statusStr === '未') {
    return '未续费';
  }
  // 已续费状态
  if (statusStr.includes('已续费') || statusStr.includes('续费')) {
    return '已续费';
  }

  return status; // 保持原值
};

// 级别展示顺序（其余级别排在后面）
export const LEVEL_ORDER = ['PU1', 'PU2', 'PU3', 'KET', 'PET'];

const levelSortKey = (name) => {
  const idx = LEVEL_ORDER.indexOf(String(name).trim().toUpperCase());
  return idx === -1 ? LEVEL_ORDER.length : idx;
};

// 业务口径：续费率 =（已续费 + 联报）/ 总人数
const calcRate = (stats) =>
  stats.total > 0 ? (((stats.renewed + stats.combined) / stats.total) * 100).toFixed(1) : '0.0';

const emptyStats = () => ({ total: 0, renewed: 0, combined: 0, notRenewed: 0 });

const addToStats = (stats, status) => {
  stats.total++;
  if (status === '已续费') stats.renewed++;
  else if (status === '联报') stats.combined++;
  else if (status === '未续费') stats.notRenewed++;
};

// 计算续费统计
// filters: { level, teacher } —— 传入时只统计匹配的数据（'全部' 或空表示不过滤）
export const processData = (rawData, filters = {}) => {
  if (!rawData || rawData.length === 0) {
    return {
      totalStudents: 0,
      renewed: 0,
      notRenewed: 0,
      combined: 0,
      renewalRate: '0.0',
      byLevel: [],
      byTeacher: [],
      byClass: [],
      byStatus: [],
      byLevelTeacher: [],
      details: []
    };
  }

  // 先向下填充合并单元格留下的空值，再过滤有效数据（有student_id的行，且不是退费/休学状态）
  const filledData = forwardFill(rawData);
  let validData = filledData.filter(row =>
    row.student_id && !isExcludedStatus(row['续费状态'])
  );

  // 应用级别/老师筛选
  if (filters.level && filters.level !== '全部') {
    validData = validData.filter(row => String(row['级别'] ?? '未知').trim() === filters.level);
  }
  if (filters.teacher && filters.teacher !== '全部') {
    validData = validData.filter(row => String(row['带班老师姓名'] ?? '未分配').trim() === filters.teacher);
  }

  const overall = emptyStats();
  const levelStats = {};
  const teacherStats = {};
  const classStats = {};
  const levelTeacherStats = {};

  validData.forEach(row => {
    const status = normalizeRenewalStatus(row['续费状态']);
    const level = String(row['级别'] ?? '未知').trim() || '未知';
    const teacher = String(row['带班老师姓名'] ?? '未分配').trim() || '未分配';
    const className = String(row['Classes Name'] ?? '未知班级').trim() || '未知班级';

    addToStats(overall, status);

    if (!levelStats[level]) levelStats[level] = emptyStats();
    addToStats(levelStats[level], status);

    if (!teacherStats[teacher]) teacherStats[teacher] = emptyStats();
    addToStats(teacherStats[teacher], status);

    if (!classStats[className]) classStats[className] = emptyStats();
    addToStats(classStats[className], status);

    // 级别 × 老师 交叉统计
    if (!levelTeacherStats[level]) levelTeacherStats[level] = { teachers: {}, subtotal: emptyStats() };
    if (!levelTeacherStats[level].teachers[teacher]) {
      levelTeacherStats[level].teachers[teacher] = emptyStats();
    }
    addToStats(levelTeacherStats[level].teachers[teacher], status);
    addToStats(levelTeacherStats[level].subtotal, status);
  });

  const toSortedArray = (statsMap) =>
    Object.entries(statsMap).map(([name, stats]) => ({
      name,
      ...stats,
      rate: calcRate(stats)
    }));

  const byLevel = toSortedArray(levelStats)
    .sort((a, b) => levelSortKey(a.name) - levelSortKey(b.name));

  const byTeacher = toSortedArray(teacherStats)
    .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate) || b.total - a.total);

  const byClass = toSortedArray(classStats)
    .sort((a, b) => b.total - a.total);

  // 各级别·带班老师分析（级别按固定顺序，组内按续费率降序，含小计）
  const byLevelTeacher = Object.entries(levelTeacherStats)
    .sort((a, b) => levelSortKey(a[0]) - levelSortKey(b[0]))
    .map(([level, group]) => ({
      level,
      teachers: toSortedArray(group.teachers)
        .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate) || b.total - a.total),
      subtotal: { ...group.subtotal, rate: calcRate(group.subtotal) }
    }));

  const byStatus = [
    { name: '已续费', value: overall.renewed, color: '#10b981' },
    { name: '联报', value: overall.combined, color: '#3b82f6' },
    { name: '未续费', value: overall.notRenewed, color: '#ef4444' }
  ].filter(s => s.value > 0);

  return {
    totalStudents: overall.total,
    renewed: overall.renewed,
    notRenewed: overall.notRenewed,
    combined: overall.combined,
    renewalRate: calcRate(overall),
    byLevel,
    byTeacher,
    byClass,
    byStatus,
    byLevelTeacher,
    details: validData
  };
};

// 导出为CSV（级别×老师分析，与看板表格一致）
export const exportToCSV = (data, filename = '续费数据统计.csv') => {
  const header = ['级别', '带班老师', '联报人数', '已续费人数', '未续费人数', '总人数', '续费率(%)'];
  const rows = [];

  data.byLevelTeacher.forEach(group => {
    group.teachers.forEach(t => {
      rows.push([group.level, t.name, t.combined, t.renewed, t.notRenewed, t.total, t.rate]);
    });
    const s = group.subtotal;
    rows.push([`${group.level} 小计`, '', s.combined, s.renewed, s.notRenewed, s.total, s.rate]);
  });

  const csv = '﻿' + [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
