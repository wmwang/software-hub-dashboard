
import { Software, SoftwareDetail, DeploymentTask, ApiResponse } from '@/types/software';

// 模擬軟體數據
const mockSoftwares: Software[] = [
  {
    softwareId: "sw-001",
    version: "1.0.0",
    name: "AwesomeApp",
    owner: "user_12345",
    publishedAt: "2025-06-01T10:00:00Z"
  },
  {
    softwareId: "sw-002",
    version: "1.0.2",
    name: "GreatTool",
    owner: "user_67890",
    publishedAt: "2025-06-02T14:30:00Z"
  },
  {
    softwareId: "sw-003",
    version: "2.1.5",
    name: "DataProcessor",
    owner: "user_12345",
    publishedAt: "2025-06-03T09:15:00Z"
  },
  {
    softwareId: "sw-004",
    version: "3.0.1",
    name: "ReportGenerator",
    owner: "user_99999",
    publishedAt: "2025-06-04T16:45:00Z"
  }
];

const mockDeploymentTasks: Record<string, DeploymentTask[]> = {
  'sw-001': [
    {
      taskId: "TASK-20250604143126-001",
      hostname: "server-01.company.com",
      owner: "user_12345",
      action: "install",
      taskStatus: "SUCCEED",
      updateDate: "2025-06-05 10:05:26"
    },
    {
      taskId: "TASK-20250604143127-002",
      hostname: "server-02.company.com",
      owner: "user_12345",
      action: "install",
      taskStatus: "FAILED",
      updateDate: "2025-06-05 10:15:30"
    }
  ],
  'sw-002': [
    {
      taskId: "TASK-20250604143128-003",
      hostname: "server-03.company.com",
      owner: "user_67890",
      action: "update",
      taskStatus: "SUCCEED",
      updateDate: "2025-06-05 11:20:15"
    }
  ]
};

export const softwareService = {
  // 獲取所有軟體列表
  async getSoftwares(): Promise<ApiResponse<Software[]>> {
    // 模擬API延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'SUCCESS',
      errMsg: '',
      data: mockSoftwares
    };
  },

  // 根據軟體ID獲取派送任務
  async getDeploymentTasks(appId: string): Promise<ApiResponse<DeploymentTask[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const tasks = mockDeploymentTasks[appId] || [];
    
    return {
      status: 'SUCCESS',
      errMsg: '',
      data: tasks
    };
  }
};
