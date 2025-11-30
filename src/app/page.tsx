"use client"

import { useState } from "react";
import { TodoItem } from "@/components/ToDoItem";
import { Todo } from "@/types/todos.types";
import { AddTodoForm } from "@/components/AddToDoForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      text: "Complete project proposal",
      completed: false,
      priority: "high",
      category: "Work",
      dueDate: new Date(2025, 11, 5).toISOString(),
    },
    {
      id: "2",
      text: "Buy groceries",
      completed: false,
      priority: "medium",
      category: "Personal",
    },
    {
      id: "3",
      text: "Read chapter 5",
      completed: true,
      priority: "low",
      category: "Learning",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = (text: string, priority: "low" | "medium" | "high", category?: string, dueDate?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      category,
      dueDate,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-2xl mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-neutral-900 mb-2">My Tasks</h1>
          <p className="text-neutral-500">
            {stats.active} active · {stats.completed} completed
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 space-y-6">
          {/* Add Todo Form */}
          <AddTodoForm onAdd={addTodo} />

          {/* Separator */}
          <div className="border-t border-neutral-200" />

          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="cursor-pointer flex-1">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="active" className="cursor-pointer flex-1">
                Active ({stats.active})
              </TabsTrigger>
              <TabsTrigger value="completed" className="cursor-pointer flex-1">
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
