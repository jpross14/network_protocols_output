import React from "react";
import { format, isBefore } from 'date-fns';

interface TodoItemProps {
    id : string;
    task: string;
    is_done: boolean;
    deadline?: string;
    onDelete: () => void;
    onComplete: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  task,
  is_done,
  deadline,
  onDelete,
  onComplete,
}) => {
    const isOverdue = deadline ? isBefore(new Date(deadline), new Date()) && !is_done : false;

  return (
    <div>
      <div className="relative border-1 rounded-2xl p-2 border-amber-200 h-15 flex flex-row my-5 items-center w-[100%] mx-auto">
        <input
          type="checkbox"
          checked={is_done}
          onChange={onComplete}
          className="scale-125 hover:scale-150 mx-4 transition-all cursor-capy-hover active:cursor-capy-click"
        />
        <div className="flex flex-row w-[50%] h-[50%] text-left items-center justify-between px-3">
            <p className={`${is_done ? "text-gray-500 line-through" : ""}`}>{task}</p>
        </div>

        <div className="w-[25%]">
            {deadline && <p className="text-sm text-gray-500 px-2">Due: {format(new Date(deadline), "MM/dd/yy")}</p>}
        </div>

        <button
          onClick={onDelete}
          className="rounded-xl p-2 hover:scale-105 bg-[#ab045e] hover:bg-red-600 transition-all cursor-capy-hover active:cursor-capy-click"
        >
          Delete
        </button>

        {deadline ?
        isOverdue ?
        (<div className="absolute bg-[#ab045e] h-6 w-20 p- rounded-lg -top-[10%] -right-[14%]">Overdue</div>)
        : (<div className="absolute bg-[#ab045e] h-4 w-4 rounded-[50%] -top-[10%] right-0"></div>) 
        : (null)
        }

      </div>
    </div>
  );
};
