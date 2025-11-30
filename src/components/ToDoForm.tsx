"use client";

import React, { useState } from "react";
import { addTodo } from "@/app/hooks/TaskManager";
import { Todos } from "@/types/todos.types";

interface ToDoFormProps {
  onAdd: (todo: Todos) => void;
}

export const ToDoForm: React.FC<ToDoFormProps> = ({ onAdd }) => {
  const [taskText, setTaskText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [taskType, setTaskType] = useState<"basic" | "timed">("basic");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    try {
      const newTodo = await addTodo(taskText, taskType === "timed" ? deadline : null);
      if (newTodo) {
        onAdd(newTodo);
      }
      setTaskText("");
      setDeadline("");
      setTaskType("basic");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full scheme-dark flex flex-col gap-2">
        <div className="flex flex-row justify-center space-x-3">
          <input
          id="task-input"
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Input your task :)"
          className="grow-[40vw] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f9da0d]"
        />

        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as "basic" | "timed")}
          className="grow-[20vw] py-2 px-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#f9da0d] "
        >
          <option value="basic" className="bg-black text-shadow-white">Basic</option>
          <option value="timed"className="bg-black text-shadow-white">Timed</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-[#0a54c4] text-white rounded-lg hover:bg-[#ab045e] hover:scale-110 transition-all cursor-pointer"
        >
          Add
        </button>
      </div>

      <div className="flex flex-row justify-center space-x-3">
        {taskType === "timed" && (
          <input 
          type="date"
          onChange={(e) => setDeadline(e.target.value)}
          className="grow-[20vw] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f9da0d]"
          />
        )}
      </div>
    </form>
  );
};
