import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filterText, setFilterText] = useState("");
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };
  const addTask = (e) => {
    e.preventDefault(); // Previene recarga de pagina
    if (newTask.trim() === "") return; // Evita agregar tareas vacias
    setTasks([...tasks, { text: newTask, completed: false }]); // Agrega nueva tarea
    setNewTask(""); //Limpia el input
  };
  const taskCompleted = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
  };
  return (
    <>
      <div className="todo-app">
        <div className="todo-header">
          <h1 className="todo-title">Tareas Pendientes</h1>
          <p className="todo-subtitle">Organiza tu día con elegancia</p>
        </div>

        <form className="todo-form" onSubmit={addTask}>
          <input
            type="text"
            className="todo-input"
            placeholder="¿Qué necesitas hacer?"
            autoFocus
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="todo-button">
            Añadir
          </button>
        </form>
        <div className="filter-container">
          <input
            type="text"
            className="filter-input"
            placeholder="Filtrar tareas..."
            onChange={(e) => filterText(e.target.value)}
            value={filterText}
          />
        </div>
        <ul className="todo-list">
          {tasks.map((task, index) => {
            return (
              <li
                key={index}
                className={`todo-item ${task.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  id={`task-${index}`}
                  checked={task.completed}
                  onChange={() => taskCompleted(index)}
                />
                <label htmlFor={`task-${index}`} className={`todo-text`}>
                  {task.text}
                </label>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(index)}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>

        <div className="todo-footer">
          <span>To-Do List Minimalista © 2025</span>
        </div>
      </div>
    </>
  );
}

export default App;
