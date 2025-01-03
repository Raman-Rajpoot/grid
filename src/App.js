import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const rows = 20;
  const cols = 15;

  const createEmptyGrid = () => Array.from({ length: rows }, () => Array(cols).fill(0));
  const [grid, setGrid] = useState(createEmptyGrid);
  const [columnStates, setColumnStates] = useState(Array(cols).fill(false)); // Keeps track of active columns
  const [activeDrops, setActiveDrops] = useState([]); // Tracks active raindrops

  // Function to change red, green, blue to random values between 0 and 255
  const changeColorRandomly = () => {
    const randomRed = Math.floor(Math.random() * 256);  // Random value for red
    const randomGreen = Math.floor(Math.random() * 256); // Random value for green
    const randomBlue = Math.floor(Math.random() * 256);  // Random value for blue

    // Immediately update the CSS variables
    document.documentElement.style.setProperty('--red-color', randomRed);
    document.documentElement.style.setProperty('--green-color', randomGreen);
    document.documentElement.style.setProperty('--blue-color', randomBlue);
  };

  // Optional: Change the color every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeColorRandomly(); // Change color every 5 seconds
    }, 3000); // 5000 ms = 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const updateRain = () => {
    setGrid((prevGrid) => {
      const newGrid = createEmptyGrid();
      const newDrops = [];
      const newColumnStates = [...columnStates];

      // Move active drops down
      activeDrops.forEach(({ col, row, length }) => {
        if (row + 1 < rows + 5) {
          for (let i = 0; i <= length; i++) {
            if (row + i >= 0 && row + i < rows) {
              newGrid[row + i][col] = length - i;
            }
          }
          newDrops.push({ col, row: row + 1, length });
        } else {
          newColumnStates[col] = false; // Reset column state after finishing
        }
      });

      // Introduce new drops with low probability
      columnStates.forEach((active, col) => {
        if (!active && Math.random() < 0.03 && !newDrops.some((drop) => drop.col === col)) {
          newDrops.push({ col, row: -5, length: 10 }); // Start at row -5
          newColumnStates[col] = true;
        }
      });

      setActiveDrops(newDrops);
      setColumnStates(newColumnStates);
      return newGrid;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateRain();
    }, 70); // Adjust interval for smooth animation

    return () => clearInterval(interval);
  }, [activeDrops, columnStates]);

  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`grid-cell ${cell > 0 ? `rain-length-${cell}` : ''}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
