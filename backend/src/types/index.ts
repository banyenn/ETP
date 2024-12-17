export interface ExcelData {
  [key: string]: any;
}

export interface UploadedFile extends Express.Multer.File {
  filename: string;
  path: string;
} 