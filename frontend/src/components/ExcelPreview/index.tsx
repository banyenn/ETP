'use client';

import { Table, Select, Button, Space } from 'antd';
import { useState } from 'react';

interface ExcelPreviewProps {
  data: any[];
  columns: string[];
  onColumnsSelected: (columns: string[]) => void;
}

export const ExcelPreview = ({ data, columns, onColumnsSelected }: ExcelPreviewProps) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const tableColumns = columns.map(col => ({
    title: col,
    dataIndex: col,
    key: col,
  }));

  const handleColumnSelect = (values: string[]) => {
    setSelectedColumns(values);
  };

  const handleConfirm = () => {
    onColumnsSelected(selectedColumns);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <Space direction="vertical" className="w-full">
          <h3 className="text-lg font-medium">选择关注的数据列</h3>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择要展示的数据列"
            value={selectedColumns}
            onChange={handleColumnSelect}
            options={columns.map(col => ({ label: col, value: col }))}
          />
          <Button type="primary" onClick={handleConfirm}>
            确认选择
          </Button>
        </Space>
      </div>
      <Table 
        dataSource={data} 
        columns={tableColumns}
        scroll={{ x: true }}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}; 