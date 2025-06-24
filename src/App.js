import './App.css';
import {Col, Container, Form, Nav, Navbar, Row} from 'react-bootstrap';
import Spells from "./pages/spells"
import {Character, CharacterClass, CharacterLevel, Subclass} from "./pages/character";
import {InputWithLabel} from "./utils";
import {useEffect, useState} from "react";
import Basic from "./pages/basic";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import SpellSelect from "./pages/spellbook";


import {Outlet, Link} from "react-router-dom";
import AddSpell from "./data/spells/form";


const defaultStats = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
    },
    defaultBoosts = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        spellattack: 0,
        spelldc: 0
    };

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Outlet/>}>
                    <Route index element={<Main/>}/>
                    <Route path="spells" element={<AddSpell/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export function Main() {
    const [level, setLevel] = useState(parseInt(localStorage.getItem("level")) || 1),
        [character_class, setCharClass] = useState(localStorage.getItem("character_class") || ""),
        [subclass, setSubclass] = useState(localStorage.getItem("subclass") || ""),
        [prepared, setPrepared] = useState(JSON.parse(localStorage.getItem("prepared")) || []),
        [strength, setStrength] = useState(JSON.parse(localStorage.getItem("state-strength") || 0)),
        [dexterity, setDexterity] = useState(JSON.parse(localStorage.getItem("state-dexterity") || 0)),
        [constitution, setConstitution] = useState(JSON.parse(localStorage.getItem("state-constitution") || 0)),
        [intelligence, setIntelligence] = useState(JSON.parse(localStorage.getItem("state-intelligence") || 0)),
        [wisdom, setWisdom] = useState(JSON.parse(localStorage.getItem("state-wisdom") || 0)),
        [charisma, setCharisma] = useState(JSON.parse(localStorage.getItem("state-charisma") || 0)),
        [stats, setStats] = useState(JSON.parse(localStorage.getItem("state-stats")) || defaultStats),
        boostProps = useState(JSON.parse(localStorage.getItem("state-boosts")) || defaultBoosts),
        allStats = {
            strength: strength,
            dexterity: dexterity,
            constitution: constitution,
            intelligence: intelligence,
            wisdom: wisdom,
            charisma: charisma,
            setStrength: setStrength,
            setDexterity: setDexterity,
            setConstitution: setConstitution,
            setIntelligence: setIntelligence,
            setWisdom: setWisdom,
            setCharisma: setCharisma
        };

    useEffect(() => {
        if (Number.isInteger(parseInt(level))) {
            localStorage.setItem("level", level);
        }
    }, [level]);

    useEffect(() => {
        localStorage.setItem("character_class", character_class);
    }, [character_class]);

    useEffect(() => {
        localStorage.setItem("subclass", subclass);
    }, [subclass]);

    useEffect(() => {
        localStorage.setItem("prepared", JSON.stringify(prepared));
    }, [prepared]);

    function levelChange(e) {
        setLevel(e.value);
    }

    function classChange(e) {
        setCharClass(e.value);
    }

    function subclassChange(e) {
        setSubclass(e.value);
    }

    function activateSection(active) {
        const sections = ['character', 'spells', 'basic', 'spellbook'];
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
                            <Nav.Link eventKey="spells" onClick={() => activateSection('spells')}>Spell
                                Casting</Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Spell Book">
                            <Nav.Link eventKey="spellbook" onClick={() => activateSection('spellbook')}>Spell
                                Book</Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Basic">
                            <Nav.Link eventKey="basic" onClick={() => activateSection('basic')}>Basic</Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="5eTools">
                            <Nav.Link eventKey="5etools" href="https://5e.tools">5etools</Nav.Link>
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
                                        <CharacterClass character_class={character_class} classChange={classChange}/>
                                    </Col>
                                    <Col>
                                        <Subclass character_class={character_class} subclass={subclass}
                                                  subclassChange={subclassChange}/>
                                    </Col>
                                    <Col>
                                        <CharacterLevel level={level} levelChange={levelChange}/>

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
                    <div id="character" className="mb-4">
                        <Character level={level} character_class={character_class} allStats={allStats}/>
                    </div>
                    <div id="spells" className="mb-4 d-none">
                        <Spells level={level} character_class={character_class} allStats={allStats} prepared={prepared}
                                subclass={subclass} boostProps={boostProps}/>
                    </div>
                    <div id="basic" className="mb-4 d-none">
                        <Basic/>
                    </div>
                    <div id="spellbook" className="mb-4 d-none">
                        <SpellSelect level={level} character_class={character_class} subclass={subclass}
                                     prepared={prepared} setPrepared={setPrepared}/>
                    </div>
                </Form>
            </Container>
        </>
    );
}
