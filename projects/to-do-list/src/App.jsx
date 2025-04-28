import { useState, useEffect } from "react";
import "./App.css";

const TaskItem = ({ task, toggleTask, deleteTask }) => {
  return (
    <li className={`${task.completed ? "completed" : ""} rotate-left`}>
      <span onClick={() => toggleTask(task.id)}>{task.text}</span>
      <button className="remove-btn" onClick={() => deleteTask(task.id)}>
        Eliminar
      </button>
    </li>
  );
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filterText, setFilterText] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Cargar tareas al montar el componente
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Guardar tareas cuando cambian
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(JSON.parse(localStorage.getItem("tasks")));
  }, [tasks]);

  // Añadir tarea
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene recarga de pagina
    if (!newTask.trim()) return; // Evita agregar tareas vacias

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, task]); // Agrega nueva tarea
    setNewTask(""); //Limpia el input
  };

  // Marcar tarea como completada
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Eliminar tarea
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Filtrar tareas
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(filterText.toLowerCase()),
  );

  return (
    <>
      <div className="container">
        <header>
          <h1>Cuaderno de tareas</h1>
        </header>

        <form id="formAddTask" onSubmit={handleSubmit}>
          {" "}
          <section className="task-input-section">
            <input
              type="text"
              id="new-task"
              placeholder="Tomar nota..."
              autoComplete="off"
              autoFocus
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
              }}
            />
            <button type="submit" id="add-task-btn">
              Añadir
            </button>
            <button
              type="button"
              id="show-filter-btn"
              className="icon-button"
              onClick={() => setShowFilter(!showFilter)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </section>
        </form>

        <div
          id="filter-container"
          className={`filter-section ${showFilter ? "visible" : ""}`}
        >
          <input
            type="text"
            id="filter-text"
            placeholder="Buscar..."
            autoComplete="off"
            onChange={(e) => {
              setFilterText(e.target.value);
            }}
            value={filterText}
          />
          {showFilter && (
            <button id="clear-filter-btn" onClick={() => setFilterText("")}>
              Limpiar
            </button>
          )}
        </div>

        <section className="task-list-section">
          <ul id="task-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
              />
            ))}
          </ul>
        </section>

        <footer className="vintage-footer">
          <div className="stamp">🖋️ Notas archivadas</div>
        </footer>
      </div>
    </>
  );
}

export default App;
