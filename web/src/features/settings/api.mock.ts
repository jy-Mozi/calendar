import type { McpToken, Settings, SettingsApi } from './types';

let seq = 100;
let settings: Settings = {
  city: '서울',
  theme: '라이트',
  weekStart: 0,
  google: {
    connected: true,
    email: 'minji@gmail.com',
    calendars: [
      { name: '내 캘린더', hue: 255, on: true, count: 42 },
      { name: '회사', hue: 55, on: true, count: 31 },
      { name: '대한민국 공휴일', hue: 20, on: true, count: 18 },
      { name: '생일', hue: 320, on: false, count: 9 },
    ],
  },
  notifications: { ev: true, todo: true, b80: true, b100: true, rain: false, mail: false },
};
let tokens: McpToken[] = [
  { id: 'k1', name: 'Claude Desktop', prefix: 'mcp_7f3a', scope: 'read · write', last: '오늘 12:41' },
  { id: 'k2', name: 'Claude Code', prefix: 'mcp_c21e', scope: 'read', last: '어제' },
];

export const mockSettingsApi: SettingsApi = {
  async getSettings() {
    return settings;
  },
  async updateSettings(patch) {
    settings = { ...settings, ...patch };
    return settings;
  },
  async listTokens() {
    return tokens;
  },
  async issueToken(scope) {
    const raw = 'mcp_' + Array.from({ length: 32 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    const token: McpToken = { id: `k${seq++}`, name: `새 토큰 ${tokens.length + 1}`, prefix: raw.slice(0, 8), scope, last: '사용 전' };
    tokens = [token, ...tokens];
    return { raw, token };
  },
  async revokeToken(id) {
    tokens = tokens.filter((t) => t.id !== id);
  },
};
