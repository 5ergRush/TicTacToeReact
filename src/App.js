import "./styles.css";
import { useState, useRef } from "react";

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [size, setSize] = useState(3);
  const boardStyle = { "--board-size": size };
  const [playerXTurn, setPlayerXTurn] = useState(true);
  const [squares, setSquares] = useState(Array(size * size).fill(null));
  const [winner, setWinner] = useState(null);

  const boardClick = useRef(new Audio('/board-click.mp3'))
  const winnerSound = useRef(new Audio('/winner.mp3'))

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    boardClick.current.currentTime = 0;
    boardClick.current.play();
    const nextSquares = squares.slice();
    nextSquares[i] = playerXTurn ? "X" : "O";
    setPlayerXTurn(!playerXTurn);
    setSquares(nextSquares);
    calculateWinner(nextSquares);
  };

  const calculateWinner = (squares) => {
    const lines = [];

    for (let i = 0; i < size; i++) {
      lines.push(generateRow(i, 0, 1)); // Corrected offset for rows
      lines.push(generateColumn(i, 0, size)); // Corrected offset for columns
    }
    lines.push(generateDiagonal(0, 0, size + 1)); // Corrected offset for main diagonal
    lines.push(generateDiagonal(size - 1, 0, size - 1)); // Corrected offset for anti-diagonal

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.every(index => squares[index] && squares[index] === squares[line[0]])) {
        setWinner(squares[line[0]]);
        winnerSound.current.play();
        return; // Exit after finding a winner
      }
    }
  };

  const generateRow = (row, start, offset) => {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(row * size + start + i * offset);
    }
    return result;
  };

  const generateColumn = (col, start, offset) => {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(col + start * size + i * offset);
    }
    return result;
  };

  const generateDiagonal = (start, offset, increment) => {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push(start + i * increment);
    }
    return result;
  };

  function resetBoard(){
    setSquares(Array(size * size).fill(null));
    setWinner(false);
    setPlayerXTurn(true);
  }

  return (
    <center>
      <label>Board Size :</label>
      <input value={size} onChange={(e) => setSize(e.target.value)} />
      {winner ? (
        <h1 className="winner">Winner: {winner}</h1>
      ) : (
        <div className="next-player">Next Player: {playerXTurn ? "X" : "O"}</div>
      )}
      {winner && <div><button className="play-again" onClick={resetBoard}>Play Again</button></div>}
    <div className="board" style={boardStyle}>
      {Array(size * size)
        .fill(null)
        .map((_, i) => (
          <Square
            value={squares[i]}
            onClick={() => handleClick(i)}
            key={i}
          />
        ))}
    </div>
    </center>
  );
}

