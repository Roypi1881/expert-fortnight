import React, { useState, useEffect, useRef } from "react";

type Coord = [number, number];
const GRID = 20, SIZE = 20;

function genApple(snake: Coord[]): Coord {
  while (true) {
    let apple: Coord = [Math.floor(Math.random()*GRID), Math.floor(Math.random()*GRID)];
    if (!snake.some(([x,y])=>x===apple[0]&&y===apple[1])) return apple;
  }
}

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Coord[]>([[10,10],[10,11],[10,12]]);
  const [dir, setDir] = useState<Coord>([0,-1]);
  const [apple, setApple] = useState<Coord>(genApple([[10,10],[10,11],[10,12]]));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(dir);

  useEffect(() => { moveRef.current = dir; }, [dir]);
  useEffect(() => {
    if (gameOver) return;
    const handle = setInterval(() => {
      setSnake(prev => {
        let head = [prev[0][0]+moveRef.current[0], prev[0][1]+moveRef.current[1]] as Coord;
        if (head[0]<0||head[1]<0||head[0]>=GRID||head[1]>=GRID||prev.some(([x,y])=>head[0]===x&&head[1]===y)) {
          setGameOver(true); return prev;
        }
        let newSnake = [head, ...prev];
        if (head[0]===apple[0]&&head[1]===apple[1]) {
          setApple(genApple(newSnake));
          setScore(s=>s+1);
        } else newSnake.pop();
        return newSnake;
      });
    }, 100);
    return ()=>clearInterval(handle);
  }, [apple, gameOver]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key==="ArrowUp" && dir[1]!==1) setDir([0,-1]);
      if (e.key==="ArrowDown" && dir[1]!==-1) setDir([0,1]);
      if (e.key==="ArrowLeft" && dir[0]!==1) setDir([-1,0]);
      if (e.key==="ArrowRight" && dir[0]!==-1) setDir([1,0]);
    };
    window.addEventListener("keydown", key); return ()=>window.removeEventListener("keydown", key);
  }, [dir]);

  return (
    <div style={{ margin: 40 }}>
      <h1>Snake Game</h1>
      <div style={{position:"relative",width:GRID*SIZE,height:GRID*SIZE,border:"2px solid #222",background:"#eee"}}>
        {snake.map(([x,y],i)=>
          <div key={i} style={{
            position:"absolute", left:x*SIZE, top:y*SIZE,
            width:SIZE, height:SIZE, background:i===0?"#0d0":"#0a8", borderRadius:4
          }}/>
        )}
        <div style={{
          position:"absolute", left:apple[0]*SIZE, top:apple[1]*SIZE,
          width:SIZE, height:SIZE, background:"#e33", borderRadius:"50%"
        }}/>
      </div>
      <p>Score: {score}</p>
      {gameOver && <b style={{color:"red"}}>Game Over</b>}
    </div>
  );
};
export default SnakeGame;