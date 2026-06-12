import React, { useState } from 'react';

export const DataTable = ({ title, columns, data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, order: 'desc' });

  const handleSort = (key) => {
    let order = 'desc';
    if (sortConfig.key === key && sortConfig.order === 'desc') {
      order = 'asc';
    }
    setSortConfig({ key, order });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'number') {
        return sortConfig.order === 'desc' ? bVal - aVal : aVal - bVal;
      }
      return sortConfig.order === 'desc'
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });

    return sorted;
  }, [data, sortConfig]);

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 overflow-hidden">
      <div className="card-body">
        <h2 className="card-title text-lg">{title}</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="bg-base-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer hover:bg-base-300"
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="ml-2">
                        {sortConfig.order === 'desc' ? '▼' : '▲'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-base-content/50">
                    暂无数据
                  </td>
                </tr>
              ) : (
                sortedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-base-200">
                    {columns.map((col) => (
                      <td key={col.key} className={col.align ? `text-${col.align}` : ''}>
                        {col.render ? col.render(row[col.key]) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
