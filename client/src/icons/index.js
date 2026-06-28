/**
 * SVG 图标路径集合
 * 基于 Lucide Icons (MIT) 风格的扁平化线框图标
 * 所有图标统一 24x24 viewBox，stroke-width: 2，stroke-linecap: round，stroke-linejoin: round
 * 每个图标为 string[]，每项代表一条 <path> 的 d 属性
 */

export const icons = {
  // 导航/操作
  arrowUp: ['M12 19V5m-7 7 7-7 7 7'],
  chevronUp: ['m18 15-6-6-6 6'],
  chevronDown: ['m6 9 6 6 6-6'],
  chevronRight: ['m9 18 6-6-6-6'],
  close: ['M18 6 6 18M6 6l12 12'],
  refresh: [
    'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8',
    'M3 3v5h5',
    'M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16',
    'M21 21v-5h-5',
  ],
  search: ['m21 21-4.35-4.35', 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z'],
  home: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],

  // 文件/文件夹
    folder: [
      'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16Z',
    ],
    folderPlus: [
      'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16Z',
      'M12 10v6m-3-3h6',
    ],
  file: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
  ],
  check: ['M20 6 9 17l-5-5'],

  // 位置/设备
  monitor: ['M9.5 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5.5', 'M12 14v4', 'M8 18h8'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  hardDrive: [
    'M22 12H2',
    'M5.2 5.2 3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6l-2.2-6.8A2 2 0 0 0 17 4H7a2 2 0 0 0-1.8 1.2Z',
    'M6 16h.01M10 16h.01',
  ],

  // 状态
  circleX: ['m14.5 9.5-5 5m0-5 5 5', 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z'],
  circleCheck: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4 12 14.01l-3-3'],

  // 展开/收起
  caretDown: ['m6 9 6 6 6-6'],
  caretRight: ['m9 18 6-6-6-6'],
};

// 文件类型图标 — 按扩展名映射，返回 { color } 用于给 file 图标着色
export const fileTypeColors = {
  // 代码
  js: '#f0db4f', jsx: '#61dafb', ts: '#3178c6', tsx: '#3178c6',
  vue: '#42b883', html: '#e34c26', css: '#264de4', scss: '#cf649a',
  py: '#3776ab', java: '#ed8b00', go: '#00add8', rs: '#dea584',
  c: '#a8b9cc', cpp: '#00599c',
  // 数据/配置
  json: '#a78bfa', yml: '#cb171e', yaml: '#cb171e', toml: '#9c4121',
  csv: '#217346',
  // 文档
  md: '#8b91a8', txt: '#8b91a8', pdf: '#e74c3c',
  doc: '#2b579a', docx: '#2b579a', xls: '#217346', xlsx: '#217346',
  // 图片
  png: '#9b59b6', jpg: '#9b59b6', jpeg: '#9b59b6', gif: '#9b59b6',
  svg: '#ffb13b', webp: '#9b59b6',
  // 媒体
  mp4: '#e74c3c', mp3: '#1db954', wav: '#1db954',
  // 压缩
  zip: '#f59e0b', rar: '#f59e0b', '7z': '#f59e0b', gz: '#f59e0b', tar: '#f59e0b',
};

export const defaultFileColor = '#8b91a8';

/**
 * 获取文件类型颜色
 */
export function getFileTypeColor(ext) {
  return fileTypeColors[ext] || defaultFileColor;
}
