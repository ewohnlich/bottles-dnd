import { createContext, useEffect, useState } from "react";

import {
    Button,
    Col,
    Container,
    Form,
    Modal,
    Nav,
    Navbar,
    NavDropdown,
    Row,
} from "react-bootstrap";
import Spells from "./spells";
import {
    Character,
    CharacterClass,
    CharacterLevel,
    Subclass,
} from "./character";
import SpellSelect from "./spellbook";
import abjuration from "../data/spells/abjuration.json";
import evocation from "../data/spells/evocation.json";
import Basic from "./basic";
import skills from "../data//skills.json";
import Notes from "./notes";

const defaultBoosts = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        spellattack: 0,
        spelldc: 0,
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
        },
        hp: 10,
        tempHp: 0,
        hitDice: 0,
        dsSuccess: 0,
        dsFailure: 0,
        age: "",
        height: "",
        weight: "",
        eyes: "",
        skin: "",
        hair: "",
    },
    defaultSkills = Object.keys(skills).reduce((acc, key) => {
        acc[key] = false;
        return acc;
    }, {});

export const CharacterContext = createContext(defaultCharacter);
export const ProficiencyContext = createContext({});

export function ExportCharacter() {
    const json = JSON.stringify({
        character: JSON.parse(localStorage.getItem("dnd-character")),
        boosts: JSON.parse(localStorage.getItem("dnd-boosts")),
        proficiencies: JSON.parse(localStorage.getItem("dnd-proficiencies")),
        prepared: JSON.parse(localStorage.getItem("dnd-prepared")),
    });
    return json;
    // const blob = new Blob([json], {type: "application/json"});
    // return blob
}

const JsonData = () => {
    const [showImport, setShowImport] = useState(false),
        [showExport, setShowExport] = useState(false),
        handleCloseImport = (e) => {
            setShowImport(false);
        },
        handleShowImport = (e) => {
            e.target.classList.remove("active");
            setShowImport(true);
        },
        handleCloseExport = (e) => {
            setShowExport(false);
        },
        handleShowExport = (e) => {
            e.target.classList.remove("active");
            setShowExport(true);
        };

    function importJSON() {
        alert("todo2");
    }

    return (
        <>
            <NavDropdown title="JSON" id="json-dropdown">
                <NavDropdown.Item eventKey="export" onClick={handleShowExport}>
                    Export
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="import" onClick={handleShowImport}>
                    Import
                </NavDropdown.Item>
            </NavDropdown>

            <Modal show={showImport} onHide={handleCloseImport}>
                <Modal.Header closeButton>
                    <Modal.Title>Import Character</Modal.Title>
                </Modal.Header>
                <Modal.Body>upload me</Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>

            <Modal show={showExport} onHide={handleCloseExport}>
                <Modal.Header closeButton>
                    <Modal.Title>Export Character</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button href="/export">Download</Button>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    );
};

