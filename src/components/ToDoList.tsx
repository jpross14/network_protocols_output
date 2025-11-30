"use client";

import React, { useState, useEffect } from "react";
import { fetchTodos } from "@/app/hooks/TaskManager"; // Ensure this is the correct import
import { TodoItem } from "./ToDoItem";
import { ToDoForm } from "./ToDoForm";
import { Todos } from "@/types/todos.types";
import { deleteTodos, handleComplete } from "@/app/hooks/TaskManager";

export const ToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todos[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<"alphabetical" | "oldest" | "newest" | "basic" | "timed" | "deadline">("newest");

  const addTodoToList = (newTodo: Todos) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    switch (sortMode) {
      case "alphabetical":
        return a.task.localeCompare(b.task);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // latest first
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); // oldest first
      case "basic":
        // Show basic tasks first
        return (a.deadline ? 1 : 0) - (b.deadline ? 1 : 0);
      case "timed":
        // Show timed tasks first
        if (a.deadline && !b.deadline) return -1;
        if (!a.deadline && b.deadline) return 1;
        return 0;
      case "deadline":
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); // nearest first
      default:
        return 0;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTodos(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleToggleComplete = async (id: string, is_done: boolean) => {
    try {
      await handleComplete(id, is_done);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, is_done: !is_done } : todo
        )
      );
    } catch (error) {
      console.error("Complete toggle error:", error);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await fetchTodos();
        console.log("Fetched todos:", fetchedTodos);
        setTodos(fetchedTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-[40%]">
        <h2 className="text-center text-2xl mb-5">Enter a Task</h2>
          <ToDoForm onAdd={addTodoToList} />
          <div className="flex flex-row justify-center space-x-3 my-4 cursor-capy-hover">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as any)}
              className="p-2 border rounded"
            >
              <option value="newest" className="bg-black text-shadow-white">Newest first</option>
              <option value="oldest" className="bg-black text-shadow-white">Oldest first</option>
              <option value="alphabetical" className="bg-black text-shadow-white">A-Z</option>
              <option value="basic" className="bg-black text-shadow-white">Basic Tasks first</option>
              <option value="timed" className="bg-black text-shadow-white">Timed Tasks first</option>
              <option value="deadline" className="bg-black text-shadow-white">Nearest Deadline</option>
            </select>
          </div>

        <div className="text-center mt-5">
            {todos.length === 0 ? (
                <p>No tasks available</p>
            ) : (
                sortedTodos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    id={todo.id}
                    task={todo.task}
                    deadline={todo.deadline}
                    is_done={todo.is_done}
                    onDelete={() => handleDelete(todo.id)}
                    onComplete={() => handleToggleComplete(todo.id, todo.is_done)}
                />
                ))
            )}
        </div>
    </div>
  );
};