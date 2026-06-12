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
const normalizeRenewalStatus = (status) => {
  if (!status) return '未知';
  const statusStr = String(status).trim().toLowerCase();

  // 已续费状态
  if (statusStr.includes('已续费') || statusStr.includes('续费')) {
    return '已续费';
  }
  // 联报状态
  if (statusStr.includes('联报')) {
    return '联报';
  }
  // 未续费状态
  if (statusStr.includes('未续费') || statusStr === '未' || statusStr === '') {
    return '未续费';
  }

  return status; // 保持原值
};

// 计算续费统计
export const processData = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return {
      totalStudents: 0,
      renewed: 0,
      notRenewed: 0,
      combined: 0,
      renewalRate: 0,
      byLevel: [],
      byTeacher: [],
      byClass: [],
      byStatus: [],
      details: []
    };
  }

  // 过滤有效数据（有student_id的行，且不是退费/休学状态）
  const validData = rawData.filter(row =>
    row.student_id && !isExcludedStatus(row['续费状态'])
  );

  let renewed = 0;
  let notRenewed = 0;
  let combined = 0;

  const levelStats = {};
  const teacherStats = {};
  const classStats = {};
  const statusCount = {
    '已续费': 0,
    '未续费': 0,
    '联报': 0,
  };

  validData.forEach(row => {
    const status = normalizeRenewalStatus(row['续费状态']);
    const level = row['级别'] || '未知';
    const teacher = row['带班老师姓名'] || '未分配';
    const className = row['Classes Name'] || '未知班级';

    // 统计续费状态
    if (status === '已续费') {
      renewed++;
    } else if (status === '未续费') {
      notRenewed++;
    } else if (status === '联报') {
      combined++;
    }

    // 更新状态计数
    if (statusCount.hasOwnProperty(status)) {
      statusCount[status]++;
    }

    // 按级别统计
    if (!levelStats[level]) {
      levelStats[level] = { total: 0, renewed: 0, combined: 0, notRenewed: 0 };
    }
    levelStats[level].total++;
    if (status === '已续费') levelStats[level].renewed++;
    else if (status === '联报') levelStats[level].combined++;
    else if (status === '未续费') levelStats[level].notRenewed++;

    // 按教师统计
    if (!teacherStats[teacher]) {
      teacherStats[teacher] = { total: 0, renewed: 0, combined: 0, notRenewed: 0 };
    }
    teacherStats[teacher].total++;
    if (status === '已续费') teacherStats[teacher].renewed++;
    else if (status === '联报') teacherStats[teacher].combined++;
    else if (status === '未续费') teacherStats[teacher].notRenewed++;

    // 按班级统计
    if (!classStats[className]) {
      classStats[className] = { total: 0, renewed: 0, combined: 0, notRenewed: 0 };
    }
    classStats[className].total++;
    if (status === '已续费') classStats[className].renewed++;
    else if (status === '联报') classStats[className].combined++;
    else if (status === '未续费') classStats[className].notRenewed++;
  });

  const totalStudents = renewed + notRenewed + combined;
  const renewalRate = totalStudents > 0 ? ((renewed / totalStudents) * 100).toFixed(1) : 0;

  // 转换为数组并排序
  const byLevel = Object.entries(levelStats).map(([level, stats]) => ({
    name: level,
    total: stats.total,
    renewed: stats.renewed,
    combined: stats.combined,
    notRenewed: stats.notRenewed,
    rate: stats.total > 0 ? ((stats.renewed / stats.total) * 100).toFixed(1) : 0
  })).sort((a, b) => b.total - a.total);

  const byTeacher = Object.entries(teacherStats).map(([teacher, stats]) => ({
    name: teacher,
    total: stats.total,
    renewed: stats.renewed,
    combined: stats.combined,
    notRenewed: stats.notRenewed,
    rate: stats.total > 0 ? ((stats.renewed / stats.total) * 100).toFixed(1) : 0
  })).sort((a, b) => b.renewed - a.renewed);

  const byClass = Object.entries(classStats).map(([className, stats]) => ({
    name: className,
    total: stats.total,
    renewed: stats.renewed,
    combined: stats.combined,
    notRenewed: stats.notRenewed,
    rate: stats.total > 0 ? ((stats.renewed / stats.total) * 100).toFixed(1) : 0
  })).sort((a, b) => b.total - a.total);

  const byStatus = [
    { name: '已续费', value: renewed, color: '#10b981' },
    { name: '联报', value: combined, color: '#3b82f6' },
    { name: '未续费', value: notRenewed, color: '#ef4444' }
  ].filter(s => s.value > 0);

  return {
    totalStudents,
    renewed,
    notRenewed,
    combined,
    renewalRate,
    byLevel,
    byTeacher,
    byClass,
    byStatus,
    details: validData
  };
};

// 导出为CSV
export const exportToCSV = (data, filename = '续费数据统计.csv') => {
  const byTeacher = data.byTeacher;
  const header = ['教师名称', '总人数', '已续费', '联报', '未续费', '续费率(%)'];
  const rows = byTeacher.map(t => [
    t.name,
    t.total,
    t.renewed,
    t.combined,
    t.notRenewed,
    t.rate
  ]);

  const csv = [
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
