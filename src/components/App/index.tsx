import React, { useState, useEffect } from 'react';
import NumberDisplay from '../NumberDisplay';
import { generateCells, openMultipleCells } from '../../utils';
import Button from '../Button';
import { CellState, CellValue, Face } from '../../types';
import './App.scss';

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());
  const [face, setFace] = useState(Face.smile);
  const [time, setTime] = useState(0);
  const [live, setLive] = useState(false);
  const [flagCounter, setFlagCounter] = useState(10);

  useEffect(() => {
    const handleMouseDown = () => {
      setFace(Face.oh);
    }

    const handleMouseUp = () => {
      setFace(Face.smile);
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  });

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      }
    }
  }, [live, time]);

  const handleCellClick = (
    rowParam: number, colParam: number
  ) => () => {
    if (!live) {
      setLive(true)
    }

    const currentCell = cells[rowParam][colParam];
    let newCells = cells.slice();

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {

    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
      setCells(newCells);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
      setCells(newCells);
    }
  }

  const handleCellContext = (
    rowParam: number, colParam: number
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];

    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setFlagCounter(flagCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setFlagCounter(flagCounter + 1);
    }
  }

  const handleFaceClick = () => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  }

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => <Button
        onClick={handleCellClick}
        onContext={handleCellContext}
        state={cell.state}
        value={cell.value}
        row={rowIndex}
        col={colIndex}
        key={`${rowIndex}-${colIndex}`}
      />));
  }

  return (
    <div className="App" >
      <div className="Header">
        <NumberDisplay value={flagCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role='img' aria-label='face'>{face}</span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  )
}

export default App;