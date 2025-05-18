import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import {Nav, Navbar, Container} from 'react-bootstrap';
import Layout from "./pages/layout";
import Spells from "./pages/spells"
import Character from "./pages/character";
import {useEffect, useState} from "react";

export default function App() {
    // todo move this to character. character.js should be something else?
    const [level, setLevel] = useState(JSON.parse(localStorage.getItem("level") || 1));

    function levelChange(e) {
        setLevel(e.target.value);
    }

    useEffect(() => {
        // storing input name
        localStorage.setItem("level", JSON.stringify(level));
    }, [level]);

    return (
        <>
            <Navbar expand="lg" sticky="top" bg="navbar">
                <Container>
                    <Nav
                        defaultActiveKey="character"
                        variant="pills"
                        id="home-tabs">
                        <Nav.Item title="Character">
                            <Nav.Link eventKey="character" href="#character">Character</Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Spells">
                            <Nav.Link eventKey="spells" href="#spells">Spells</Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Basic">
                            <Nav.Link eventKey="basic" href="/basic">Basic</Nav.Link>
                        </Nav.Item>
                    </Nav>

                </Container>
            </Navbar>
            <Container id="#character" className="mb-4">
                <Character level={level} setLevel={levelChange}/>
            </Container>
            <Container id="#spells" className="mb-4">
                <Spells level={level} setLevel={levelChange}/>
            </Container>
        </>
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
