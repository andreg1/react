import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Loadable from 'react-loadable';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


function Loading() {
    return <h3>Loading...</h3>;
}

const TicTacToe = Loadable({
    loader: () => import('./tic-tac-toe/index'),
    loading: Loading
});
const Minesweeper = Loadable({
    loader: () => import('./minesweeper/index'),
    loading: Loading
});

class Home extends React.Component{
    render(){
        return( <h3>hello world</h3> );
    }
}

class App extends React.Component {
    render() {

        return (

            <Router>
                <div>
                    <div className="App">
                        <header className="App-header">
                            <h1 className="App-title">Welcome to React</h1>
                            <div className="App-nav">
                                <Link to="/">Home</Link>
                                <Link to="/tic-tac-toe/index">Tic-tac-toe</Link>
                                <Link to="/minesweeper/index">Minesweeper</Link>
                            </div>
                        </header>
                        <div className="App-body">
                            <div className="game-container">
                            <Route exact path="/" component={Home} />
                            <Route path="/tic-tac-toe/index" component={TicTacToe} />
                            <Route path="/minesweeper/index" component={Minesweeper} />
                            </div>
                        </div>
                    </div>

                </div>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

