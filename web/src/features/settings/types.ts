export type McpScope = 'read' | 'read · write';

export type McpToken = { id: string; name: string; prefix: string; scope: McpScope; last: string };

export type GoogleCalendarSetting = { name: string; hue: number; on: boolean; count: number };

export type NotificationKey = 'ev' | 'todo' | 'b80' | 'b100' | 'rain' | 'mail';

export type Settings = {
  city: string;
  theme: '라이트' | '다크' | '시스템';
  /** 0=일요일, 1=월요일 */
  weekStart: 0 | 1;
  google: { connected: boolean; email: string; calendars: GoogleCalendarSetting[] };
  notifications: Record<NotificationKey, boolean>;
};

export interface SettingsApi {
  getSettings(): Promise<Settings>;
  updateSettings(patch: Partial<Settings>): Promise<Settings>;
  listTokens(): Promise<McpToken[]>;
  /** 원문 토큰은 이 반환값으로 한 번만 볼 수 있다. */
  issueToken(scope: McpScope): Promise<{ raw: string; token: McpToken }>;
  revokeToken(id: string): Promise<void>;
}
