import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarGrid,
  RadarChart, Radar
} from 'recharts';

export const LevelChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg">按级别续费统计</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="renewed" fill="#10b981" name="已续费" />
            <Bar dataKey="notRenewed" fill="#ef4444" name="未续费" />
            <Bar dataKey="combined" fill="#3b82f6" name="联报" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const StatusChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg">续费状态分布</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RenewalRateChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const topTeachers = data.slice(0, 10);

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg">教师续费率 TOP 10</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topTeachers}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={195} />
            <Tooltip />
            <Bar dataKey="rate" fill="#8b5cf6" name="续费率(%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
