'use client';
// 할일 화면 표시 값. ?view=list|board  ?filter=today|all|done
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/components/shell/AppContext';
import { C, pill } from '@/components/ui/colors';
import type { Vals } from '@/components/ui/vals';
import { todoApi } from '@/features/todo/api';
import { decorateTodo, isTodayTodo, STATUS_LABEL } from '@/lib/decor';
import { mutate, patchCache, useQuery } from '@/lib/query';
import type { Todo, TodoStatus } from './types';

const ORDER: TodoStatus[] = ['todo', 'doing', 'done'];
const byDue = (a: Todo, b: Todo) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999');

export function setTodoStatus(id: string, status: TodoStatus) {
  return mutate({
    optimistic: () => patchCache<Todo[]>('todos:all', (old) => (old ?? []).map((t) => (t.id === id ? { ...t, status } : t))),
    run: () => todoApi.setStatus(id, status),
    invalidate: ['todos:'],
  }).catch(() => {});
}

export function useTodoVals(): Vals {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { openQuickAdd, city } = useApp();
  const view = params.get('view') ?? 'list';
  const filter = params.get('filter') ?? 'today';

  const { data: todos = [] } = useQuery('todos:all', () => todoApi.listTodos());
  const { data: projectRows = [] } = useQuery('todos:projects', () => todoApi.listProjects());

  const dec = (t: Todo) => decorateTodo(t, () => void setTodoStatus(t.id, t.status === 'done' ? 'todo' : 'done'));
  const filt: Record<string, (t: Todo) => boolean> = { today: isTodayTodo, all: (t) => t.status !== 'done', done: (t) => t.status === 'done' };
  const todoFilters = ([['today', '오늘'], ['all', '진행 중'], ['done', '완료']] as const).map(([k, label]) => ({
    label, n: todos.filter(filt[k]).length, ...pill(filter === k),
    go: () => router.replace(`${pathname}?view=${view}&filter=${k}`, { scroll: false }),
  }));
  const todoList = todos.filter(filt[filter] ?? filt.today).sort(byDue).map(dec);

  const projects = projectRows.map((p) => ({ name: p.name, total: p.total, done: p.done, pct: p.total ? Math.round((p.done / p.total) * 100) : 0 }));

  const board = ORDER.map((k, i) => {
    const items = todos.filter((t) => t.status === k).sort(byDue).map((t) => ({
      ...dec(t),
      canBack: i > 0, canFwd: i < 2, backLabel: i > 0 ? STATUS_LABEL[ORDER[i - 1]] : '', fwdLabel: i < 2 ? STATUS_LABEL[ORDER[i + 1]] : '',
      back: () => i > 0 && void setTodoStatus(t.id, ORDER[i - 1]),
      fwd: () => i < 2 && void setTodoStatus(t.id, ORDER[i + 1]),
    }));
    return { label: STATUS_LABEL[k], n: items.length, items, dot: [C(255), C(55), C(155)][i] };
  });

  return {
    isTodo: true, isTodoList: view === 'list', isTodoBoard: view === 'board', city,
    todoFilters, todoList, todoEmpty: todoList.length === 0, projects, board, addTodo: () => openQuickAdd('todo'),
  };
}
