import React from 'react';
import Sketch from 'react-p5'
import p5Types from 'p5';
function App() {
  function removeFromArray(arr: Array<Node>, el: Node) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == el) {
        arr.splice(i, 1);
      }
    }
  }
  function heuristic(p5: p5Types, a: Node, b: Node): number {
    // Eucledian
    return p5.dist(a.x, a.y, b.x, b.y);;
  }

  let cols: number = 20;
  let rows: number = 20;
  var grid: Array<Array<Node>> = new Array(cols);
  let openSet: Array<Node> = [];
  let closedSet: Array<Node> = []; 
  let path: Array<Node> = [];
  let noSolution = false;
  let start: Node;
  let end: Node;
  let solFound: boolean = false;

  class Node
  {
    readonly x: number = 0;
    readonly y: number = 0;
    f: number = Infinity;
    g: number = 0;
    h: number = 0;
    neighbours: Array<Node> = [];
    previous?: Node = undefined;
    wall: boolean = false;
    
    constructor(i: number, j: number) {
      this.x = i;
      this.y = j;
    }

    show(p5: p5Types, color: p5Types.Color): void {
      let w: number = p5.width / cols;
      let h: number = p5.height / rows;   
      p5.fill(color);
      p5.stroke(0);
      p5.rect(this.x * w, this.y * h, w, h);
    }
    
    addNeighbours(grid: Array<Array<Node>>): void {
      let x:number = this.x;
      let y:number = this.y;
      if (x < cols - 1) {
        this.neighbours.push(grid[x + 1][y]);
        if (y > 0) {
          this.neighbours.push(grid[x + 1][y - 1]);
        }
        if (y < rows - 1) {
          this.neighbours.push(grid[x + 1][y + 1]);
        }
      }
      if (x > 0) {
        this.neighbours.push(grid[x - 1][y]);
        if (y > 0) {
          this.neighbours.push(grid[x - 1][y - 1]);
        }
        if (y < rows - 1) {
          this.neighbours.push(grid[x - 1][y + 1]);
        }
      } if (y < rows - 1) {
        this.neighbours.push(grid[x][y + 1]);
      } if (y > 0) {
        this.neighbours.push(grid[x][y - 1]);
      }
    }
  };

  
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(400,400).parent(
      canvasParentRef,
    );
    
    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j] = new Node(i, j);
      }
    } 

    for (const row of grid) {
      for (const n of row) {
        n.addNeighbours(grid);
        n.wall = Math.random() < 0.3;
      }
    }
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.f = heuristic(p5, start, end);
    start.wall = false;
    end.wall = false;
    openSet.push(start);
  };

  const draw = (p5: p5Types) => {
    p5.background(128);
    if (openSet.length > 0 && !solFound) {//searching
      let current: Node = openSet[0];
      for (const n of openSet) {
        if (n.f < current.f) {
          current = n;
        }
      }
      
      path = [];
      var temp: Node = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous)
        temp = temp.previous;
      }

      if (current === end) {
        console.log("Done!");
        solFound = true;
      }
      if (solFound) { } else {
        removeFromArray(openSet, current);
        closedSet.push(current);
      
        for (const neighbour of current.neighbours) {
          if (!neighbour.wall && !closedSet.includes(neighbour)) {
            var tempG = current.g + 1//p5.dist(current.x, current.y, neighbour.x, neighbour.y);
            var newPath = false;
            if (openSet.includes(neighbour)) {
              if (tempG < neighbour.g) {
                neighbour.g = tempG;
                newPath = true;
              }
            } else {
              neighbour.g = tempG;
              newPath = true;
              openSet.push(neighbour);
            }
            if (newPath) {
              neighbour.h = heuristic(p5, neighbour, end);
              neighbour.f = neighbour.g + neighbour.h;
              neighbour.previous = current;
            }
          }
        }
      }
    } else {
      if (!solFound && openSet.length === 0) {
        console.log("No solution")
        p5.noLoop();
      }
    }

    for (const row of grid) {
      for (const n of row) {
        if (n.wall) {
          n.show(p5, p5.color(0));     
        } else {
          n.show(p5, p5.color(255));
        }
      }
    }
    for (const n of closedSet) { 
      n.show(p5, p5.color(255, 0, 0));
    }
    if (!noSolution) {
      for (const n of openSet) {
        n.show(p5, p5.color(0, 255, 0));
      }
    }
    for (const n of path) {
      n.show(p5, p5.color(0, 0, 255));
    }
  };
  return <Sketch setup={setup} draw={draw} />;
}
export default App;