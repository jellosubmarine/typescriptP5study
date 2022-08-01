import React from 'react';
import Sketch from 'react-p5'
import p5Types from 'p5';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

function easeInQuint(x: number): number {
  return x * x * x * x;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInCirc(x: number): number {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2);
}

class State {
  x: number = 0;
  y: number = 0;

}

class Environment {
  gridSize: number = 2;
  grid: Array<Array<number>>;
  threshold: number = 0.5;
  mountainFrequencyMultiplier: number = 5;

  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.grid = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) {
      this.grid[i] = new Array(gridSize);
    }
    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
        var value = (noise2D(i / gridSize * this.mountainFrequencyMultiplier, j / gridSize * this.mountainFrequencyMultiplier) + 1) / 2.0;
        value = easeInSine(value);
        if (value > this.threshold) {
          this.grid[i][j] = 1;
        }
        else {
          this.grid[i][j] = 0;
        }
      }
    }
  }

  isOOB(i: number, j: number) {
    if (i < 0 || i >= this.gridSize) {
      return true;
    }
    if (j < 0 || j >= this.gridSize) {
      return true;
    }
    return false;
  }

  costBetween(startState: State, endState: State) {

  }

  show(p5: p5Types): void {
    let w: number = p5.width / this.gridSize;
    let h: number = p5.height / this.gridSize;

    for (var i = 0; i < this.gridSize; i++) {
      for (var j = 0; j < this.gridSize; j++) {
        p5.fill(p5.color(255 * (1 - this.grid[i][j])));
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
  let gridSize: number = 100;
  let environment = new Environment(gridSize);
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(800, 800).parent(
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