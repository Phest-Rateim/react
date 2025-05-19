import { useState, useEffect } from "react";
import "../css.css";

export default function App() {
  const [puntos, setPuntos] = useState(0);
  const [moves, setMoves] = useState([]);
  const [countMoves, setCountMoves] = useState(0);
  const [board, setBoard] = useState(() => {
    let refinedBoard = Array(5)
      .fill()
      .map(() => Array(10).fill(""));
    // Generar un array de letras aleatorias (cada letra aparece exactamente 2 veces)
    function generarLetrasParejas(totalParejas) {
      const letras = [];
      const letrasDisponibles = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      for (let i = 0; i < totalParejas; i++) {
        const randomIndex = Math.floor(
          Math.random() * letrasDisponibles.length,
        );
        const letra = letrasDisponibles.splice(randomIndex, 1)[0];
        letras.push(letra, letra); // Añadimos la letra dos veces
      }

      // Mezclar las letras para distribución aleatoria
      return letras.sort(() => Math.random() - 0.5);
    }

    // Asignar las letras a la matriz
    function asignarLetras(matriz) {
      const totalCeldas = matriz.flat().length;
      const totalParejas = totalCeldas / 2;
      const letrasMezcladas = generarLetrasParejas(totalParejas);

      let index = 0;
      return matriz.map((fila) => fila.map(() => letrasMezcladas[index++]));
    } // Matriz resultante con letras asignadas en parejas
    return asignarLetras(refinedBoard);
  });

  // Función para actualizar un valor específico
  const actualizarCelda = (fila, columna) => {
    const nuevaMatriz = [...board];
    setMoves((prevMoves) => [
      ...prevMoves,
      nuevaMatriz[fila][columna],
      [fila, columna],
    ]);
    document.getElementById([fila, columna]).classList.add("mostrar");
    setBoard(nuevaMatriz);
    setCountMoves(countMoves + 1);
  };

  useEffect(() => {
    if (countMoves === 2) {
      if (JSON.stringify(moves[1]) === JSON.stringify(moves[3])) {
        setCountMoves(() => 0);
        document.getElementById(moves[1]).classList.remove("mostrar");
        document.getElementById(moves[3]).classList.remove("mostrar");
        setMoves([]);
      } else if (moves[0] === moves[2]) {
        setPuntos(puntos + 1);
        setCountMoves(() => 0);
        setMoves([]);
      } else {
        setTimeout(() => {
          document.getElementById(moves[1]).classList.remove("mostrar");
          document.getElementById(moves[3]).classList.remove("mostrar");
        }, 1000);
        setMoves([]);
        setCountMoves(() => 0);
      }
    }
    console.log(countMoves);
    //console.log(countMoves);
    //console.log(moves);
  }, [countMoves]);

  return (
    <>
      <div className="gameBoard">
        <h1 className="memory-game-title">MEMORY GAME</h1>
        <table>
          <tbody>
            {board.map((fila, indexFila) => (
              <tr className="" key={`fila-${indexFila}`}>
                {fila.map((valor, indexColumna) => (
                  <td
                    id={[indexFila, indexColumna]}
                    className="celda"
                    key={`celda-${indexFila}-${indexColumna}`}
                    onClick={() => actualizarCelda(indexFila, indexColumna)}
                  >
                    {valor}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <h2>{puntos} / 25</h2>
      </div>
    </>
  );
}
