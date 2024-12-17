import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    console.log('设置文件保存目录');
    cb(null, 'uploads/');
  },
  filename: (req: any, file: any, cb: any) => {
    console.log('原始文件名:', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('生成的文件名:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    console.log('检查文件类型:', file.mimetype);
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls') {
      console.log('文件类型不支持:', ext);
      return cb(new Error('只支持 Excel 文件'));
    }
    console.log('文件类型验证通过');
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  }
});

module.exports = upload;
