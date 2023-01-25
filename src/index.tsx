import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

type Cell = 'x' | 'o' | null;
type Squares = Cell[]

type history = {
  'squares' :Squares;
}[]
interface squareProps {
  value: Cell
  onClick: () => void;
}

interface boardProps {
  squares: Squares;
  onClick: (i: number) => void;
}
interface gameState {
  boardHistory: history,
  xISNext: boolean,
  stepNumber: number
}
interface gameProps {
  // history: boardProps[],
}

function Square(props: squareProps) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component<boardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component<gameProps, gameState> {
  constructor(props: gameProps) {
    super(props);
    let tmpCell : Cell= null;
    let tmpSquares : Squares = Array(9).fill(tmpCell);
    let initHistory : history = [{'squares':tmpSquares}]
    this.state = {
      boardHistory: initHistory,
      xISNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i: number) {
    let tmpHistory = this.state.boardHistory.slice(0, this.state.stepNumber + 1);
    let current = tmpHistory[tmpHistory.length - 1];
    let tmpSquares = current.squares.slice();
    if (calculateWinner(tmpSquares) || tmpSquares[i]) {
      return;
    }
    tmpSquares[i] = this.state.xISNext ? 'x' : 'o';
    this.setState({
      boardHistory: tmpHistory.concat([{
        'squares':tmpSquares
      }]),
      stepNumber: tmpHistory.length,
      xISNext: !this.state.xISNext,
    });
    
  }
  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xISNext: (step % 2) === 0
    });
  }

  render() {
    const tmpHistory = this.state.boardHistory;
    const current = tmpHistory[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = tmpHistory.map((step, move) => {
      
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xISNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(<Game />);

function calculateWinner(squares: Cell[]) {
  // let square = squares.squares;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}