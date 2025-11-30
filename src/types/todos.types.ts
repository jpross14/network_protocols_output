export interface Todo {
  id: string;
  user_id?: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string | null;
  dueDate?: string | null;
  created_at?: string;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface AddTodoFormProps {
  onAdd: (text: string, priority: "low" | "medium" | "high", category?: string, dueDate?: string) => void;
}