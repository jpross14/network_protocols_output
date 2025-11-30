import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Trash2, Calendar, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { TodoItemProps } from "@/types/todos.types";

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-700 border-blue-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-lg border transition-all ${
        todo.completed
          ? "bg-neutral-50 border-neutral-200"
          : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
      }`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="cursor-pointer mt-1"
      />

      <div className="flex-1 min-w-0">
        <p
          className={`${
            todo.completed
              ? "line-through text-neutral-400"
              : "text-neutral-900"
          }`}
        >
          {todo.text}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge
            variant="outline"
            className={`text-xs ${priorityColors[todo.priority]}`}
          >
            {todo.priority}
          </Badge>

          {todo.category && (
            <Badge variant="outline" className="text-xs bg-neutral-50 text-neutral-600 border-neutral-200">
              <Tag className="w-3 h-3 mr-1" />
              {todo.category}
            </Badge>
          )}

          {todo.dueDate && (
            <Badge
              variant="outline"
              className={`text-xs ${
                isOverdue
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200"
              }`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(todo.dueDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-neutral-400 hover:text-rose-600"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}