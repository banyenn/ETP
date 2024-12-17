import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import path from 'path';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.log('没有接收到文件');
      return res.status(400).json({ error: '没有上传文件' });
    }

    console.log('接收到文件:', {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype
    });

    // 读取 Excel 文件
    const workbook = XLSX.readFile(req.file.path);
    console.log('Excel 工作簿信息:', {
      sheetNames: workbook.SheetNames,
      numberOfSheets: workbook.SheetNames.length
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为 JSON 数据
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log('解析的数据示例:', data.slice(0, 2));

    res.json({ 
      message: '文件上传成功',
      filename: req.file.filename,
      data: data
    });
  } catch (error) {
    console.error('文件处理错误:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : '文件处理失败'
    });
  }
}; 