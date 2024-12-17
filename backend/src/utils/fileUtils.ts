import fs from 'fs/promises';
import path from 'path';

export const ensureUploadDir = async () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

export const cleanupFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('文件清理失败:', error);
  }
}; 