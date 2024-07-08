import React from 'react';
import { BarChart, Bar, AreaChart, Area, LineChart, Line, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

export const TinyBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data}>
        <Bar dataKey="uv" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TinyAreaChart = () => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={data}>
        <Area dataKey="pv" fill="#2ca3c1" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const TinyLineChart = () => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={data}>
        <Line dataKey="amt" stroke="#8a52f3dd" />
      </LineChart>
    </ResponsiveContainer>
  );
};
