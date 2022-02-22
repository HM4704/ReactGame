import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import reportWebVitals from './reportWebVitals';

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

function Square(props) {

  return (
      <button style={{color: (props.winner ? 'red' : 'black')}}
        className="square" 
        onClick={props.onClick}>
        {props.value}      
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    let winner = false;
    if (this.props.winnerIds) {
      if (i === this.props.winnerIds[0] || i === this.props.winnerIds[1]
         || i === this.props.winnerIds[2]) {
           winner = true;
         }
    }
    return (<Square  key={i}
      value={this.props.squares[i]} 
      winner = { winner } 
      onClick={() => this.props.onClick(i)}
      />);  
  }

  renderRow(start) {
    var rows = [];
    for (var i = start; i < start+3; i++) {
        // note: we are adding a key prop here to allow react to uniquely identify each
        // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
        rows.push(this.renderSquare(i));
    }
    return <>{rows}</>;
  }

  renderCol() {
    var cols = [];
    for (var i = 0; i < 3; i++) {
        // note: we are adding a key prop here to allow react to uniquely identify each
        // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
        cols.push(<div className="board-row" key={i}>
                  { this.renderRow(i*3) }
                  </div>
        );
    }
    return <>{cols}</>;
  }

    render() {  
      return (
        <div>
        { this.renderCol() }
        </div>
      );
    }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sortOrder: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];    
    const squares = current.squares.slice();    
    const winner = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{        
        squares: squares,      
      }]),   
      stepNumber: history.length,   
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {    
    this.setState({      
      stepNumber: step,      
      xIsNext: (step % 2) === 0,    
    });  
    this.render();
  }

  getPos(move) {
    if (move === 0) {
      return '';
    }
    const current = this.state.history[move];
    const prev = this.state.history[move-1];
    for (let i = 0; i < current.squares.length; i++) {
      if (current.squares[i] !== prev.squares[i]) {
        return '(' + Math.floor(i/3) + ', ' + i%3 + ')';
      }
    }
    return '';
  }

  render() {
    const history = this.state.history;    
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);    

    var moves = history.map((step, move) => {      
        const desc = move ?  'Go to move #' + move : 'Go to game start';      
        return (        
          <li key={move} style={{fontWeight: (move === this.state.stepNumber ? 900 : 400)}}>
            <div className="history-line">
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
              <div style={{marginLeft: 15}}>Pos {this.getPos(move)}</div>
            </div>
          </li>     
        );    
    });
    if (this.state.sortOrder === 1) {
      moves = moves.reverse();
    }
    let status;
    let winnerLine = -1;    
    if (winner) {      
      status = 'Winner: ' + winner;    
      winnerLine = lines[getWinnerIds(current.squares)];
    } else {      
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');    
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winnerIds = {winnerLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.setState({  
             sortOrder: this.state.sortOrder === 0 ? 1 : 0}) 
             }>
               {"Sort " + (this.state.sortOrder === 0 ? "up" : "down")}</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}    

function getWinnerIds(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return i;
    }
  }
  return -1;
}    

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