export function Main() {
    const [prepared, setPrepared] = useState(
            JSON.parse(localStorage.getItem("dnd-prepared")) || [],
        ),
        boostProps = useState(
            JSON.parse(localStorage.getItem("dnd-boosts")) || defaultBoosts,
        ),
        [character, setCharacter] = useState(
            JSON.parse(localStorage.getItem("dnd-character")) ||
                defaultCharacter,
        ),
        [proficiency, setProficieny] = useState(
            JSON.parse(localStorage.getItem("dnd-proficiencies")) ||
                defaultSkills,
        ),
        [section, setSection] = useState("character");

    const allSpells = [...abjuration, ...evocation];

    useEffect(() => {
        localStorage.setItem("dnd-character", JSON.stringify(character));
    }, [character]);

    useEffect(() => {
        localStorage.setItem("dnd-prepared", JSON.stringify(prepared));
    }, [prepared]);

    useEffect(() => {
        localStorage.setItem("dnd-proficiencies", JSON.stringify(proficiency));
    }, [proficiency]);

    useEffect(() => {
        localStorage.setItem("dnd-boosts", JSON.stringify(boostProps[0]));
    }, [boostProps[0]]);

    return (
        <>
            <Navbar pand="lg" sticky="top" bg="navbar">
                <Container>
                    <Nav defaultActiveKey="character" id="home-tabs">
                        <Nav.Item title="Character">
                            <Nav.Link
                                eventKey="character"
                                onClick={() => setSection("character")}
                            >
                                Character
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Spells">
                            <Nav.Link
                                eventKey="spells"
                                onClick={() => setSection("spells")}
                            >
                                Spell Casting
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Spell Book">
                            <Nav.Link
                                eventKey="spellbook"
                                onClick={() => setSection("spellbook")}
                            >
                                Spell Book
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Basic">
                            <Nav.Link
                                eventKey="basic"
                                onClick={() => setSection("basic")}
                            >
                                Basic
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="Notes">
                            <Nav.Link
                                eventKey="notes"
                                onClick={() => setSection("notes")}
                            >
                                Notes
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item title="5eTools">
                            <Nav.Link
                                eventKey="5etools"
                                href="https://5e.tools"
                            >
                                5etools
                            </Nav.Link>
                        </Nav.Item>
                        <JsonData />
                    </Nav>
                </Container>
            </Navbar>
            <CharacterContext value={{ character, setCharacter }}>
                <ProficiencyContext value={{ proficiency, setProficieny }}>
                    <Container>
                        <Form>
                            <h1 className="text-secondary">
                                Dungeons & Dragons
                            </h1>
                            <div className="border-bottom border-primary">
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Control
                                                id="character-name"
                                                onChange={(e) =>
                                                    setCharacter({
                                                        ...character,
                                                        name: e.target.value,
                                                    })
                                                }
                                                value={character.name}
                                            />
                                            <Form.Label htmlFor="character-name">
                                                Character Name
                                            </Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <CharacterClass
                                                    character={character}
                                                    setCharacter={setCharacter}
                                                />
                                            </Col>
                                            <Col>
                                                <Subclass
                                                    character={character}
                                                    setCharacter={setCharacter}
                                                />
                                            </Col>
                                            <Col>
                                                <CharacterLevel />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Control
                                                        id="character-race"
                                                        onChange={(e) =>
                                                            setCharacter({
                                                                ...character,
                                                                race: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        value={character.race}
                                                    />
                                                    <Form.Label htmlFor="character-race">
                                                        Race
                                                    </Form.Label>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Control
                                                        id="character-alignment"
                                                        onChange={(e) =>
                                                            setCharacter({
                                                                ...character,
                                                                alignment:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        value={
                                                            character.alignment
                                                        }
                                                    />
                                                    <Form.Label htmlFor="character-alignment">
                                                        Alignment
                                                    </Form.Label>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Control
                                                        id="character-xp"
                                                        onChange={(e) =>
                                                            setCharacter({
                                                                ...character,
                                                                xp: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        value={character.xp}
                                                    />
                                                    <Form.Label htmlFor="character-xp">
                                                        Experience Points
                                                    </Form.Label>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            <div
                                id="character"
                                className={`mb-4${section === "character" ? "" : " d-none"}`}
                            >
                                <Character
                                    character={character}
                                    setCharacter={setCharacter}
                                />
                            </div>
                            <div
                                id="spells"
                                className={`mb-4${section === "spells" ? "" : " d-none"}`}
                            >
                                <Spells
                                    character={character}
                                    prepared={prepared}
                                    boostProps={boostProps}
                                />
                            </div>
                            <div
                                id="basic"
                                className={`mb-4${section === "basic" ? "" : " d-none"}`}
                            >
                                <Basic />
                            </div>
                            <div
                                id="notes"
                                className={`mb-4${section === "notes" ? "" : " d-none"}`}
                            >
                                <Notes />
                            </div>
                            <div
                                id="spellbook"
                                className={`mb-4${section === "spellbook" ? "" : " d-none"}`}
                            >
                                <SpellSelect
                                    character={character}
                                    prepared={prepared}
                                    setPrepared={setPrepared}
                                    book={allSpells}
                                />
                            </div>
                        </Form>
                    </Container>
                </ProficiencyContext>
            </CharacterContext>
        </>
    );
}
