import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.css';

interface DataType {
  [key: string]: string | number;
}

interface PreviewAreaProps {
  data: DataType[];
  columns: ColumnsType<DataType>;
  title?: string;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ data, columns, title }) => {
  return (
    <div className={styles.previewArea}>
      {title && (
        <div className={styles.header}>
          <h2>{title}</h2>
        </div>
      )}
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%' }}
        className={styles.table}
      />
    </div>
  );
};

export default PreviewArea;
