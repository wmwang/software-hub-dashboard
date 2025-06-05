
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Users, Calendar, TrendingUp, Activity, BarChart3, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatCard } from '@/components/software/StatCard';
import { SoftwareFilter, FilterState } from '@/components/software/SoftwareFilter';
import { SoftwareChart } from '@/components/software/SoftwareChart';
import { softwareService } from '@/services/softwareService';
import { Software } from '@/types/software';

export const SoftwareList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    owner: '',
    dateRange: ''
  });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['softwares'],
    queryFn: softwareService.getSoftwares,
  });

  const softwares = response?.data || [];

  // 應用篩選邏輯
  const filteredSoftwares = softwares.filter((software) => {
    const matchesSearch = 
      software.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      software.softwareId.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesOwner = !filters.owner || software.owner.includes(filters.owner);
    
    const matchesDate = !filters.dateRange || 
      new Date(software.publishedAt).toISOString().split('T')[0] === filters.dateRange;

    return matchesSearch && matchesOwner && matchesDate;
  });

  // 統計數據
  const totalSoftwares = softwares.length;
  const uniqueOwners = new Set(softwares.map(s => s.owner)).size;
  const recentSoftwares = softwares.filter(s => {
    const publishDate = new Date(s.publishedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return publishDate > weekAgo;
  }).length;

  // 計算今日新增軟體
  const todaysSoftwares = softwares.filter(s => {
    const publishDate = new Date(s.publishedAt);
    const today = new Date();
    return publishDate.toDateString() === today.toDateString();
  }).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (softwareId: string) => {
    navigate(`/software/${softwareId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>載入失敗，請稍後再試</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 標題 */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">軟體派送中心</h1>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            管理和監控企業軟體派送狀況
          </p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="總軟體數量"
            value={totalSoftwares}
            description="已上架軟體總數"
            icon={<Package className="h-4 w-4 text-blue-600" />}
          />
          <StatCard
            title="軟體擁有者"
            value={uniqueOwners}
            description="不重複擁有者數量"
            icon={<Users className="h-4 w-4 text-green-600" />}
          />
          <StatCard
            title="本週新增"
            value={recentSoftwares}
            description="近7天上架軟體"
            icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
          />
          <StatCard
            title="今日新增"
            value={todaysSoftwares}
            description="今天上架的軟體"
            icon={<Clock className="h-4 w-4 text-orange-600" />}
          />
        </div>

        {/* 統計圖表 */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold">統計圖表</h2>
          </div>
          <SoftwareChart softwares={softwares} />
        </div>

        {/* 篩選器 */}
        <SoftwareFilter onFilterChange={setFilters} />

        {/* 軟體列表 */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold">軟體列表</h2>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              顯示 {filteredSoftwares.length} 個軟體
            </p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>軟體ID</TableHead>
                <TableHead>軟體名稱</TableHead>
                <TableHead>版本</TableHead>
                <TableHead>擁有者</TableHead>
                <TableHead>上架時間</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSoftwares.map((software) => (
                <TableRow key={software.softwareId} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">
                    {software.softwareId}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      {software.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit">
                      <TrendingUp className="h-3 w-3" />
                      v{software.version}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      {software.owner}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(software.publishedAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(software.softwareId)}
                      className="hover:bg-blue-50"
                    >
                      查看詳情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSoftwares.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>沒有找到符合條件的軟體</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
