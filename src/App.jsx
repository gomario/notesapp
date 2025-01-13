//import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import React, { useState, useEffect } from "react";
//#import './styles.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [count, setCount] = useState(0)


const [game, setGame] = useState({
    board: Array(110).fill(''),
    currentPlayer: "X",
    idx: null
  });

  const [gridValues, setGridValues] = useState(Array(110).fill(''));
  const [errorMessage, setErrorMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState("Player A");

  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    setPlayerTurn(event.target.value);
  };

    useEffect(() => {
      socket.on("moveMade", (data) => {
      console.log("Game chg ",data);
      setGridValues(data.board);
      //setGame(data.updatedGame);
      //setPlayerTurn(data.updatedGame.currentPlayer);
      setErrorMessage("");
    });

    socket.on("gameReset", (newGame) => {
      setGame(newGame);
      setPlayerTurn("Player A");
      setErrorMessage("");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, []);

const handleInputChange = (index, value) => {
    const newGridValues = [...gridValues];

    console.log("Current in grid ",gridValues[index]);
    if (gridValues[index] == "mario" ){
        console.log("MARIO HERE");
        return;
    } else {
        // code to execute if none of the above conditions are true
    }

    //newGridValues[index] = value;
    newGridValues[index] = playerTurn;
    setGridValues(newGridValues);

    const updatedGame = {
      idx: index,
      board: newGridValues,
      currentPlayer: "X"
    };

    socket.emit("makeMove", updatedGame);
  };

 return (
 <div className="App">
<h1>Welcome to Square Biz</h1>
    <div  className="whoibe">
      <input type="text" value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    <div className="grid-container">
      {gridValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}
    </div>
    </div>
    </div>
  );
}

export default App;
