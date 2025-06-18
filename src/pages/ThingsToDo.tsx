
import { useState, useEffect } from "react";
import ThingsToDoList from "@/components/projects/ThingsToDoList";

const ThingsToDo = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = () => {
    const storedTodos = JSON.parse(localStorage.getItem('project_todos') || '[]');
    setTodos(storedTodos);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Things To Do</h1>
          <p className="text-muted-foreground">Manage your parallel tasks and deadlines</p>
        </div>
      </div>

      <ThingsToDoList todos={todos} onTodosUpdate={loadTodos} />
    </div>
  );
};

export default ThingsToDo;
