
export interface Software {
  softwareId: string;
  version: string;
  name: string;
  owner: string;
  publishedAt: string;
}

export interface SoftwareDetail {
  appId: string;
  owner: string;
  appName: string;
  appVersion: string;
}

export interface DeploymentTask {
  taskId: string;
  hostname: string;
  owner: string;
  action: 'install' | 'uninstall' | 'update';
  taskStatus: 'SUCCEED' | 'FAILED' | 'PENDING' | 'RUNNING';
  updateDate: string;
}

export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  errMsg: string;
  data: T;
}
