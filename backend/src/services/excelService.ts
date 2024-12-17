import XLSX from 'xlsx';

export const parseExcel = async (filePath: string) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    throw new Error('Excel 文件解析失败');
  }
}; 