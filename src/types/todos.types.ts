export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface AddTodoFormProps {
  onAdd: (text: string, priority: "low" | "medium" | "high", category?: string, dueDate?: string) => void;
}