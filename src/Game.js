import React, { useState, useEffect } from "react";
import Cave from "./Cave";
import Drone from "./Drone";
import Popup from "./Popup";
import { caData } from "./caveData";

const Game = () => {
  const [caveData, setCaveData] = useState(caData);
  const [caveWidth] = useState(500);
  const makeStartPoint = () => {
    const midleDistanse =
      (Math.abs(caveData[0][0]) + Math.abs(caveData[0][1])) / 2;

    const xx = caveData[0][0] + caveWidth / 2;
    return { x: midleDistanse + xx - 12.5, y: 5 };
  };
  const startPoint = makeStartPoint();
  const [dronePosition, setDronePosition] = useState(startPoint);
  const [verticalSpeed, setVerticalSpeed] = useState(0);
  const [horizontalSpeed, setHorizontalSpeed] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState("none");
  const [gameWon, setGameWon] = useState(false);

  const makePoints = (left) => {
    const cave = caveData;
    let points = cave.map((item, index) => {
      return [item[left ? 0 : 1] + caveWidth / 2, index * 10];
    });
    points.unshift([left ? 0 : caveWidth, 0]);
    points.push([left ? 0 : caveWidth, points[points.length - 2][1]]);
    return points;
  };
  const left_points = makePoints(true);
  const right_points = makePoints(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver == "none") {
        switch (event.key) {
          case "ArrowLeft":
            setHorizontalSpeed((prevSpeed) => prevSpeed - 1);
            break;
          case "ArrowRight":
            setHorizontalSpeed((prevSpeed) => prevSpeed + 1);
            break;
          case "ArrowUp":
            if (verticalSpeed + 1 > 0) setVerticalSpeed(-1);
            else setVerticalSpeed((prevSpeed) => prevSpeed + 1);
            break;
          case "ArrowDown":
            setVerticalSpeed((prevSpeed) => prevSpeed - 1);
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch cave data from server using WebSocket
  useEffect(() => {
    // const socket = new WebSocket("ws://localhost:8080");
    // socket.onmessage = (event) => {
    //   const newCaveData = JSON.parse(event.data);
    //   setCaveData(newCaveData);
    // };
    // return () => {
    //   socket.close();
    // };
  }, []);

  // Update drone position based on speed
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver == "none")
        setDronePosition((prevPosition) => {
          return {
            x: prevPosition.x + horizontalSpeed,
            y: prevPosition.y + verticalSpeed,
          };
        });
    }, 1000 / 60); // Update position every 60th of a second
    return () => clearInterval(interval);
  }, [horizontalSpeed, verticalSpeed]);

  // Check for collisions
  useEffect(() => {
    const pointTocheck = [
      ...left_points.filter(
        ([x, y]) => y >= dronePosition.y && y < dronePosition.y + 12.5
      ),
      ...right_points.filter(
        ([x, y]) => y >= dronePosition.y && y < dronePosition.y + 12.5
      ),
    ];
    const triangleCoord = [
      [dronePosition.x, dronePosition.y],
      [dronePosition.x + 25, dronePosition.y],
      [dronePosition.x + 12.5, dronePosition.y + 12.5],
    ];
    const isArrayInsidePolygon = (pTocheck) => {
      pTocheck.forEach((point) => {
        if (isPointInsidePolygon(point, triangleCoord)) return true;
      });
      return false;
    };
    if (
      isPointInsidePolygon(
        [dronePosition.x, dronePosition.y * -1],
        left_points
      ) ||
      isPointInsidePolygon(
        [dronePosition.x + 25, dronePosition.y * -1],
        right_points
      )
    ) {
      setGameOver("Back");
      setVerticalSpeed(0);
      setHorizontalSpeed(0);
    } else if (
      isPointInsidePolygon(
        [dronePosition.x + 12.5, dronePosition.y * -1 + 12.5],
        right_points
      ) ||
      isPointInsidePolygon(
        [dronePosition.x + 12.5, dronePosition.y * -1 + 12.5],
        left_points
      )
    ) {
      setGameOver("Nose");
      setVerticalSpeed(0);
      setHorizontalSpeed(0);
    } else if (isArrayInsidePolygon(pointTocheck)) {
      setGameOver("Side");
      setVerticalSpeed(0);
      setHorizontalSpeed(0);
    } else if (dronePosition.y < left_points.length * -10 - 20) {
      setGameWon(true);
      setVerticalSpeed(0);
      setHorizontalSpeed(0);
    }
  }, [dronePosition]);

  useEffect(() => {
    if (gameOver != "none") {
      setVerticalSpeed(0);
      setHorizontalSpeed(0);
    }
  }, [gameOver]);
  // Handle arrow key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isPointInsidePolygon = (point, poly) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0],
        yi = poly[i][1];
      const xj = poly[j][0],
        yj = poly[j][1];
      const intersect =
        yi > point[1] != yj > point[1] &&
        point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Calculate score
  useEffect(() => {
    if (
      dronePosition.y % 10 === 0 &&
      dronePosition.y &&
      gameOver === "none" &&
      gameWon
    ) {
      const increment = (verticalSpeed * -1 + caveData.length) * 0.1;
      setScore((prevScore) => prevScore + increment);
    }
  }, [dronePosition, caveData]);

  // Handle restart
  const restartGame = () => {
    setGameOver("none");
    setGameWon(false);

    setDronePosition(startPoint);
    setVerticalSpeed(0);
    setHorizontalSpeed(0);
    setScore(0);
  };
  const overmessage = `Game over ${gameOver} colision`;
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Cave
        screenWidth={caveWidth}
        position={dronePosition}
        left_points={left_points}
        right_points={right_points}
      />
      <Drone position={dronePosition} />
      {gameOver != "none" && (
        <Popup message={overmessage} onRestart={restartGame} />
      )}
      {gameWon && (
        <Popup message="Congratulations! You won!" onRestart={restartGame} />
      )}
      <div className="scoreboard">
        <p>Score: {score}</p>
      </div>
    </div>
  );
};

export default Game;
