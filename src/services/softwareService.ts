
import { Software, DeploymentTask, ApiResponse } from '@/types/software';
// 假設 API 的基礎 URL，通常會放在環境變數中
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api-domain.com/api'; // 根據你的實際情況修改

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
    try {
      const response = await fetch(`${API_BASE_URL}/softwares`);

      if (!response.ok) {
        // 如果 API 返回了錯誤的 HTTP 狀態碼
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('API Error:', response.status, errorData);
        return {
          status: 'ERROR',
          errMsg: errorData.message || `Request failed with status ${response.status}`,
          data: [] // 或者 undefined，取決於你的 ApiResponse 設計
        };
      }

      const data: Software[] = await response.json(); // 假設 API 成功時直接返回 Software[]
      
      return {
        status: 'SUCCESS',
        errMsg: '',
        //data: data
        data: mockSoftwares // 使用模擬數據
      };
    } catch (error) {
      // 處理網路錯誤或其他 fetch 本身的錯誤
      console.error('Network or Fetch Error:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        status: 'ERROR',
        errMsg: errorMessage,
        data: [] // 或者 undefined
      };
    }
  },

  // 根據軟體ID獲取派送任務
  async getDeploymentTasks(appId: string): Promise<ApiResponse<DeploymentTask[]>> {
    if (!appId) {
      return {
        status: 'ERROR',
        errMsg: 'Application ID is required.',
        data: [] // 或者 undefined
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/softwares/${appId}/tasks`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('API Error:', response.status, errorData);
        return {
          status: 'ERROR',
          errMsg: errorData.message || `Request failed with status ${response.status}`,
          data: [] // 或者 undefined
        };
      }

      const data: DeploymentTask[] = await response.json(); // 假設 API 成功時直接返回 DeploymentTask[]
      
      return {
        status: 'SUCCESS',
        errMsg: '',
        //data: data
        data: mockDeploymentTasks[appId] || [];
      };
    } catch (error) {
      console.error('Network or Fetch Error:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        status: 'ERROR',
        errMsg: errorMessage,
        data: [] // 或者 undefined
      };
    }
  }
};

// 你可能還需要從 @/types/software 匯入類型 (如果它們在個別檔案中)
// import { Software, DeploymentTask, ApiResponse } from '@/types/software';