import React, { useRef } from 'react';
import { parseExcelFile } from '../utils/excelParser';

export const FileUpload = ({ onDataLoaded, isLoading }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseExcelFile(file);
      onDataLoaded(data);
    } catch (error) {
      alert('文件读取失败: ' + error.message);
    }

    // 清空input
    event.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-primary/10');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-primary/10');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary/10');

    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.items;
      handleFileChange({ target: { files: dataTransfer.items } });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-primary/5"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-3">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-semibold text-base-content">
              {isLoading ? '加载中...' : '点击上传或拖拽 Excel 文件'}
            </p>
            <p className="text-sm text-base-content/70 mt-1">
              支持 .xlsx 和 .xls 格式
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
