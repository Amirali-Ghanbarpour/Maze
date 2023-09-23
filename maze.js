const readline = require('readline');
const PriorityQueue = require('priorityqueuejs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log("sdsd")
rl.question('Enter the number of rows and columns: ', inputDim => {
  const dimension = inputDim.split(' ').map(Number);

  rl.question('Enter the start node position: ', inputStrt => {
    const st = inputStrt.split(' ').map(Number);

    rl.question('Enter the goal nodes position: ', inputGoal => {
      const gl = inputGoal.split(' ').map(Number);

      takeInput();
      const walls = [];
      function takeInput() {
        rl.question(
          "Enter the position of wall (type 'done' to finish): ",
          wall => {
            if (wall.toLowerCase() === 'done') {
              //
              //
              //
              //
              //
              //
              //
              // our maze
              const maze = createMaze(dimension, walls);
              console.log(maze);
              // start node
              const start = { x: st[0], y: st[1] };
              // goal node
              const goal = { x: gl[0], y: gl[1] };
              //
              //
              //

              const path = pathFinding(maze, start, goal);
              let result = [];

              if (path) {
                console.log('Solution Path:');
                for (const node of path) {
                  result.push(Object.values(node));
                }
                console.log('(' + result.join(') => (') + ')');
                console.log('The cost: ', result.length - 1);
              } else {
                console.log('No path found.');
              }

              //
              //
              //
              //
              rl.close();
            } else {
              walls.push(wall.split(' ').map(Number));
              takeInput();
            }
          }
        );
      }
    });
  });
});

function createMaze(dimension, walls) {
  const maze = [];
  const rows = dimension[0];
  const columns = dimension[1];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      let flag = true;
      for (const wall of walls) {
        if (i === wall[0] && j === wall[1]) {
          row.push(1);
          flag = false;
        }
      }
      if (flag === false) continue;
      row.push(0);
    }
    maze.push(row);
  }

  return maze;
}

// all neighbors of a node
function getNeighbors(maze, node) {
  const { x, y } = node;
  const neighbors = [];

  // top neighbor
  if (x > 0 && maze[x - 1][y] === 0) {
    neighbors.push({ x: x - 1, y });
  }
  // bottom neighbor
  if (x < maze.length - 1 && maze[x + 1][y] === 0) {
    neighbors.push({ x: x + 1, y });
  }
  // left neighbor
  if (y > 0 && maze[x][y - 1] === 0) {
    neighbors.push({ x, y: y - 1 });
  }
  // right neighbor
  if (y < maze[x].length - 1 && maze[x][y + 1] === 0) {
    neighbors.push({ x, y: y + 1 });
  }

  return neighbors;
}

// Euclidean distance
function calcDistance(posA, posB) {
  const dx = posB.x - posA.x;
  const dy = posB.y - posA.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// pathfinding algorithm (A*)
function pathFinding(maze, start, goal) {
  const frontier = new PriorityQueue();
  frontier.enq(start, 0);

  const cameFrom = {};
  const costSoFar = {};
  cameFrom[`${start.x},${start.y}`] = null;
  costSoFar[`${start.x},${start.y}`] = 0;

  while (!frontier.isEmpty()) {
    const current = frontier.deq();
    const { x, y } = current;

    if (x === goal.x && y === goal.y) {
      console.log('Goal reached!');
      const path = [];
      let node = goal;
      while (node) {
        path.unshift(node);
        node = cameFrom[`${node.x},${node.y}`];
      }
      return path;
    }

    const nextNodes = getNeighbors(maze, current);
    for (const nextNode of nextNodes) {
      const newCost = costSoFar[`${x},${y}`] + 1;
      const nodeKey = `${nextNode.x},${nextNode.y}`;

      if (!(nodeKey in costSoFar) || newCost < costSoFar[nodeKey]) {
        costSoFar[nodeKey] = newCost;
        const priority = newCost + calcDistance(nextNode, goal);
        frontier.enq(nextNode, priority);
        cameFrom[nodeKey] = current;
      }
    }
  }
  // No path found
  return null;
}
