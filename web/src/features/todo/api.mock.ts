import type { Priority, Project, Todo, TodoApi, TodoStatus } from './types';

const d = (day: number | null) => (day === null ? null : `2026-10-${String(day).padStart(2, '0')}`);
const P: Record<string, Priority> = { 상: 1, 중: 2, 하: 3 };
const mk = (id: number, title: string, prio: string, project: string, due: number | null, status: TodoStatus): Todo => ({
  id: `t${id}`, title, memo: null, dueDate: d(due), priority: P[prio], status, project,
  completedAt: status === 'done' ? '2026-10-13T03:00:00.000Z' : null,
});

let seq = 100;
let todos: Todo[] = [
  mk(1, '관리비 납부', '중', '생활', 13, 'todo'),
  mk(2, '분기 보고서 초안 작성', '상', '업무', 14, 'doing'),
  mk(3, '택배 반품 신청', '하', '생활', 14, 'todo'),
  mk(4, '세탁소 코트 찾기', '하', '생활', 14, 'done'),
  mk(5, '마감 회의 자료 준비', '상', '업무', 16, 'doing'),
  mk(6, '결혼식 축의금 준비', '중', '생활', 17, 'todo'),
  mk(7, '출장 숙소 예약', '중', '업무', 18, 'done'),
  mk(8, '독서 모임 책 읽기', '하', '개인', null, 'todo'),
];

export const mockTodoApi: TodoApi = {
  async listTodos(filter = {}) {
    return todos.filter((t) => {
      if (filter.status === 'open' && t.status === 'done') return false;
      if (filter.status && filter.status !== 'open' && t.status !== filter.status) return false;
      if (filter.dueTo && !(t.dueDate !== null && t.dueDate <= filter.dueTo)) return false;
      if (filter.project && t.project !== filter.project) return false;
      return true;
    });
  },
  async createTodo(input) {
    const t: Todo = { memo: null, dueDate: null, priority: 2, status: 'todo', project: null, ...input, id: `t${seq++}`, completedAt: null };
    todos = [t, ...todos];
    return t;
  },
  async updateTodo(id, patch) {
    const cur = todos.find((t) => t.id === id);
    if (!cur) throw new Error('할일을 찾을 수 없어요.');
    const next = { ...cur, ...patch, id } as Todo;
    todos = todos.map((t) => (t.id === id ? next : t));
    return next;
  },
  async setStatus(id, status) {
    const cur = todos.find((t) => t.id === id);
    if (!cur) throw new Error('할일을 찾을 수 없어요.');
    const next: Todo = { ...cur, status, completedAt: status === 'done' ? new Date().toISOString() : null };
    todos = todos.map((t) => (t.id === id ? next : t));
    return next;
  },
  async deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
  },
  async listProjects() {
    return ['업무', '생활', '개인'].map<Project>((name, i) => {
      const l = todos.filter((t) => t.project === name);
      return { id: `p${i + 1}`, name, total: l.length, done: l.filter((t) => t.status === 'done').length };
    });
  },
};
