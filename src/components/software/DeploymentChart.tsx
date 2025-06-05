
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeploymentTask } from '@/types/software';
import { Activity, TrendingUp, Target } from 'lucide-react';

interface DeploymentChartProps {
  tasks: DeploymentTask[];
}

export const DeploymentChart = ({ tasks }: DeploymentChartProps) => {
  // 統計各種狀態的數量
  const statusStats = tasks.reduce((acc, task) => {
    acc[task.taskStatus] = (acc[task.taskStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusStats).map(([status, count]) => ({
    status,
    count,
    color: getStatusColor(status)
  }));

  // 統計各種操作的數量
  const actionStats = tasks.reduce((acc, task) => {
    acc[task.action] = (acc[task.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const actionData = Object.entries(actionStats).map(([action, count]) => ({
    action,
    count
  }));

  // 按日期統計任務數量
  const dailyStats = tasks.reduce((acc, task) => {
    const date = task.updateDate.split(' ')[0]; // 提取日期部分
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dailyData = Object.entries(dailyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }),
      count
    }));

  function getStatusColor(status: string) {
    switch (status) {
      case 'SUCCEED': return '#10b981';
      case 'FAILED': return '#ef4444';
      case 'PENDING': return '#f59e0b';
      case 'RUNNING': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  const ACTION_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 任務狀態分布圓餅圖 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-green-600" />
            任務狀態分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, '任務數量']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 操作類型分布柱狀圖 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-blue-600" />
            操作類型分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={actionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="action" 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <YAxis fontSize={12} tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value) => [value, '任務數量']}
                labelFormatter={(label) => `操作: ${label}`}
              />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                {actionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ACTION_COLORS[index % ACTION_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 每日任務趨勢線圖 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            每日任務趨勢
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <YAxis fontSize={12} tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value) => [value, '任務數量']}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
