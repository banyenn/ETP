'use client';

import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useState } from 'react';
import { ExcelPreview } from '../ExcelPreview';
import 'antd/dist/reset.css';

const { Dragger } = Upload;

export const FileUpload = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://localhost:3001/api/upload',
    accept: '.xlsx,.xls',
    onChange(info) {
      const { status } = info.file;
      if (status === 'uploading') {
        message.loading(`${info.file.name} 正在上传...`);
      } else if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        console.log('服务器返回数据:', info.file.response);
        
        if (info.file.response?.data) {
          const data = info.file.response.data;
          console.log('Excel 数据:', data);
          setExcelData(data);
          setColumns(Object.keys(data[0] || {}));
          setShowPreview(true);
        } else {
          message.warning('服务器未返回 Excel 数据');
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
        console.error('上传错误:', info.file.response);
      }
    }
  };

  const handleColumnsSelected = (selectedColumns: string[]) => {
    console.log('选中的列:', selectedColumns);
    // TODO: 调用后端 API 生成图表
  };

  return (
    <div className="space-y-8">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">支持 .xlsx 和 .xls 格式的 Excel 文件</p>
      </Dragger>

      {showPreview && excelData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Excel 数据预览</h2>
          <ExcelPreview 
            data={excelData}
            columns={columns}
            onColumnsSelected={handleColumnsSelected}
          />
        </div>
      )}

      {showPreview && excelData.length === 0 && (
        <div className="text-red-500">
          Excel 文件似乎是空的
        </div>
      )}
    </div>
  );
} 