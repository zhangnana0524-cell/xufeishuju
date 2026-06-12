import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { KPICards } from './components/KPICards';
import { LevelChart, StatusChart, RenewalRateChart } from './components/Charts';
import { DataTable } from './components/DataTable';
import { processData, exportToCSV } from './utils/dataProcessor';
import './App.css';

function App() {
  const [rawData, setRawData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('renewalData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setRawData(data);
        setProcessedData(processData(data));
      } catch (e) {
        console.error('加载保存的数据失败', e);
      }
    }
  }, []);

  const handleDataLoaded = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setRawData(data);
      const processed = processData(data);
      setProcessedData(processed);
      localStorage.setItem('renewalData', JSON.stringify(data));
      setIsLoading(false);
    }, 300);
  };

  const handleExport = () => {
    if (processedData) {
      exportToCSV(processedData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-base-content mb-2">续费数据看板</h1>
          <p className="text-base-content/70">实时分析班级续费情况</p>
        </div>

        <div className="mb-8 flex justify-center">
          <FileUpload onDataLoaded={handleDataLoaded} isLoading={isLoading} />
        </div>

        {processedData ? (
          <div className="space-y-6">
            <KPICards data={processedData} />

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleExport}
              >
                📥 导出数据
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setRawData(null);
                  setProcessedData(null);
                  localStorage.removeItem('renewalData');
                }}
              >
                🔄 重新上传
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {processedData.byLevel.length > 0 && (
                <LevelChart data={processedData.byLevel} />
              )}
              {processedData.byStatus.length > 0 && (
                <StatusChart data={processedData.byStatus} />
              )}
            </div>

            {processedData.byTeacher.length > 0 && (
              <RenewalRateChart data={processedData.byTeacher} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataTable
                title="教师续费统计"
                columns={[
                  { label: '教师名称', key: 'name' },
                  { label: '总人数', key: 'total' },
                  { label: '已续费', key: 'renewed' },
                  { label: '联报', key: 'combined' },
                  { label: '未续费', key: 'notRenewed' },
                  {
                    label: '续费率(%)',
                    key: 'rate',
                    render: (val) => (
                      <span className="badge badge-primary">{val}%</span>
                    )
                  }
                ]}
                data={processedData.byTeacher}
              />

              <DataTable
                title="班级续费统计"
                columns={[
                  { label: '班级名称', key: 'name' },
                  { label: '总人数', key: 'total' },
                  { label: '已续费', key: 'renewed' },
                  { label: '联报', key: 'combined' },
                  { label: '未续费', key: 'notRenewed' },
                  {
                    label: '续费率(%)',
                    key: 'rate',
                    render: (val) => (
                      <span className="badge badge-primary">{val}%</span>
                    )
                  }
                ]}
                data={processedData.byClass}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-base-content/50">
            <p className="text-lg">请上传 Excel 文件开始分析</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
