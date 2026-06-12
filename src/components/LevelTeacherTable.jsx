import React from 'react';

// 各级别配色，呼应业务报表的色块风格
const LEVEL_COLORS = {
  PU1: { badge: 'bg-green-100 text-green-700', subtotal: 'bg-green-50' },
  PU2: { badge: 'bg-yellow-100 text-yellow-700', subtotal: 'bg-yellow-50' },
  PU3: { badge: 'bg-orange-100 text-orange-700', subtotal: 'bg-orange-50' },
  KET: { badge: 'bg-blue-100 text-blue-700', subtotal: 'bg-blue-50' },
  PET: { badge: 'bg-rose-100 text-rose-700', subtotal: 'bg-rose-50' },
};

const colorOf = (level) =>
  LEVEL_COLORS[String(level).toUpperCase()] || { badge: 'bg-gray-100 text-gray-700', subtotal: 'bg-gray-50' };

const RateBadge = ({ rate }) => {
  const value = parseFloat(rate);
  let cls = 'badge-error';
  if (value >= 80) cls = 'badge-success';
  else if (value >= 60) cls = 'badge-info';
  else if (value >= 40) cls = 'badge-warning';
  return <span className={`badge ${cls} badge-sm font-semibold`}>{rate}%</span>;
};

export const LevelTeacherTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg">各级别 · 带班老师续费率分析</h2>
        <p className="text-xs text-base-content/60">
          续费率 =（已续费 + 联报）/ 总人数；退费/休学不计入分子或分母
        </p>
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="bg-base-200">
                <th>级别</th>
                <th>带班老师</th>
                <th className="text-right">联报人数</th>
                <th className="text-right">已续费人数</th>
                <th className="text-right">未续费人数</th>
                <th className="text-right">总人数</th>
                <th className="text-right">续费率</th>
              </tr>
            </thead>
            <tbody>
              {data.map(group => {
                const color = colorOf(group.level);
                return (
                  <React.Fragment key={group.level}>
                    {group.teachers.map((t, idx) => (
                      <tr key={t.name} className="hover:bg-base-200/50">
                        <td>
                          {idx === 0 && (
                            <span className={`px-2 py-1 rounded font-bold text-xs ${color.badge}`}>
                              {group.level}
                            </span>
                          )}
                        </td>
                        <td>{t.name}</td>
                        <td className="text-right">{t.combined}</td>
                        <td className="text-right">{t.renewed}</td>
                        <td className="text-right">{t.notRenewed}</td>
                        <td className="text-right">{t.total}</td>
                        <td className="text-right"><RateBadge rate={t.rate} /></td>
                      </tr>
                    ))}
                    <tr className={`font-bold ${color.subtotal}`}>
                      <td colSpan={2}>{group.level} 小计</td>
                      <td className="text-right">{group.subtotal.combined}</td>
                      <td className="text-right">{group.subtotal.renewed}</td>
                      <td className="text-right">{group.subtotal.notRenewed}</td>
                      <td className="text-right">{group.subtotal.total}</td>
                      <td className="text-right"><RateBadge rate={group.subtotal.rate} /></td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
