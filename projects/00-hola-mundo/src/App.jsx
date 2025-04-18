import { useState, useEffect } from "react";
import "../css.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleWhole } from "@fortawesome/free-solid-svg-icons";
export default function App() {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(0);
  const [cells, setCells] = useState(() => {
    const initialCells = [];
    const initialSnake = 50;
    let initialFood;
    for (let i = 0; i < 11; i++) {
      initialCells.push({ id: i, value: null });
    }
    do {
      initialFood = Math.floor(Math.random() * 11);
      initialCells[initialFood].value = <FontAwesomeIcon icon={faAppleWhole} />;
      setFood(initialFood);
      setSnake([initialSnake]);
    } while (initialSnake === initialFood);
    return initialCells;
  });

  useEffect(() => {
    const foodCell = Math.floor(Math.random() * 11);
    // Programar la actualización del estado después de 1 segundo
    const timer = setTimeout(() => {
      setCells((prevCells) => {
        const newCells = [...prevCells]; // 1. Copiar el array original
        newCells[food].value = "";
        setFood(foodCell);
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

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          console.log("Flecha arriba presionada");
          break;
        case "ArrowDown":
          console.log("Flecha abajo presionada");
          break;
        case "ArrowLeft":
          console.log("Flecha izquierda presionada");
          break;
        case "ArrowRight":
          console.log("Flecha derecha presionada");
          break;
        default:
          break;
      }
    };

    // Agregar event listener al montar el componente
    window.addEventListener("keydown", handleKeyPress);

    // Limpiar event listener al desmontar
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Array de dependencias vacío para ejecutar solo una vez
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
