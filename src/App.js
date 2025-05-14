import logo from './logo.svg';
import {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import spells from './spells.js';

export default function App() {
    return (
        <>
            {spells()}
        </>
    )
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

