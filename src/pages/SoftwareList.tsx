import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, Package, User, Calendar, TrendingUp, Zap, Brain, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/software/StatCard';
import { SoftwareFilter } from '@/components/software/SoftwareFilter';
import { SoftwareChart } from '@/components/software/SoftwareChart';
import { softwareService } from '@/services/softwareService';

export const SoftwareList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['softwares'],
    queryFn: softwareService.getSoftwares,
  });

  const softwares = response?.data || [];
  
  // Filtering logic
  const filteredSoftwares = softwares.filter(software => {
    const matchesSearch = software.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         software.appId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOwner = !selectedOwner || software.owner === selectedOwner;
    return matchesSearch && matchesOwner;
  });

  const uniqueOwners = [...new Set(softwares.map(s => s.owner))];
  
  // Statistics calculations
  const totalSoftwares = softwares.length;
  const totalOwners = uniqueOwners.length;
  const latestSoftware = softwares.length > 0 ? softwares[softwares.length - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 matrix-bg p-6">
      {/* 背景動畫元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl floating-animation"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl floating-animation" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* 標題區域 */}
        <div className="ai-card rounded-2xl p-8 border-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Brain className="h-12 w-12 text-cyan-400 pulse-glow" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold ai-text-glow bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI軟體管理中心
              </h1>
              <p className="text-gray-300 flex items-center gap-2 mt-2">
                <Bot className="h-5 w-5 text-purple-400" />
                智能化軟體部署與監控平台
              </p>
            </div>
          </div>

          {/* 搜尋和篩選 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="搜尋軟體名稱或ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>
            <SoftwareFilter
              owners={uniqueOwners}
              selectedOwner={selectedOwner}
              onOwnerChange={setSelectedOwner}
            />
            <Button 
              onClick={() => refetch()} 
              className="ai-button text-white hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重新整理
            </Button>
          </div>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="軟體總數"
            value={totalSoftwares}
            icon={Package}
            color="from-blue-500 to-cyan-500"
            description="已部署軟體數量"
          />
          <StatCard
            title="開發者數量"
            value={totalOwners}
            icon={User}
            color="from-green-500 to-emerald-500"
            description="活躍開發者總數"
          />
          <StatCard
            title="最新軟體"
            value={latestSoftware?.appName || 'N/A'}
            icon={TrendingUp}
            color="from-purple-500 to-pink-500"
            description="最近更新的軟體"
          />
        </div>

        {/* 統計圖表 */}
        <div className="ai-card rounded-2xl p-8 border-0">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-semibold text-white">軟體統計分析</h2>
          </div>
          <SoftwareChart softwares={softwares} />
        </div>

        {/* 軟體列表 */}
        <div className="ai-card rounded-2xl border-0 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">軟體清單</h2>
            </div>
            <p className="text-gray-400 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              共找到 {filteredSoftwares.length} 個軟體
            </p>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
              <p className="text-gray-300">載入中...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">
              <p>載入失敗，請稍後再試</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300">軟體ID</TableHead>
                    <TableHead className="text-gray-300">軟體名稱</TableHead>
                    <TableHead className="text-gray-300">版本</TableHead>
                    <TableHead className="text-gray-300">擁有者</TableHead>
                    <TableHead className="text-gray-300">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSoftwares.map((software, index) => (
                    <TableRow 
                      key={software.appId} 
                      className="border-gray-700 hover:bg-gray-800/30 transition-colors group"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <TableCell className="font-mono text-cyan-400 font-medium">
                        {software.appId}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                          {software.appName}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                          v{software.appVersion}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {software.owner}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link to={`/software/${software.appId}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105"
                          >
                            查看詳情
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredSoftwares.length === 0 && !isLoading && (
            <div className="p-12 text-center text-gray-400">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>沒有找到符合條件的軟體</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
