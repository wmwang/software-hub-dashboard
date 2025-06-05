
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, RefreshCw, CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { softwareService } from '@/services/softwareService';
import { DeploymentTask } from '@/types/software';

export const SoftwareDetail = () => {
  const { softwareId } = useParams<{ softwareId: string }>();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(softwareId || '');

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['deploymentTasks', searchId],
    queryFn: () => softwareService.getDeploymentTasks(searchId),
    enabled: !!searchId,
  });

  const tasks = response?.data || [];

  const handleSearch = () => {
    if (searchId.trim()) {
      refetch();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'RUNNING':
        return <Play className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (status) {
      case 'SUCCEED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'FAILED':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'RUNNING':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getActionBadge = (action: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (action) {
      case 'install':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'uninstall':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'update':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // 統計數據
  const totalTasks = tasks.length;
  const successTasks = tasks.filter(t => t.taskStatus === 'SUCCEED').length;
  const failedTasks = tasks.filter(t => t.taskStatus === 'FAILED').length;
  const pendingTasks = tasks.filter(t => t.taskStatus === 'PENDING' || t.taskStatus === 'RUNNING').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 標題和返回按鈕 */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">軟體派送詳情</h1>
              <p className="text-gray-600">查看軟體的派送任務狀態</p>
            </div>
          </div>

          {/* 搜尋框 */}
          <div className="flex gap-4 max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="輸入軟體ID查詢..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={!searchId.trim()}>
              查詢
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              重新整理
            </Button>
          </div>
        </div>

        {/* 統計卡片 */}
        {searchId && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總任務數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">成功</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{successTasks}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">失敗</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{failedTasks}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">進行中</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 任務列表 */}
        {searchId && (
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">派送任務</h2>
              <p className="text-sm text-gray-600 mt-1">
                軟體ID: {searchId} | 共 {totalTasks} 個任務
              </p>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>載入中...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                <p>載入失敗，請稍後再試</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任務ID</TableHead>
                    <TableHead>主機名稱</TableHead>
                    <TableHead>擁有者</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>更新時間</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.taskId}>
                      <TableCell className="font-mono text-sm">
                        {task.taskId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {task.hostname}
                      </TableCell>
                      <TableCell>{task.owner}</TableCell>
                      <TableCell>
                        <span className={getActionBadge(task.action)}>
                          {task.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.taskStatus)}
                          <span className={getStatusBadge(task.taskStatus)}>
                            {task.taskStatus}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {task.updateDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {tasks.length === 0 && !isLoading && searchId && (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>沒有找到軟體 "{searchId}" 的派送任務</p>
              </div>
            )}
          </div>
        )}

        {!searchId && (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>請輸入軟體ID來查詢派送任務</p>
          </div>
        )}
      </div>
    </div>
  );
};
