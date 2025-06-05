
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Monitor, Bot, Rocket, CircuitBoard, Sparkles } from 'lucide-react';

const Index = () => {
  const [glitchText, setGlitchText] = useState('AI軟體派送中心');

  useEffect(() => {
    const interval = setInterval(() => {
      const original = 'AI軟體派送中心';
      const glitched = original.split('').map(char => 
        Math.random() > 0.9 ? String.fromCharCode(Math.random() * 26 + 65) : char
      ).join('');
      setGlitchText(glitched);
      
      setTimeout(() => setGlitchText(original), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: '智能軟體管理',
      description: '運用AI技術自動化軟體部署與管理流程',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Zap,
      title: '即時派送監控',
      description: '實時追踪軟體派送狀態，確保零延遲響應',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Monitor,
      title: '統一管理平台',
      description: '集中式管理所有企業軟體，提升運營效率',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 matrix-bg">
      {/* 背景動畫元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl floating-animation"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* 標題區域 */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="relative">
              <Bot className="h-16 w-16 text-blue-500 pulse-glow" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
            </div>
            <CircuitBoard className="h-12 w-12 text-purple-500 floating-animation" />
            <Sparkles className="h-10 w-10 text-cyan-500 floating-animation" style={{animationDelay: '1s'}} />
          </div>
          
          <h1 className="text-6xl font-bold mb-6 ai-text-glow bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {glitchText}
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            革命性的企業軟體管理平台，整合人工智能技術，
            為您提供智能化的軟體派送與監控解決方案
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/software">
              <Button className="ai-button text-white px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:scale-105">
                <Rocket className="mr-2 h-5 w-5" />
                開始探索軟體中心
              </Button>
            </Link>
            <Link to="/software/sw-001">
              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-lg transition-all duration-300">
                <Monitor className="mr-2 h-5 w-5" />
                查看派送詳情
              </Button>
            </Link>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="ai-card-light border-0 hover:scale-105 transition-all duration-300 pulse-glow group">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 統計數據展示 */}
        <div className="ai-card-light rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 ai-text-glow">系統運行狀態</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                2,847
              </div>
              <div className="text-gray-600">活躍軟體</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                99.9%
              </div>
              <div className="text-gray-600">成功率</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                1,432
              </div>
              <div className="text-gray-600">今日部署</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-gray-600">監控服務</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
