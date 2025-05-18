import './App.css';
import {Col, Container, Nav, Navbar, Row, Form} from 'react-bootstrap';
import Spells from "./pages/spells"
import Character from "./pages/character";
import {InputWithLabel} from "./pages/utils";
import {useEffect, useState} from "react";

export default function App() {
    const [level, setLevel] = useState(localStorage.getItem("level") || 1);

    function levelChange(e) {
            setLevel(e.target.value);
    }

    function activateSection(active) {
        const sections = ['character', 'spells'];
        sections.forEach(section => {
            if (section !== active) {
                document.getElementById(section).classList.add('d-none');
            } else {
                document.getElementById(section).classList.remove('d-none');
            }
        })
    }

    useEffect(() => {
        if (Number.isInteger(parseInt(level))) {
            localStorage.setItem("level", parseInt(level));
        }
    }, [level]);

    return (
        <>
            <Navbar pand="lg" sticky="top" bg="navbar">
                <Container>
                    <Nav
                        defaultActiveKey="character"
                        id="home-tabs">
                        <Nav.Item title="Character">
                            <Nav.Link eventKey="character"
                                      onClick={() => activateSection('character')}>Character</Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Spells">
                            <Nav.Link eventKey="spells" onClick={() => activateSection('spells')}>Spells</Nav.Link>
                        </Nav.Item>

                        <Nav.Item title="Basic">
                            <Nav.Link eventKey="basic" href="/basic">Basic</Nav.Link>
                        </Nav.Item>
                    </Nav>

                </Container>
            </Navbar>
            <Container>
                <Form>
                <h1>Dungeons & Dragons</h1>
                    <div className="border-bottom border-primary">
                        <Row>
                            <Col>
                                <InputWithLabel id="char_name" name="Character Name"
                                                placeholder="Sothar"/>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <InputWithLabel id="character_class" name="Class" placeholder="Artificer"/>
                                    </Col>
                                    <Col>
                                        <input type="text" className="form-control character-level" id="level"
                                               onChange={levelChange}
                                               value={level}/>
                                        <label htmlFor="level" className="form-label">Level</label>
                                    </Col>
                                    <Col>
                                        <InputWithLabel id="background" name="Background"/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <InputWithLabel id="race" name="Race" placeholder=""/>
                                    </Col>
                                    <Col>
                                        <InputWithLabel id="alignment" name="Alignment"/>
                                    </Col>
                                    <Col>
                                        <InputWithLabel id="xp" name="Experience Points"/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <Container id="character" className="mb-4">
                        <Character level={level}/>
                    </Container>
                    <Container id="spells" className="mb-4 d-none">
                        <Spells level={level}/>
                    </Container>
                </Form>
            </Container>
        </>
    );
}
