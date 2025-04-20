import { useState, useEffect } from "react";
import "../css.css";

export default function App() {
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
      return letras;
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
  const actualizarCelda = (fila, columna, valor) => {
    const nuevaMatriz = [...matriz];
    nuevaMatriz[fila][columna] = valor;
    setMatriz(nuevaMatriz);
  };

  useEffect(() => {}, []);

  return (
    <>
      <div>
        <h2>Memory Game</h2>
        <table>
          <tbody>
            {board.map((fila, indexFila) => (
              <tr className="" key={`fila-${indexFila}`}>
                {fila.map((valor, indexColumna) => (
                  <td
                    key={`celda-${indexFila}-${indexColumna}`}
                    onClick={() =>
                      actualizarCelda(indexFila, indexColumna, valor)
                    }
                  >
                    {valor}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
