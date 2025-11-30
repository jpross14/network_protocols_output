import React from "react";
import { ToDoList } from "@/components/ToDoList";


export default function Home() {
  return (
    <main className="scroll-smooth h-screen flex flex-col items-center pt-12 bg-black cursor-capy">
      <h1 className="text-3xl mb-2 font-bold">WiseWay Todo List</h1>
      <ToDoList/>
    </main>
  );
}
