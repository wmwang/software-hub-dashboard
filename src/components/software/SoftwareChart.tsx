
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Software } from '@/types/software';

interface SoftwareChartProps {
  softwares: Software[];
}

export const SoftwareChart = ({ softwares }: SoftwareChartProps) => {
  // 計算每個擁有者的軟體數量
  const ownerStats = softwares.reduce((acc, software) => {
    acc[software.owner] = (acc[software.owner] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(ownerStats).map(([owner, count]) => ({
    owner: owner.length > 10 ? `${owner.substring(0, 10)}...` : owner,
    fullOwner: owner,
    count
  }));

  // 計算最近7天每天的上架軟體數量
  const dailyStats = softwares.reduce((acc, software) => {
    const date = new Date(software.publishedAt).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lineData = Object.entries(dailyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7) // 最近7天
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }),
      count
    }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const pieData = Object.entries(ownerStats).map(([owner, count], index) => ({
    name: owner.length > 8 ? `${owner.substring(0, 8)}...` : owner,
    value: count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 軟體擁有者分布柱狀圖 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-600" />
            軟體擁有者分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="owner" 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <YAxis fontSize={12} tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value, name, props) => [value, '軟體數量']}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item ? `擁有者: ${item.fullOwner}` : label;
                }}
              />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 軟體類型分布圓餅圖 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-600" />
            軟體擁有者比例
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, '軟體數量']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
