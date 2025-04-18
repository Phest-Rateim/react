import { useState, useEffect } from "react";
import "../css.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleWhole } from "@fortawesome/free-solid-svg-icons";
export default function App() {
  const [snake, setSnake] = useState([45]);
  const [food, setFood] = useState();
  const [cells, setCells] = useState(() => {
    let initialCells = [];
    let initialFood;
    for (let i = 0; i < 100; i++) {
      initialCells.push({ id: i, value: "" });
    }
    do {
      initialFood = Math.floor(Math.random() * 100);
      initialCells[initialFood].value = <FontAwesomeIcon icon={faAppleWhole} />;
      setFood(initialFood);
      initialCells[snake[0]].value = "#";
    } while (snake === initialFood);
    return initialCells;
  });

  useEffect(() => {
    const foodCell = Math.floor(Math.random() * 100);
    // Programar la actualización del estado después de 1 segundo
    const timer = setTimeout(() => {
      setCells((prevCells) => {
        const newCells = [...prevCells]; // 1. Copiar el array original
        newCells[food].value = "";
        setFood(foodCell);
        newCells[snake[0]].value = "#";
        newCells[foodCell] = {
          ...newCells[foodCell],
          value: <FontAwesomeIcon icon={faAppleWhole} />,
        }; // 2. Copiar y modificar el primer elemento
        return newCells; // 3. Retornar el nuevo array
      });
    }, 10000);

    // Limpiar el timer si el componente se desmonta o el efecto se re-ejecuta
    return () => clearTimeout(timer);
  }, [cells]);

  return (
    <>
      <div className="game-container">
        <h2>Snake Game</h2>
        <div className="game-board">
          {cells.map((cell) => (
            <div
              id={cell.id}
              key={cell.id}
              className="cell"
              onClick={() => {
                spawnFood(cell.id);
              }}
            >
              {cell.value || ""}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
