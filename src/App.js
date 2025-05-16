import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import Layout from "./pages/layout";
import Spells from "./pages/spells"
import Character from "./pages/character";
import {BrowserRouter, Route, Routes} from "react-router-dom"

export default function App() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Character />} />
          <Route path="spells" element={<Spells />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
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
