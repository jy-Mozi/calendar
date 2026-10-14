export type TodoStatus = 'todo' | 'doing' | 'done';
/** 1=상, 2=중, 3=하 */
export type Priority = 1 | 2 | 3;

export type Todo = {
  id: string;
  title: string;
  memo: string | null;
  /** YYYY-MM-DD (KST 기준 날짜). 마감 없으면 null */
  dueDate: string | null;
  priority: Priority;
  status: TodoStatus;
  completedAt: string | null;
  /** 프로젝트 이름 (업무·생활·개인) */
  project: string | null;
};

export type TodoInput = Partial<Omit<Todo, 'id' | 'completedAt'>> & { title: string };

export type TodoFilter = {
  status?: TodoStatus | 'open';
  /** dueDate 가 이 날짜 이하(지연 포함) */
  dueTo?: string;
  project?: string;
};

export type Project = { id: string; name: string; total: number; done: number };

export interface TodoApi {
  listTodos(filter?: TodoFilter): Promise<Todo[]>;
  createTodo(input: TodoInput): Promise<Todo>;
  updateTodo(id: string, patch: Partial<TodoInput>): Promise<Todo>;
  setStatus(id: string, status: TodoStatus): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
  listProjects(): Promise<Project[]>;
}
