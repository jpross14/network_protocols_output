import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { TodoItem } from "./ToDoItem";
import { Todo } from "@/types/todos.types";
import { AddTodoForm } from "./AddToDoForm";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { CheckCircle2, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchTodos, addTodo, toggleTodo, deleteTodo } from "@/hooks/TaskManager";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadTodos();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || "");
    }
  };

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();

      const mappedTodos: Todo[] = (data || []).map((todo) => ({
        ...todo,
        dueDate: todo.dueDate
          ? /^\d{4}-\d{2}-\d{2}$/.test(todo.dueDate)
            ? todo.dueDate
            : new Date(todo.dueDate).toISOString().split("T")[0]
          : null,
      }));

      setTodos(mappedTodos);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (
    text: string,
    priority: "low" | "medium" | "high",
    category?: string,
    dueDate?: string
  ) => {
    try {
      await addTodo(text, priority, category, dueDate);
      toast.success("Todo added!");
      loadTodos();
    } catch (error: any) {
      toast.error(error.message || "Failed to add todo");
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      await toggleTodo(id, todo.completed);
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      toast.success("Todo deleted!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete todo");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully!");
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-2xl mb-4">
            <CheckCircle2 className="w-8 h-8 text-white"/>
          </div>
          <h1 className="text-neutral-900 mb-2">My Tasks</h1>
          <p className="text-neutral-500">
            {stats.active} active · {stats.completed} completed
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs text-neutral-400">{userEmail}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-xs cursor-pointer"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 space-y-6">
          {/* Add Todo Form */}
          <AddTodoForm onAdd={handleAddTodo} />

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
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
