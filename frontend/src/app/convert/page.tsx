'use client';

import { useState } from 'react';
import { Button, Upload, message, Table, Tabs, Select, Radio, Popover } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { read, utils } from 'xlsx';

const { Dragger } = Upload;

const ExcelIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-8 h-8 text-white"
    fill="currentColor"
  >
    <text
      x="12"
      y="17"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-[32px] font-bold"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      E
    </text>
  </svg>
);

// 添加一个颜色数组用于轮换背景色
const HIGHLIGHT_COLORS = [
  'bg-blue-50',
  'bg-purple-50',
  'bg-green-50',
  'bg-amber-50',
  'bg-rose-50',
];

// 修改图表类型配置，添加预览图
const CHART_TYPES = [
  {
    value: 'bar',
    label: '柱状图',
    icon: '📊',
    description: '比较数值大小',
    preview: '/chart-previews/bar.svg'  // 需要准备这些预览图
  },
  {
    value: 'line',
    label: '折线图',
    icon: '📈',
    description: '展示数据趋势',
    preview: '/chart-previews/line.svg'
  },
  {
    value: 'pie',
    label: '饼图',
    icon: '🥧',
    description: '占比分析',
    preview: '/chart-previews/pie.svg'
  },
  {
    value: 'scatter',
    label: '散点图',
    icon: '🔵',
    description: '数据分布',
    preview: '/chart-previews/scatter.svg'
  },
  {
    value: 'area',
    label: '面积图',
    icon: '📉',
    description: '累计趋势',
    preview: '/chart-previews/area.svg'
  },
  {
    value: 'radar',
    label: '雷达图',
    icon: '🎯',
    description: '多维对比',
    preview: '/chart-previews/radar.svg'
  }
];

// 添加预览图组件
const ChartPreview = ({ src }: { src: string }) => (
  <div className="p-2 bg-white rounded-lg shadow-lg">
    <img 
      src={src} 
      alt="图表预览" 
      className="w-[200px] h-[120px] object-contain"
    />
  </div>
);

