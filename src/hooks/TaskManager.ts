import { supabase } from "@/lib/supabase";
import { Todo } from "@/types/todos.types";

// Fetch all todos for the authenticated user
export const fetchTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error.message);
    throw new Error("Could not fetch todos");
  }

  // Map DB fields to UI fields
  return (data || []).map((todo) => ({
    id: todo.id,
    user_id: todo.user_id,
    text: todo.text,
    completed: todo.completed,
    priority: todo.priority as "low" | "medium" | "high",
    category: todo.category,
    dueDate: todo.due_date,
    created_at: todo.created_at,
  }));
};

// Add a new todo for the authenticated user
export const addTodo = async (
  text: string,
  priority: "low" | "medium" | "high",
  category?: string,
  dueDate?: string
): Promise<Todo> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("todos")
    .insert({
      user_id: user.id,
      text,
      priority,
      category: category || null,
      due_date: dueDate || null,
      completed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error.message);
    throw new Error("Could not add todo");
  }

  return {
    id: data.id,
    user_id: data.user_id,
    text: data.text,
    completed: data.completed,
    priority: data.priority as "low" | "medium" | "high",
    category: data.category,
    dueDate: data.due_date,
    created_at: data.created_at,
  };
};

// Toggle completion status
export const toggleTodo = async (id: string, completed: boolean): Promise<void> => {
  const { error } = await supabase
    .from("todos")
    .update({ completed: !completed })
    .eq("id", id);

  if (error) {
    console.error("Update error:", error.message);
    throw new Error("Could not update todo status");
  }
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error.message);
    throw new Error("Could not delete todo");
  }
};