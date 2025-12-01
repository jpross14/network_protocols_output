import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { AddTodoFormProps } from "@/types/todos.types";

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(
        text.trim(),
        priority,
        category.trim() || undefined,
        dueDate?.toISOString()
      );
      setText("");
      setCategory("");
      setDueDate(undefined);
      setPriority("medium");
      setShowAdvanced(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1"
        />
        <Button className="cursor-pointer" type="submit" size="icon">
          <Plus className="w-4 h-4"/>
        </Button>
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap gap-2">
          <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
            <SelectTrigger className="w-25 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="low">P1</SelectItem>
              <SelectItem className="cursor-pointer" value="medium">P2</SelectItem>
              <SelectItem className="cursor-pointer" value="high">P3</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-40"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start cursor-pointer text-left">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {dueDate ? dueDate.toLocaleDateString() : "Due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs cursor-pointer text-neutral-500 hover:text-neutral-700 transition-colors"
      >
        {showAdvanced ? "Hide options" : "Show more options"}
      </button>
    </form>
  );
}
