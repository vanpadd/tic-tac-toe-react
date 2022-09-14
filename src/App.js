import React from 'react';
import './App.css';

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <header>
        <h1 style={{ fontSize: 24, fontFamily: 'monospace' }}>
          Nyra Tic Tac Toe
        </h1>
      </header>
      <Game />
    </div>
  );
}

const generateGrid = (rows, columns, mapper) => {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
};

const ticTacToeGrid = () => generateGrid(3, 3, () => null);

const clone = (state) => JSON.parse(JSON.stringify(state));

const checkThree = (a, b, c) => {
  if (!a || !b || !c) return false;
  return a === b && b === c;
};

const checkForWin = (flatGrid) => {
  const [nw, n, ne, w, c, e, sw, s, se] = flatGrid;

  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, w, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  );
};

const checkForDraw = (flatGrid) => {
  return (
    !checkForWin(flatGrid) &&
    flatGrid.filter(Boolean).length === flatGrid.length
  );
};

const NEXT_TURN = {
  O: 'X',
  X: 'O',
};

const getInitialState = () => ({
  grid: ticTacToeGrid(),
  status: 'begin',
  turn: '-',
});

const reducer = (state, action) => {
  if (state.status === 'success' && action.type !== 'RESET') {
    return state;
  }
  switch (action.type) {
    case 'CLICK':
      const { grid, turn } = state;
      const { x, y } = action.payload;
      if (grid[y][x]) {
        return state;
      }
      const nextState = clone(state);
      nextState.grid[y][x] = turn;
      const flatten = nextState.grid.flat();
      if (checkForWin(flatten)) {
        nextState.status = 'success';
        return nextState;
      }

      if (checkForDraw(flatten)) {
        nextState.status = 'draw';
        return nextState;
      }

      nextState.turn = NEXT_TURN[turn];
      return nextState;

    case 'SELECTION':
      return {
        grid: ticTacToeGrid(),
        status: 'inProgress',
        turn: action.payload,
      };
    case 'RESET':
      return getInitialState();
    default:
      return state;
  }
};

function Game() {
  const [state, dispatch] = React.useReducer(reducer, getInitialState());
  const { grid, turn, status } = state;

  const handleClick = (x, y) => {
    if (status === 'inProgress') {
      dispatch({ type: 'CLICK', payload: { x, y } });
    }
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const handleOnSelection = (selection) => {
    dispatch({ type: 'SELECTION', payload: selection });
  };

  return (
    <div style={{ display: 'inline-block', paddingTop: 50 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 10,
        }}
      >
        {status === 'begin' && (
          <div>
            <div
              style={{
                marginBottom: 10,
                fontSize: 24,
                fontFamily: 'monospace',
              }}
            >
              Who's starting out?
            </div>
            <div style={{ fontSize: 24, fontFamily: 'monospace' }}>
              <button
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: '#0ABAB5',
                  borderRadius: 5,
                  border: 0,
                  fontSize: 24,
                  fontFamily: 'monospace',
                }}
                onClick={() => handleOnSelection('X')}
              >
                X
              </button>{' '}
              or{' '}
              <button
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: '#0ABAB5',
                  borderRadius: 5,
                  border: 0,
                  fontSize: 24,
                  fontFamily: 'monospace',
                }}
                onClick={() => handleOnSelection('O')}
              >
                O
              </button>
            </div>
          </div>
        )}
        {status === 'inProgress' && (
          <div
            style={{ fontSize: 24, marginBottom: 50, fontFamily: 'monospace' }}
          >
            Who's turn is it? {turn}
          </div>
        )}
        <div
          style={{ fontSize: 21, fontWeight: 'bold', fontFamily: 'monospace' }}
        >
          {status === 'success'
            ? `Three in a row - ${turn} won!`
            : status === 'draw'
            ? `It's a draw!`
            : null}
        </div>
        <Grid grid={grid} handleClick={handleClick}></Grid>
        <button
          type="button"
          style={{
            height: 50,
            backgroundColor: '#0ABAB5',
            borderRadius: 5,
            border: 0,
            fontSize: 24,
            fontFamily: 'monospace',
          }}
          onClick={reset}
        >
          Play again!
        </button>
      </div>
    </div>
  );
}

function Grid({ grid, handleClick }) {
  return (
    <div
      style={{
        display: 'inline-block',
        marginTop: 50,
        marginBottom: 50,
      }}
    >
      <div
        style={{
          backgroundColor: '#444',
          display: 'grid',
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 2,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              onClick={() => handleClick(colIdx, rowIdx)}
              value={value}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Cell({ value, onClick }) {
  return (
    <div style={{ width: 100, height: 100 }}>
      <button
        style={{
          backgroundColor: '#fff',
          borderColor: 'transparent',
          fontWeight: 'bold',
          fontSize: 32,
          width: '100%',
          height: '100%',
        }}
        onClick={onClick}
        type="button"
      >
        <text style={{ color: value === 'X' && 'red' }}>{value}</text>
      </button>
    </div>
  );
}

export default App;
