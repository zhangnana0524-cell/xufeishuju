# 项目结构详解

## 📁 目录树

```
renewal-dashboard/
├── src/
│   ├── components/          # React组件
│   │   ├── FileUpload.jsx   # 文件上传组件
│   │   ├── KPICards.jsx     # KPI指标卡片
│   │   ├── Charts.jsx       # 图表组件
│   │   └── DataTable.jsx    # 数据表格组件
│   ├── utils/               # 工具函数
│   │   ├── excelParser.js   # Excel文件解析
│   │   └── dataProcessor.js # 数据处理和聚合
│   ├── assets/              # 静态资源
│   ├── App.jsx              # 主应用组件
│   ├── App.css              # 应用样式
│   ├── index.css            # 全局样式（Tailwind）
│   └── main.jsx             # 应用入口
├── dist/                    # 构建输出（生产）
├── public/                  # 公开文件
├── node_modules/            # 依赖包
├── package.json             # 项目依赖和脚本
├── vite.config.js           # Vite配置
├── tailwind.config.js       # Tailwind CSS配置
├── postcss.config.js        # PostCSS配置
├── vercel.json              # Vercel部署配置
├── README.md                # 项目说明
├── DEPLOYMENT.md            # 部署指南
├── QUICK_START.md           # 快速开始指南
└── PROJECT_STRUCTURE.md     # 本文件

```

## 🔧 核心组件说明

### 1. FileUpload.jsx
**功能：** 文件上传和拖拽
- 支持点击上传
- 支持拖拽上传
- 只接受 .xlsx 和 .xls 格式
- 提供加载状态反馈

**关键方法：**
- `handleFileChange()` - 处理文件选择
- `handleDrop()` - 处理拖拽
- `handleDragOver/Leave()` - 拖拽视觉反馈

### 2. KPICards.jsx
**功能：** 显示关键指标
- 总学生数
- 已续费人数
- 未续费人数
- 续费率百分比

**特点：**
- 响应式网格布局
- 彩色图标和背景
- 清晰的数字展示

### 3. Charts.jsx
**功能：** 数据可视化
三个图表组件：

#### LevelChart
- 按级别的续费统计
- 分组柱状图
- 显示：已续费、未续费、联报

#### StatusChart
- 续费状态分布
- 饼图展示
- 百分比标签

#### RenewalRateChart
- 教师续费率排名
- 横向柱状图
- 显示TOP 10教师

### 4. DataTable.jsx
**功能：** 可排序的数据表格
- 动态列配置
- 点击列标题排序
- 支持自定义渲染
- 响应式设计

**特点：**
- 升序/降序切换
- 视觉排序指示器
- 空数据处理

## 🔨 工具函数说明

### excelParser.js
```javascript
parseExcelFile(file) -> Promise<Array>
```
- 使用 xlsx 库读取Excel文件
- 自动转换为JSON格式
- 返回Promise便于异步处理

### dataProcessor.js

#### processData(rawData)
**输入：** Excel解析后的原始数据数组

**输出：** 处理后的对象包含：
```javascript
{
  totalStudents: number,      // 总学生数
  renewed: number,             // 已续费数
  notRenewed: number,          // 未续费数
  combined: number,            // 联报数
  renewalRate: string,         // 续费率%
  byLevel: Array,              // 按级别分组
  byTeacher: Array,            // 按教师分组
  byClass: Array,              // 按班级分组
  byStatus: Array,             // 按状态分组
  details: Array               // 原始数据
}
```

**处理流程：**
1. 过滤有效数据（有student_id）
2. 规范化续费状态值
3. 按多个维度分组统计
4. 计算续费率和聚合指标

#### normalizeRenewalStatus(status)
将各种续费状态转换为标准格式：
- "已续费"、"续费" → "已续费"
- "联报" → "联报"
- "未续费"、"未" → "未续费"

#### exportToCSV(data, filename)
导出教师续费统计为CSV文件

## 📊 数据流

```
Excel File
    ↓
FileUpload (parsing)
    ↓
excelParser.parseExcelFile()
    ↓
processData() → Processed Data
    ↓
localStorage (save)
    ↓
Components (rendering)
    ├── KPICards
    ├── LevelChart
    ├── StatusChart
    ├── RenewalRateChart
    └── DataTable
```

## 🎨 样式框架

### Tailwind CSS
- 响应式设计
- 工具类优先
- 自定义配置在 `tailwind.config.js`

### DaisyUI
- 基于Tailwind的UI组件库
- 预制的组件类
- 使用：`btn`, `badge`, `card`, `table`等

## 🔄 用户交互流

```
1. 用户上传Excel
   ↓
2. FileUpload解析文件
   ↓
3. excelParser读取Excel
   ↓
4. processData处理数据
   ↓
5. 保存到localStorage
   ↓
6. 更新React状态
   ↓
7. 组件re-render
   ↓
8. 显示看板和报表
   ↓
9. 用户可以：
   - 查看图表和表格
   - 排序表格数据
   - 导出CSV
   - 上传新文件
```

## 📦 依赖包说明

| 包名 | 版本 | 用途 |
|------|------|------|
| react | ^18 | UI框架 |
| vite | ^8 | 构建工具 |
| xlsx | ^0.18 | Excel读取 |
| recharts | ^2.12 | 图表库 |
| tailwindcss | ^4 | CSS框架 |
| daisyui | ^4 | UI组件库 |
| postcss | ^8 | CSS处理 |

## 🚀 构建和部署

### 开发
```bash
npm run dev      # 启动开发服务器
```

### 生产构建
```bash
npm run build    # 构建dist目录
npm run preview  # 预览构建结果
```

### 部署配置
- **Vercel**：自动识别，无需配置
- **Netlify**：自动识别，无需配置
- **其他**：运行 `npm run build`，部署 `dist` 目录

## 🔒 数据安全

✅ **优点：**
- 所有处理在浏览器本地完成
- 无数据上传到服务器
- 用户数据隐私有保障

⚠️ **局限性：**
- 大文件处理速度可能较慢
- 依赖浏览器性能
- 清除缓存会丢失数据

## 🎯 性能指标

典型场景：
- **文件解析时间**：< 2秒（2000+行）
- **数据处理时间**：< 1秒
- **首屏加载**：< 3秒
- **交互响应**：< 100ms

## 🔮 未来扩展可能性

1. **多文件支持**
   - 同时上传多个Excel
   - 合并数据分析

2. **高级筛选**
   - 日期范围筛选
   - 多条件组合筛选

3. **导出增强**
   - PDF报告
   - 多格式导出

4. **实时更新**
   - 集成API数据源
   - WebSocket实时同步

5. **数据库集成**
   - 保存数据到服务器
   - 历史数据对比

6. **权限管理**
   - 用户认证
   - 数据访问控制

---

**更新于：** 2026-06-12
**项目版本：** v1.0.0