export default function ConvertPage() {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [excelData, setExcelData] = useState<{ [key: string]: any[] }>({});
  const [columns, setColumns] = useState<{ [key: string]: any[] }>({});
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [activeSheet, setActiveSheet] = useState<string>('');
  const [sheetTitles, setSheetTitles] = useState<{ [key: string]: string }>({});
  const [selectedColumns, setSelectedColumns] = useState<{ [key: string]: string[] }>({});
  const [selectedChartType, setSelectedChartType] = useState<string>('');
  const [showAllSheets, setShowAllSheets] = useState(false);
  const MAX_VISIBLE_SHEETS = 5;

  const processExcelFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      
      const sheetsData: { [key: string]: any[] } = {};
      const sheetsColumns: { [key: string]: any[] } = {};
      const titles: { [key: string]: string } = {};
      
      const baseTitle = file.name.replace(/\.(xlsx|xls)$/i, '');
      
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const merges = sheet['!merges'] || [];
        let title = baseTitle;
        
        const range = utils.decode_range(sheet['!ref'] || 'A1');
        
        const titleMerge = merges.find(merge => 
          merge.s.r < 3 &&
          merge.s.c === 0 &&
          merge.e.c === range.e.c
        );

        if (titleMerge) {
          const titleCell = sheet[utils.encode_cell({ r: titleMerge.s.r, c: titleMerge.s.c })];
          if (titleCell && titleCell.v && typeof titleCell.v === 'string' && titleCell.v.trim()) {
            title = titleCell.v.trim();
            for (let c = titleMerge.s.c; c <= titleMerge.e.c; c++) {
              delete sheet[utils.encode_cell({ r: titleMerge.s.r, c })];
            }
          }
        }

        if (workbook.SheetNames.length > 1) {
          title = `${title} - ${sheetName}`;
        }

        // 创建合并单元格映射
        const mergeMap = new Map();
        merges.forEach(merge => {
          for (let r = merge.s.r; r <= merge.e.r; r++) {
            for (let c = merge.s.c; c <= merge.e.c; c++) {
              if (r !== merge.s.r || c !== merge.s.c) {
                const key = utils.encode_cell({ r, c });
                const startKey = utils.encode_cell({ r: merge.s.r, c: merge.s.c });
                mergeMap.set(key, startKey);
              }
            }
          }
        });

        // 修改数据处理部分
        const rawData = [];
        const headerRow = titleMerge ? titleMerge.s.r + 1 : 0;
        
        // 获取所有列表头
        const headers: string[] = [];
        for (let c = 0; c <= range.e.c; c++) {
          const cellAddress = utils.encode_cell({ r: headerRow, c });
          const cell = sheet[cellAddress];
          if (cell) {
            headers[c] = cell.v.toString();
          } else {
            // 如果表头单元格为空，使用列索引作为表头
            headers[c] = `Column ${c + 1}`;
          }
        }

        // 处理数据行
        for (let r = headerRow + 1; r <= range.e.r; r++) {
          const row: any = {};
          let hasData = false;
          
          for (let c = 0; c <= range.e.c; c++) {
            const cellAddress = utils.encode_cell({ r, c });
            let value = null;

            if (mergeMap.has(cellAddress)) {
              // 获取合并单元格的
              const startKey = mergeMap.get(cellAddress);
              const startCell = sheet[startKey];
              if (startCell) {
                value = startCell.v;
              }
            } else {
              const cell = sheet[cellAddress];
              if (cell) {
                value = cell.v;
              }
            }

            // 即使值为空也要保留列
            row[headers[c]] = value;
            if (value !== null) {
              hasData = true;
            }
          }

          if (hasData) {
            rawData.push(row);
          }
        }

        if (rawData.length > 0) {
          // 检查每列是否有数据
          const columnsWithData = headers.filter((header, index) => {
            // 表头是否为空
            if (!header || header.trim() === '') return false;
            
            // 检查是否有任何行在这列有数据
            return rawData.some(row => {
              const value = row[header];
              return value !== null && value !== undefined && value !== '';
            });
          });

          // 使有数据的列创建列配置
          const columns = columnsWithData.map(header => ({
            title: header,
            dataIndex: header,
            key: header,
            ellipsis: true,
            width: header.length * 20 + 60,  // 根据标题长度动态设置宽度
            minWidth: 120,  // 设置最小列宽
            sorter: (a: any, b: any) => {
              const aValue = a[header];
              const bValue = b[header];
              if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
              }
              return String(aValue || '').localeCompare(String(bValue || ''));
            },
            filters: Array.from(new Set(rawData.map((item: any) => item[header]))).map(value => ({
              text: String(value || ''),
              value: String(value || ''),
            })),
            onFilter: (value: string, record: any) => String(record[header] || '') === value,
          }));

          // 只保留有数据的列
          const filteredData = rawData.map(row => {
            const newRow: any = { key: row.key };
            columnsWithData.forEach(header => {
              newRow[header] = row[header];
            });
            return newRow;
          });

          sheetsData[sheetName] = filteredData;
          sheetsColumns[sheetName] = columns;
          titles[sheetName] = title;
        }
      });

      setExcelData(sheetsData);
      setColumns(sheetsColumns);
      setSheetTitles(titles);
      setActiveSheet(workbook.SheetNames[0]);
    } catch (error) {
      message.error('解析 Excel 文件失败');
      console.error('Excel 解析错误:', error);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    accept: '.xlsx,.xls',
    beforeUpload: (file: File) => {
      processExcelFile(file);
      return false;
    },
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        setIsFileUploaded(true);
      }
      if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
      setFileList(info.fileList);
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    itemRender: (originNode: React.ReactElement, file: any) => (
      <div className="flex items-center gap-2 px-4 py-2 group hover:bg-gray-50">
        <div className="w-8 h-8 flex items-center justify-center bg-green-600/10 rounded-lg">
          <FileExcelOutlined className="text-lg text-green-600" />
        </div>
        <span className="flex-1 text-gray-600">{file.name}</span>
        {file.status === 'uploading' && (
          <span className="text-gray-400">上传中...</span>
        )}
        {file.status === 'done' && (
          <span className="text-green-600">完成</span>
        )}
        {file.status === 'error' && (
          <span className="text-red-600">失败</span>
        )}
        <Button 
          type="text" 
          danger
          size="small"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // 先更新文件列表
            setFileList([]);
            // 清除所有数据
            setExcelData({});
            setColumns({});
            setActiveSheet('');
            // 直接设置为未上传状态，不需要检查文件列表长度
            setIsFileUploaded(false);
            message.success('文件已删除');
          }}
        >
          删除
        </Button>
      </div>
    ),
  };

  const handleColumnSelect = (sheetName: string, selected: string[]) => {
    setSelectedColumns(prev => ({
      ...prev,
      [sheetName]: selected
    }));
  };

  // 修改表格列的渲染逻辑
  const getTableColumns = (sheetName: string) => {
    if (!columns[sheetName]) return [];

    const selected = selectedColumns[sheetName] || [];
    const allColumns = [...columns[sheetName]];

    // 根据选择重新排序列
    allColumns.sort((a, b) => {
      const aIndex = selected.indexOf(a.dataIndex);
      const bIndex = selected.indexOf(b.dataIndex);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    // 为选中的列添加背景色
    return allColumns.map(col => {
      const selectedIndex = selected.indexOf(col.dataIndex);
      if (selectedIndex === -1) {
        return col;
      }

      return {
        ...col,
        className: 'highlighted-column',
        onCell: (record: any) => ({
          className: `${HIGHLIGHT_COLORS[selectedIndex % HIGHLIGHT_COLORS.length]} transition-colors duration-200`,
        }),
        onHeaderCell: () => ({
          className: `${HIGHLIGHT_COLORS[selectedIndex % HIGHLIGHT_COLORS.length]} transition-colors duration-200`,
        }),
      };
    });
  };

  // 修改表格渲染部分
  const renderTable = (sheetName: string) => (
    <div className="overflow-auto">
      <Table 
        columns={getTableColumns(sheetName)} 
        dataSource={excelData[sheetName]}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          size: 'small',
        }}
        className="border border-gray-200 rounded-lg highlighted-table"
        scroll={{ 
          x: getTableColumns(sheetName).reduce((width, col) => width + (col.width || 200), 0),
          y: 400 
        }}
        size="small"
        bordered
        style={{ minWidth: '800px' }}  // 设置最小宽度
      />
    </div>
  );

  // 修改 Tabs 的 children 渲染
  const renderTabContent = (sheetName: string) => (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="mb-2 text-sm text-gray-600">选择关注的数据列</div>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="选择要关注的数据列"
            value={selectedColumns[sheetName] || []}
            onChange={(selected) => handleColumnSelect(sheetName, selected)}
            options={columns[sheetName]?.map(col => ({
              label: col.title,
              value: col.dataIndex,
            }))}
            maxTagCount="responsive"
          />
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="mb-3 text-sm text-gray-600">展示表形式选择</div>
          <Radio.Group 
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
            className="w-full"
          >
            <div className="grid grid-cols-3 gap-3">
              {CHART_TYPES.map(chart => (
                <div
                  key={chart.value}
                  className="relative"
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Popover
                    content={<ChartPreview src={chart.preview} />}
                    placement="top"
                    trigger="hover"
                    overlayClassName="chart-preview-popover"
                    mouseEnterDelay={0.1}
                    mouseLeaveDelay={0}
                  >
                    <Radio.Button 
                      value={chart.value}
                      className={`w-full flex flex-col items-center p-3 text-center h-auto hover:bg-white transition-all duration-200 ${
                        selectedChartType === chart.value 
                          ? 'bg-purple-50/50' 
                          : 'hover:bg-gray-50/80'
                      }`}
                    >
                      <span className={`text-2xl mb-1 transition-transform ${
                        selectedChartType === chart.value 
                          ? 'text-purple-600 scale-110' 
                          : 'text-gray-600'
                      }`}>
                        {chart.icon}
                      </span>
                      <span className="font-medium text-sm mb-0.5">
                        {chart.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {chart.description}
                      </span>
                    </Radio.Button>
                  </Popover>
                </div>
              ))}
            </div>
          </Radio.Group>
        </div>
      </div>

      <div className="overflow-hidden">
        {renderTable(sheetName)}
      </div>
    </div>
  );

  const renderSheetTabs = () => {
    const allSheets = Object.keys(excelData);
    const visibleSheets = showAllSheets ? allSheets : allSheets.slice(0, MAX_VISIBLE_SHEETS);
    const hiddenSheets = allSheets.slice(MAX_VISIBLE_SHEETS);

    return (
      <Tabs
        activeKey={activeSheet}
        onChange={setActiveSheet}
        items={[
          // 先添加可见的 sheets
          ...visibleSheets.map(sheetName => ({
            key: sheetName,
            label: sheetName,
            children: renderTabContent(sheetName),
          })),
          // 如果有隐藏的 sheets，添加一个额外的标签
          !showAllSheets && hiddenSheets.length > 0 ? {
            key: 'more',
            label: (
              <Select
                value="more"
                style={{ width: 120 }}
                dropdownMatchSelectWidth={false}
                onChange={(value) => {
                  if (value === 'all') {
                    setShowAllSheets(true);
                  } else {
                    setActiveSheet(value);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                options={[
                  { label: '更多工作表', value: 'more', disabled: true },
                  ...hiddenSheets.map(sheet => ({
                    label: sheet,
                    value: sheet,
                  })),
                  { label: '显示全部', value: 'all', className: 'border-t' },
                ]}
                className="more-sheets-select"
              />
            ),
            disabled: true,
          } : null,
        ].filter(Boolean)}
        className="mb-4 excel-tabs"
      />
    );
  };

  const renderPreviewArea = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-6"
    >
    

      {Object.keys(excelData).length > 0 && (
        <>
          {renderSheetTabs()}
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 bg-gray-50">
        <div className="max-w-[1800px] mx-auto px-4 py-12">
          {!isFileUploaded ? (
            // 上传前的布局
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8"
            >
              <h1 className="text-2xl font-bold text-center mb-8">
                Excel 转 PPT
              </h1>
              
              <Dragger {...uploadProps} className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ExcelIcon />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/10"></div>
                  </div>
                </div>
                <p className="text-lg">点击或拖拽文件到此处上传</p>
                <p className="text-gray-500">支持 .xlsx, .xls 格式 Excel 文件</p>
              </Dragger>

              <div className="mt-8 text-center">
                <Button
                  type="primary"
                  size="large"
                  loading={uploading}
                  style={{ backgroundColor: '#9333ea', height: '48px', padding: '0 32px' }}
                  className="hover:bg-purple-700"
                  disabled={fileList.length === 0}
                >
                  开始转换
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex gap-6">
              {/* 左侧文件上传区 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-[250px] flex-shrink-0 bg-white rounded-xl shadow-sm"
              >
                <div className="px-6 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">
                    表格文件
                  </h2>
                </div>
                <div className="p-4">
                  <Dragger 
                    {...uploadProps} 
                    className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
                    style={{ minHeight: '120px', maxHeight: '120px' }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ExcelIcon />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/10"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm mb-1">点击或拖拽文件到此处上传</p>
                        <p className="text-xs text-gray-500">支持 .xlsx, .xls 格式</p>
                      </div>
                    </div>
                  </Dragger>

                  <div className="mt-4">
                    <Button
                      type="default"
                      size="middle"
                      block
                      icon={<FileExcelOutlined />}
                      className="border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 hover:text-green-700"
                    >
                      继续上传表格
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* 中间数据预览区 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`${
                  selectedChartType ? 'w-[calc(100%-670px)]' : 'flex-1'
                } bg-white rounded-xl shadow-sm`}
              >
                <div className="px-6 py-6 border-b border-gray-100 flex items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Excel 数据预览
                  </h2>
                  {sheetTitles[activeSheet] && (
                    <>
                      <span className="text-gray-300 mx-2">|</span>
                      <span className="text-lg text-gray-600 font-medium">
                        {sheetTitles[activeSheet]}
                      </span>
                    </>
                  )}
                </div>
                <div className="p-6">
                  {renderPreviewArea()}
                </div>
              </motion.div>

              {/* 右侧图表预览区 */}
              {selectedChartType && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-[400px] flex-shrink-0 bg-white rounded-xl shadow-sm"
                >
                  <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      图表预览
                    </h2>
                    <Button
                      type="primary"
                      style={{ backgroundColor: '#9333ea' }}
                      className="hover:bg-purple-700"
                    >
                      生成图表
                    </Button>
                  </div>
                  <div className="p-6">
                    <div className="h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                      {/* 这里后续添加 ECharts 图表 */}
                      <span className="text-gray-400">图表预览区域</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .highlighted-table .highlighted-column {
          position: relative;
        }
        .highlighted-table .highlighted-column::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 2px;
          height: 100%;
          background: rgba(0, 0, 0, 0.06);
        }
        
        .more-sheets-select .ant-select-item-option-disabled {
          color: #666 !important;
          font-weight: 500;
          background-color: #f5f5f5;
        }
        
        .more-sheets-select .ant-select-selection-item {
          color: #666;
          font-weight: 500;
        }
        
        .excel-tabs .ant-tabs-nav {
          display: flex;
          align-items: center;
        }

        .excel-tabs .ant-tabs-nav-wrap {
          flex: 0 1 auto;  /* 允许宽度收缩 */
          min-width: 0;    /* 允许内容换行 */
          margin-right: 0; /* 移除右边距 */
        }
        
        .excel-tabs .ant-tabs-nav-list {
          flex-wrap: nowrap;
        }

        .excel-tabs .ant-tabs-extra-content {
          flex: 0 0 auto;
          padding-left: 8px; /* 添加左边距 */
        }
        
        .excel-tabs .ant-tabs-nav-operations {
          position: static;
          margin-left: 8px;
        }

        .excel-tabs .more-sheets-select {
          margin-left: 0;
        }

        /* 优化标签样式 */
        .excel-tabs .ant-tabs-tab {
          margin-right: 24px !important;
        }

        .excel-tabs .ant-tabs-tab:last-child {
          margin-right: 8px !important;
        }

        /* 表格滚动条样式 */
        .overflow-auto::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }

        .overflow-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .overflow-auto::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 4px;
        }

        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }

        /* 表格单元格样式 */
        .highlighted-table .ant-table-cell {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chart-preview-popover {
          animation: fadeIn 0.2s ease-out;
        }

        .chart-preview-popover .ant-popover-arrow {
          display: none;
        }

        .chart-preview-popover .ant-popover-inner {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 图表选择项样式 */
        .ant-radio-button-wrapper {
          border-radius: 8px !important;
        }

        .ant-radio-button-wrapper::before {
          display: none !important;
        }

        .ant-radio-button-wrapper:first-child {
          border-radius: 8px !important;
        }

        .ant-radio-button-wrapper:last-child {
          border-radius: 8px !important;
        }

        .ant-radio-button-wrapper-checked {
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.1) !important;
        }
      `}</style>
    </div>
  );
} 