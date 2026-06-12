import { useState, useEffect, useMemo, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { KPICards } from './components/KPICards';
import { LevelChart, StatusChart, RenewalRateChart } from './components/Charts';
import { DataTable } from './components/DataTable';
import { LevelTeacherTable } from './components/LevelTeacherTable';
import { parseExcelFile } from './utils/excelParser';
import { processData, exportToCSV } from './utils/dataProcessor';
import './App.css';

const ALL = '全部';

function App() {
  const [rawData, setRawData] = useState(null);
  const [updateTime, setUpdateTime] = useState(null);
  const [isTempData, setIsTempData] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [filterLevel, setFilterLevel] = useState(ALL);
  const [filterTeacher, setFilterTeacher] = useState(ALL);
  const fileInputRef = useRef(null);

  // 启动时直接加载内置数据，打开链接即可查看
  useEffect(() => {
    fetch('/data.json')
      .then(r => {
        if (!r.ok) throw new Error('内置数据不存在');
        return r.json();
      })
      .then(({ updatedAt, rows }) => {
        setRawData(rows);
        setUpdateTime(updatedAt);
      })
      .catch(() => setLoadFailed(true));
  }, []);

  // 全量统计：用于生成筛选器选项
  const fullData = useMemo(
    () => (rawData ? processData(rawData) : null),
    [rawData]
  );

  // 筛选后统计：看板所有模块联动
  const processedData = useMemo(
    () => (rawData ? processData(rawData, { level: filterLevel, teacher: filterTeacher }) : null),
    [rawData, filterLevel, filterTeacher]
  );

  // 级别选项 + 当前级别下的老师选项
  const levelOptions = useMemo(
    () => (fullData ? fullData.byLevelTeacher.map(g => g.level) : []),
    [fullData]
  );
  const teacherOptions = useMemo(() => {
    if (!fullData) return [];
    const groups = filterLevel === ALL
      ? fullData.byLevelTeacher
      : fullData.byLevelTeacher.filter(g => g.level === filterLevel);
    const names = new Set();
    groups.forEach(g => g.teachers.forEach(t => names.add(t.name)));
    return [...names].sort((a, b) => a.localeCompare(b, 'zh'));
  }, [fullData, filterLevel]);

  const handleLevelChange = (level) => {
    setFilterLevel(level);
    setFilterTeacher(ALL); // 切换级别时重置老师筛选
  };

  const hasFilter = filterLevel !== ALL || filterTeacher !== ALL;

  // 临时上传：仅本次浏览生效，刷新后恢复内置数据
  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await parseExcelFile(file);
      setRawData(data);
      setUpdateTime(new Date().toLocaleString('zh-CN', { hour12: false }));
      setIsTempData(true);
      setFilterLevel(ALL);
      setFilterTeacher(ALL);
    } catch (error) {
      alert('文件读取失败: ' + error.message);
    }
    event.target.value = '';
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
          <p className="text-base-content/70">
            各级别·带班老师续费率分析（续费动作已结束班期）
          </p>
          {updateTime && (
            <p className="text-sm text-base-content/50 mt-1">
              📅 数据更新于 {updateTime}
              {isTempData && '（临时数据，刷新页面恢复）'}
            </p>
          )}
        </div>

        {processedData ? (
          <div className="space-y-6">
            {/* 筛选栏 */}
            <div className="card bg-base-100 shadow-md border border-base-300">
              <div className="card-body py-4 flex-row flex-wrap items-center gap-4">
                <span className="font-semibold text-sm">🔍 筛选：</span>
                <label className="flex items-center gap-2 text-sm">
                  级别
                  <select
                    className="select select-bordered select-sm"
                    value={filterLevel}
                    onChange={(e) => handleLevelChange(e.target.value)}
                  >
                    <option value={ALL}>全部级别</option>
                    {levelOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  带班老师
                  <select
                    className="select select-bordered select-sm"
                    value={filterTeacher}
                    onChange={(e) => setFilterTeacher(e.target.value)}
                  >
                    <option value={ALL}>全部老师</option>
                    {teacherOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </label>
                {hasFilter && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setFilterLevel(ALL); setFilterTeacher(ALL); }}
                  >
                    ✕ 清除筛选
                  </button>
                )}
                <span className="text-xs text-base-content/50 ml-auto">
                  {hasFilter
                    ? `当前筛选：${filterLevel !== ALL ? filterLevel : ''} ${filterTeacher !== ALL ? filterTeacher : ''}`
                    : '展示全部数据'}
                </span>
              </div>
            </div>

            {/* KPI卡片 */}
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
                onClick={() => fileInputRef.current?.click()}
              >
                📤 上传Excel临时查看
              </button>
              {isTempData && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => location.reload()}
                >
                  ↩️ 恢复看板数据
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileSelected}
              />
            </div>

            {/* 级别×老师 续费率分析（核心报表） */}
            <LevelTeacherTable data={processedData.byLevelTeacher} />

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {processedData.byLevel.length > 0 && (
                <LevelChart data={processedData.byLevel} />
              )}
              {processedData.byStatus.length > 0 && (
                <StatusChart data={processedData.byStatus} />
              )}
            </div>

            {processedData.byTeacher.length > 1 && (
              <RenewalRateChart data={processedData.byTeacher} />
            )}

            {/* 教师续费统计（前10名） */}
            <DataTable
              title="教师续费统计 TOP 10"
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
              data={processedData.byTeacher.slice(0, 10)}
            />
          </div>
        ) : loadFailed ? (
          // 内置数据缺失时退回上传模式
          <div className="space-y-4">
            <p className="text-center text-base-content/50">未找到内置数据，请上传 Excel 文件查看</p>
            <div className="flex justify-center">
              <FileUpload
                onDataLoaded={(data) => {
                  setRawData(data);
                  setUpdateTime(new Date().toLocaleString('zh-CN', { hour12: false }));
                  setIsTempData(true);
                }}
                isLoading={false}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-base-content/50">
            <p className="text-lg">数据加载中…</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
