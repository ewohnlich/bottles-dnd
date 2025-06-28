import {createContext, useEffect, useState} from "react";

import {Col, Container, Form, Nav, Navbar, Row} from 'react-bootstrap';
import Spells from "./spells"
import {Character, CharacterClass, CharacterLevel, Subclass} from "./character";
import SpellSelect from "./spellbook";
import abjuration from "../data/spells/abjuration.json";
import evocation from "../data/spells/evocation.json";
import {InputWithLabel} from "../utils";
import Basic from "./basic";

const defaultBoosts = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        spellattack: 0,
        spelldc: 0
    },
    defaultCharacter = {
        level: 1,
        character_class: "",
        subclass: "",
        stats: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
        }
    }
export const CharacterContext = createContext(defaultCharacter);

export default function Main() {
    const [prepared, setPrepared] = useState(JSON.parse(localStorage.getItem("prepared")) || []),
        boostProps = useState(JSON.parse(localStorage.getItem("state-boosts")) || defaultBoosts),
        [character, setCharacter] = useState(JSON.parse(localStorage.getItem("state-character")) || defaultCharacter);

    const allSpells = [...abjuration, ...evocation];

    useEffect(() => {
        localStorage.setItem("state-character", JSON.stringify(character));
    }, [character]);

    useEffect(() => {
        localStorage.setItem("prepared", JSON.stringify(prepared));
    }, [prepared]);

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
            <CharacterContext value={{character, setCharacter}}>
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
                                            <CharacterClass/>
                                        </Col>
                                        <Col>
                                            <Subclass/>
                                        </Col>
                                        <Col>
                                            <CharacterLevel/>

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
                            <Character character={character}/>
                        </div>
                        <div id="spells" className="mb-4 d-none">
                            <Spells character={character} prepared={prepared} boostProps={boostProps}/>
                        </div>
                        <div id="basic" className="mb-4 d-none">
                            <Basic/>
                        </div>
                        <div id="spellbook" className="mb-4 d-none">
                            <SpellSelect character={character}
                                         prepared={prepared} setPrepared={setPrepared} book={allSpells}/>
                        </div>
                    </Form>
                </Container>
            </CharacterContext>
        </>
    );
}