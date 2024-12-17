export interface UploadResponse {
  message: string;
  filename: string;
  data: any[];
}

export interface ExcelData {
  [key: string]: any;
} 