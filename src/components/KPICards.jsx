import React from 'react';

export const KPICards = ({ data }) => {
  const cards = [
    {
      label: '总学生数',
      value: data.totalStudents,
      icon: '👥',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: '已续费',
      value: data.renewed,
      icon: '✅',
      color: 'bg-green-100 text-green-600'
    },
    {
      label: '联报',
      value: data.combined,
      icon: '🔗',
      color: 'bg-sky-100 text-sky-600'
    },
    {
      label: '未续费',
      value: data.notRenewed,
      icon: '❌',
      color: 'bg-red-100 text-red-600'
    },
    {
      label: '续费率',
      value: `${data.renewalRate}%`,
      icon: '📊',
      color: 'bg-purple-100 text-purple-600',
      note: '(已续费+联报)/总人数'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {cards.map((card, index) => (
        <div key={index} className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content/70 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-base-content mt-2">{card.value}</p>
                {card.note && (
                  <p className="text-xs text-base-content/50 mt-1">{card.note}</p>
                )}
              </div>
              <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-lg ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
