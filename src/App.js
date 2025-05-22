import './App.css';
import {Col, Container, Nav, Navbar, Row, Form} from 'react-bootstrap';
import Spells from "./pages/spells"
import {Character, CharacterClass, CharacterLevel} from "./pages/character";
import {InputWithLabel} from "./utils";
import {useEffect, useState} from "react";

export default function App() {
    const [level, setLevel] = useState(parseInt(localStorage.getItem("level")) || 1);
    const [character_class, setCharClass] = useState(localStorage.getItem("character_class") || "");

    useEffect(() => {
        if (Number.isInteger(parseInt(level))) {
            localStorage.setItem("level", level);
        }
    }, [level]);

    useEffect(() => {
        localStorage.setItem("character_class", character_class);
    }, [character_class]);

    function levelChange(e) {
        setLevel(e.value);
    }

    function classChange(e) {
        setCharClass(e.value);
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
                    <h1 className="text-secondary">Dungeons & Dragons</h1>
                    <div className="border-bottom border-primary">
                        <Row>
                            <Col>
                                <InputWithLabel id="char_name" name="Character Name"
                                                placeholder="Sothar"/>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <CharacterClass character_class={character_class} classChange={classChange} />
                                    </Col>
                                    <Col>
                                        <CharacterLevel level={level} levelChange={levelChange}/>
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
                        <Character level={level} character_class={character_class}/>
                    </Container>
                    <Container id="spells" className="mb-4 d-none">
                        <Spells level={level} character_class={character_class}/>
                    </Container>
                </Form>
            </Container>
        </>
    );
}
