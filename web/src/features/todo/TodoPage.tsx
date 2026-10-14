'use client';
import { layoutVals } from '@/components/ui/layout-vals';
import { useViewport } from '@/lib/use-viewport';
import { useTodoVals } from './useTodoVals';
import { TodoView } from './views/TodoView';

export function TodoPage() {
  const vp = useViewport();
  return <TodoView v={{ ...layoutVals(vp), ...useTodoVals() }} />;
}
