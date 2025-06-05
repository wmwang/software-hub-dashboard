
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, RefreshCw, CheckCircle, XCircle, Clock, Play, Activity, BarChart3, Zap, Server, Brain, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { softwareService } from '@/services/softwareService';
import { DeploymentChart } from '@/components/software/DeploymentChart';

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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'RUNNING':
        return <Play className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status) {
      case 'SUCCEED':
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case 'FAILED':
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      case 'RUNNING':
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getActionBadge = (action: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (action) {
      case 'install':
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case 'uninstall':
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case 'update':
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'install':
        return <Activity className="h-3 w-3" />;
      case 'uninstall':
        return <XCircle className="h-3 w-3" />;
      case 'update':
        return <RefreshCw className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // 統計數據
  const totalTasks = tasks.length;
  const successTasks = tasks.filter(t => t.taskStatus === 'SUCCEED').length;
  const failedTasks = tasks.filter(t => t.taskStatus === 'FAILED').length;
  const pendingTasks = tasks.filter(t => t.taskStatus === 'PENDING' || t.taskStatus === 'RUNNING').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 matrix-bg p-6">
      {/* 背景動畫元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-purple-400/20 rounded-full blur-xl floating-animation"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-cyan-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* 標題和返回按鈕 */}
        <div className="ai-card-light rounded-2xl p-8 border-0">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-10 w-10 text-blue-500 pulse-glow" />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold ai-text-glow bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI軟體派送詳情
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Bot className="h-4 w-4 text-purple-500" />
                  智能軟體派送任務監控平台
                </p>
              </div>
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
                className="pl-10 bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!searchId.trim()}
              className="ai-button text-white hover:scale-105 transition-all duration-300"
            >
              <Search className="h-4 w-4 mr-2" />
              查詢
            </Button>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="border-purple-500 text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重新整理
            </Button>
          </div>
        </div>

        {/* 統計卡片 */}
        {searchId && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="ai-card-light border-0 hover:scale-105 transition-all duration-300 pulse-glow group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">總任務數</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{totalTasks}</div>
                <p className="text-xs text-gray-500 mt-1">系統派送任務</p>
              </CardContent>
            </Card>
            
            <Card className="ai-card-light border-0 hover:scale-105 transition-all duration-300 pulse-glow group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">成功</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{successTasks}</div>
                <p className="text-xs text-gray-500 mt-1">成功部署</p>
              </CardContent>
            </Card>
            
            <Card className="ai-card-light border-0 hover:scale-105 transition-all duration-300 pulse-glow group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">失敗</CardTitle>
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{failedTasks}</div>
                <p className="text-xs text-gray-500 mt-1">部署失敗</p>
              </CardContent>
            </Card>
            
            <Card className="ai-card-light border-0 hover:scale-105 transition-all duration-300 pulse-glow group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">進行中</CardTitle>
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{pendingTasks}</div>
                <p className="text-xs text-gray-500 mt-1">執行中任務</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 統計圖表 */}
        {searchId && tasks.length > 0 && (
          <div className="ai-card-light rounded-2xl p-8 border-0">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-800">任務統計分析</h2>
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <DeploymentChart tasks={tasks} />
          </div>
        )}

        {/* 任務列表 */}
        {searchId && (
          <div className="ai-card-light rounded-2xl border-0 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Server className="h-6 w-6 text-purple-500" />
                <h2 className="text-2xl font-semibold text-gray-800">派送任務清單</h2>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                軟體ID: <span className="text-blue-600 font-mono">{searchId}</span> | 共 {totalTasks} 個任務
              </p>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">載入中...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-600">
                <p>載入失敗，請稍後再試</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-gray-600">任務ID</TableHead>
                      <TableHead className="text-gray-600">主機名稱</TableHead>
                      <TableHead className="text-gray-600">擁有者</TableHead>
                      <TableHead className="text-gray-600">操作</TableHead>
                      <TableHead className="text-gray-600">狀態</TableHead>
                      <TableHead className="text-gray-600">更新時間</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task, index) => (
                      <TableRow 
                        key={task.taskId} 
                        className="border-gray-200 hover:bg-gray-50 transition-colors group"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <TableCell className="font-mono text-blue-600 text-sm">
                          {task.taskId}
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-gray-500 group-hover:text-purple-500 transition-colors" />
                            {task.hostname}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{task.owner}</TableCell>
                        <TableCell>
                          <span className={getActionBadge(task.action)}>
                            {getActionIcon(task.action)}
                            {task.action}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadge(task.taskStatus)}>
                            {getStatusIcon(task.taskStatus)}
                            {task.taskStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {task.updateDate}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {tasks.length === 0 && !isLoading && searchId && (
              <div className="p-12 text-center text-gray-500">
                <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>沒有找到軟體 "<span className="text-blue-600 font-mono">{searchId}</span>" 的派送任務</p>
              </div>
            )}
          </div>
        )}

        {!searchId && (
          <div className="ai-card-light rounded-2xl border-0 p-12 text-center">
            <div className="relative mb-6">
              <Bot className="h-20 w-20 mx-auto text-purple-500 pulse-glow" />
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">開始AI分析</h3>
            <p className="text-gray-600">請輸入軟體ID來查詢智能派送任務分析</p>
          </div>
        )}
      </div>
    </div>
  );
};
