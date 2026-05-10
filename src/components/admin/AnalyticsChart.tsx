"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useData } from '@/context/DataContext';

export default function AnalyticsChart() {
  const { data: appData } = useData();

  // Calculate real leads data from bookings
  const calculateData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      last7Days.push({
        name: days[d.getDay()],
        date: d.toISOString().split('T')[0],
        leads: 0
      });
    }

    appData.bookings.forEach(booking => {
      const bookingDate = new Date(booking.created_at).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.date === bookingDate);
      if (dayData) {
        dayData.leads += 1;
      }
    });

    return last7Days;
  };

  const chartData = calculateData();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
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
