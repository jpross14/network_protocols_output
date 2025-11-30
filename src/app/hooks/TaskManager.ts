import { supabase } from "@/lib/supabaseClient";
import { Todos } from "@/types/todos.types";

export const fetchTodos = async (): Promise<Todos[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error.message);
    throw new Error("Could not fetch testimonials");
  }

  return data as Todos[];
};

export const deleteTodos = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error.message);
    throw new Error("Could not delete todo");
  }
};

export const handleComplete = async (id: string, is_done: boolean): Promise<void> => {
  const { error } = await supabase
    .from("todos")
    .update({ is_done: !is_done })
    .eq("id", id);

  if (error) {
    console.error("Update error:", error.message);
    throw new Error("Could not update todo status");
  }
};

export const addTodo = async (task: string, deadline: string | null) => {
  const { data, error } = await supabase
    .from("todos")
    .insert([{ task, deadline, is_done: false }])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error.message);
    throw new Error("Could not add todo");
  }

  return data;
};



