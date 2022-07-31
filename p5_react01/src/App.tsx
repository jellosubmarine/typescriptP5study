import React from 'react';
import Sketch from 'react-p5'
import p5Types from 'p5';

class Environment {
  gridSize: number = 2;
  grid: Array<Array<number>>;

  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.grid = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) {
      this.grid[i] = new Array(gridSize);
    }
    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
        this.grid[i][j] = Math.random();
      }
    }
  }

  show(p5: p5Types): void {
    let w: number = p5.width / this.gridSize;
    let h: number = p5.height / this.gridSize;

    for (var i = 0; i < this.gridSize; i++) {
      for (var j = 0; j < this.gridSize; j++) {
        p5.fill(p5.color(255 * this.grid[i][j]));
        p5.stroke(0);
        p5.rect(i * w, j * h, w, h);
      }
    }
    // 
  }
}


class PathPlanner {
}


function App() {
  let gridSize: number = 20;
  let environment = new Environment(gridSize);
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(400, 400).parent(
      canvasParentRef,
    );


  };

  const draw = (p5: p5Types) => {
    p5.background(128);
    environment.show(p5);
  };
  return <Sketch setup={setup} draw={draw} />;
}
export default App;