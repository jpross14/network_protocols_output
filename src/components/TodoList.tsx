import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { TodoItem } from "./ToDoItem";
import { Todo } from "@/types/todos.types";
import { AddTodoForm } from "./AddToDoForm";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { CheckCircle2, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchTodos();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || "");
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map database columns to UI format
      const mappedTodos: Todo[] = (data || []).map((todo) => ({
        id: todo.id,
        user_id: todo.user_id,
        text: todo.text,
        completed: todo.completed,
        priority: todo.priority as "low" | "medium" | "high",
        category: todo.category,
        dueDate: todo.due_date,
        created_at: todo.created_at,
      }));

      setTodos(mappedTodos);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (
    text: string,
    priority: "low" | "medium" | "high",
    category?: string,
    dueDate?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("todos").insert({
        user_id: user.id,
        text,
        priority,
        category: category || null,
        due_date: dueDate || null,
        completed: false,
      });

      if (error) throw error;

      toast.success("Todo added!");
      fetchTodos();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to add todo");
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", id);

      if (error) throw error;

      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update todo");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;

      setTodos(todos.filter((t) => t.id !== id));
      toast.success("Todo deleted!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to delete todo");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Cleaner Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-8">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">My Tasks</h1>
                <p className="text-sm text-neutral-500">
                  {stats.active} active · {stats.completed} completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-700 truncate max-w-[180px]">
                  {userEmail}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 space-y-6">
          {/* Add Todo Form */}
          <AddTodoForm onAdd={addTodo} />

          {/* Separator */}
          <div className="border-t border-neutral-200" />

          {/* Filter Tabs */}
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as typeof filter)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1 cursor-pointer">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1 cursor-pointer">
                Active ({stats.active})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 cursor-pointer">
                Completed ({stats.completed})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Todo List */}
          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                {filter === "all" && "No tasks yet. Add one above!"}
                {filter === "active" && "No active tasks. Great job!"}
                {filter === "completed" && "No completed tasks yet."}
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
