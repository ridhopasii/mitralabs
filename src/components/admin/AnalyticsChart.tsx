"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', leads: 4 },
  { name: 'Tue', leads: 3 },
  { name: 'Wed', leads: 7 },
  { name: 'Thu', leads: 5 },
  { name: 'Fri', leads: 8 },
  { name: 'Sat', leads: 6 },
  { name: 'Sun', leads: 9 },
];

export default function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0045d1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#0045d1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e1ef" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 800, fill: '#191b24', opacity: 0.4 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 800, fill: '#191b24', opacity: 0.4 }} 
          />
          <Tooltip 
            contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '12px'
            }}
            itemStyle={{ fontWeight: 800, fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="leads" 
            stroke="#0045d1" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorLeads)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
