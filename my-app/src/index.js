import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={'square' + (props.winner ? ' winner' : '')}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                winner={this.props.winningPositions && this.props.winningPositions.includes(i) ? 'true' : undefined}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let [rows, counter] = [[], 0];
        for (let i = 0; i < 3; i++) {
            let squares = [];
            for (let i = 0; i < 3; i++) {
                squares.push(this.renderSquare(counter++))

            }
            rows.push(<div key={i} className="board-row">{squares}</div>);
        }

        return <div>{rows}</div>;
        // return (
        //     <div>
        //         {
        //             for(let i = 0; i<=3; i++){

        //             }
        //         }
        //         <div className="board-row">
        //             {this.renderSquare(0)}
        //             {this.renderSquare(1)}
        //             {this.renderSquare(2)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(3)}
        //             {this.renderSquare(4)}
        //             {this.renderSquare(5)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(6)}
        //             {this.renderSquare(7)}
        //             {this.renderSquare(8)}
        //         </div>

        //     </div>
        // );
        //return <div>{rows}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameMode: null,
            history: [{
                squares: Array(9).fill(null),
                lastMove: 0,
            }],
            selectedMove: 0,
            xIsNext: true,
            sortAsc: true,
            isDraw: false
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.selectedMove + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        
        
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: i,
            }]),
            selectedMove: history.length,
            xIsNext: !this.state.xIsNext
        });
        if (this.state.gameMode === 'singleplayer') {
            this.playAI(squares);
        }
    }
    jumpTo(step) {
        this.setState({
            selectedMove: step,
            xIsNext: (step % 2) === 0,
        });
    }
    calculateWinner(squares) {
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
        //console.log(squares);

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];

            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return {
                    value: squares[a],
                    positions: [a, b, c]
                }
            }
        }
        //console.log(this.state.selectedMove);

        if (this.state.selectedMove === 9) {
            return undefined;
        }
        return null;
    }
    playAI(squares) {
        this.defendAI(squares);
    }
    defendAI(squares, value = 'X') {
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
        let missing;
        
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];

            if (value === squares[a]) {
                if (value === squares[b]) {
                    missing = c;
                    break;
                }
                else if (value === squares[c]) {
                    missing = b;
                    break;
                }
            }
            if (value === squares[b]) {
                if (value === squares[c]) {
                    missing = a;
                    break;
                }

                // return {
                //     value: squares[a],
                //     positions: [a, b, c]
                // }
            }
        }
        console.log(missing);
        
        //this.handleClick(missing);
    }

    getSquarePosition(square) {
        let col, row, counter = 0;
        while (1) {
            counter++;
            if ((square - 3) <= 0) {
                col = square;
                row = counter;
                return [col, row];
            }
            square -= 3;
        }
    }
    render() {
        if (!this.state.gameMode) {
            return (
                <div>
                    <button onClick={() => {
                        this.setState({ gameMode: "singleplayer" });
                    }}>
                        Single Player
                    </button>

                    <button onClick={() => {
                        this.setState({ gameMode: "multiplayer" });
                    }}>
                        Multi Player
                    </button>
                </div>
            );
        }
        else {

            const history = this.state.history.slice();
            const current = history[this.state.selectedMove];
            const result = this.calculateWinner(current.squares);

            const winner = result ? result.value : null;
            const winningPositions = result ? result.positions : null;
            const moves = history.map((step, move) => {
                let lastMove = history[move].lastMove + 1;
                const description = move ?
                    'Go to move #' + move + `(${this.getSquarePosition(lastMove).toString()})` :
                    'Go to game start';
                return (
                    <li key={move}>
                        <button className={this.state.selectedMove === move ? 'selected' : ''} onClick={() => this.jumpTo(move)}>{description}</button>
                    </li>
                )
            });
            if (!this.state.sortAsc) { moves.reverse(); }

            let status;
            if (winner) {
                status = 'Winner: ' + winner;
            } else if (result === undefined) {
                status = 'Empate';
            } else if (this.state.gameMode === 'multiplayer') {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
            return (
                <div className="game">
                    <div className="game-board">
                        <Board
                            winningPositions={winningPositions ? winningPositions : undefined}
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <button onClick={() => { this.setState({ sortAsc: !this.state.sortAsc }) }}>{'Order ' + (this.state.sortAsc ? 'desc' : 'asc')}</button>
                        <ol>{moves}</ol>
                    </div>
                </div>
            );
        }
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
