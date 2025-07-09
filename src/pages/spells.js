import {Badge, Card, Col, Container, Form, Modal, Row, Table,} from "react-bootstrap";
import {PiSwordDuotone} from "react-icons/pi";
import {MdHealthAndSafety, MdOutlineDoNotDisturbAlt} from "react-icons/md";
import abjuration from "../data/spells/abjuration.json";
import evocation from "../data/spells/evocation.json";
import conjuration from "../data/spells/conjuration.json";
import divination from "../data/spells/divination.json";
import enchantment from "../data/spells/enchantment.json";
import illusion from "../data/spells/illusion.json";
import necromancy from "../data/spells/necromancy.json";
import transmutation from "../data/spells/transmutation.json";
import "bootstrap-icons/font/bootstrap-icons.css";
import {useEffect, useState} from "react";
import ClassSpells from "./class_spells";
import {getModifier, getProficiency, InfoBlock} from "../utils";

export const SpellSlot = () => {
    const [used, setUsed] = useState(false);

    function handleClick(el) {
        setUsed(!used);
    }

    if (used) {
        return (
            <MdOutlineDoNotDisturbAlt
                className="spell-slot spent p-1 m-1 d-inline-block"
                onClick={handleClick}
            />
        );
    } else {
        return (
            <div
                className="spell-slot p-1 m-1 d-inline-block"
                onClick={handleClick}
            />
        );
    }
};

const SpellLevelSlots = ({ level, count }) => {
    let blocks = [];
    for (let i = 0; i < count; i++) {
        blocks.push(<SpellSlot key={i} />);
    }
    return <InfoBlock header={"Level " + level} body={blocks} />;
};

export const SpellSlots = ({ slots }) => {
    let levels = [];
    if (slots) {
        slots.forEach((count, level) => {
            levels.push(
                <SpellLevelSlots
                    key={level + "-" + count}
                    level={level + 1}
                    count={count}
                />,
            );
        });
        return (
            <>
                <h3>Spell Slots</h3>
                {levels}
            </>
        );
    }
};

const Duration = ({ spell }) => {
    if (spell.concentration) {
        return (
            <tr>
                <th>Duration</th>
                <td>
                    {spell.duration ? `${spell.duration}` : ""}
                    <Badge bg="warning" className="ms-2">
                        Concentration
                    </Badge>
                </td>
            </tr>
        );
    } else if (spell.duration) {
        return (
            <tr>
                <th>Duration</th>
                <td>{spell.duration}</td>
            </tr>
        );
    }
};
const Range = ({ spell }) => {
    if (spell.range) {
        return (
            <tr>
                <th>Range</th>
                <td>{spell.range}</td>
            </tr>
        );
    }
};
const AoE = ({ spell }) => {
    if (spell.aoe) {
        return (
            <tr>
                <th>Area of Effect</th>
                <td>{spell.aoe}</td>
            </tr>
        );
    }
};

const HigherLevel = ({ spell }) => {
    if (spell.plus_slot) {
        return (
            <Row>
                <Col>
                    <span className="me-1">
                        <i className="small">at higher levels...</i>{" "}
                    </span>
                    {spell.plus_slot} per level
                </Col>
            </Row>
        );
    }
};

const DmgType = ({ spell, level }) => {
    let short = spell.short;
    if (spell.level === 0) {
        spell.cantrip_upgrade.forEach((upgrade) => {
            if (level >= upgrade.level) {
                short = upgrade.dmg;
            }
        });
    }
    if (short) {
        return (
            <Row>
                <Col>
                    {spell.dmg_type === "Heal" ? (
                        <span className="me-1">
                            <MdHealthAndSafety />
                        </span>
                    ) : (
                        <span className="me-1">
                            <PiSwordDuotone />
                        </span>
                    )}
                    {short}
                    <span
                        className={
                            "badge ms-1 bg-dmgtype-" +
                            spell.dmg_type.toLowerCase()
                        }
                    >
                        {spell.dmg_type}
                    </span>
                </Col>
            </Row>
        );
    }
};

function Spell({ spell, level }) {
    const [show, setShow] = useState(false);
    const fullDescription = spell.full.map((para) => {
        return <p>{para}</p>;
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Card style={{ width: "18rem" }} className="my-2">
                <Card.Header
                    className="bg-spell text-white h3"
                    onClick={handleShow}
                    role="button"
                >
                    {spell.name}
                </Card.Header>
                <Card.Body>
                    <Container>
                        <DmgType spell={spell} level={level} />
                        <HigherLevel spell={spell} />
                        <Row className="mt-2">
                            <Col>{spell.spell_type}</Col>
                        </Row>
                    </Container>
                    <Table>
                        <tbody>
                            <tr>
                                <th>Speed</th>
                                <td>
                                    <Badge
                                        bg={
                                            "spell-" +
                                            spell.cast_time.toLowerCase()
                                        }
                                    >
                                        {spell.cast_time}
                                    </Badge>
                                </td>
                            </tr>
                            <Duration spell={spell} />
                            <Range spell={spell} />
                            <AoE spell={spell} />
                            <tr>
                                <th>Components</th>
                                <td>
                                    {spell.components.map((c) => (
                                        <Badge
                                            bg="secondary"
                                            className="me-1"
                                            key={c}
                                        >
                                            {c}
                                        </Badge>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{spell.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{fullDescription}</Modal.Body>
            </Modal>
        </>
    );
}

const SpellsByLevel = ({ spells, level, character_level }) => {
    if (!spells) {
        return;
    }
    spells = spells.map((spell) => {
        return (
            <Col key={spell.name}>
                <Spell spell={spell} level={character_level} />
            </Col>
        );
    });
    return (
        <>
            <Row>
                <Col>
                    <h4> Spell Level: {level === 0 ? "Cantrips" : level}</h4>
                </Col>
            </Row>
            <Row>{spells}</Row>
        </>
    );
};

const SpellCastingAbility = ({ spellAbility }) => {
    return (
        <span className="m-1 p-1">
            Spellcasting Ability: <Badge bg="primary">+{spellAbility}</Badge>
        </span>
    );
};

const SpellSaveDC = ({ level, spellAbility, boostProps }) => {
    const score = 8 + spellAbility + getProficiency(level),
        [boosts] = boostProps;

    return (
        <>
            <span className="m-1 p-1">
                Spell save DC:{" "}
                <Badge bg="primary">{score + boosts.spelldc}</Badge>
            </span>
        </>
    );
};

const SpellAttackBonus = ({ level, spellAbility }) => {
    const score = spellAbility + getProficiency(level);
    const [extra, setExtra] = useState(
        localStorage.getItem("dnd-saExtra")
            ? parseInt(localStorage.getItem("dnd-saExtra"))
            : 0,
    );

    function handleExtra(e) {
        const new_extra = e.target.value;
        if (Number.isInteger(parseInt(new_extra))) {
            setExtra(parseInt(new_extra));
        } else {
            setExtra(new_extra);
        }
    }

    useEffect(() => {
        // storing input name
        localStorage.setItem("dnd-saExtra", JSON.stringify(extra));
    }, [extra]);
    return (
        <>
            <span className="m-1 p-1">
                Spell Attack Bonus:{" "}
                <Badge bg="primary">
                    +{Number.isInteger(extra) ? score + extra : score}
                </Badge>
            </span>
            <Form.Label htmlFor="dnd-saExtra" column={false}>
                Extra:
            </Form.Label>
            <input
                type="text"
                id="dnd-saExtra"
                className="form-control d-inline w-auto"
                size="1"
                value={extra}
                onChange={handleExtra}
            />
        </>
    );
};

export default function Spells({ character, prepared, boostProps }) {
    const classAbility = {
            Artificer: character.stats.intelligence,
            Bard: character.stats.charisma,
            Cleric: character.stats.wisdom,
            Druid: character.stats.wisdom,
            Paladin: character.stats.charisma,
            Ranger: character.stats.wisdom,
            Sorcerer: character.stats.charisma,
            Warlock: character.stats.charisma,
            Wizard: character.stats.intelligence,
        },
        spellAbility = getModifier(classAbility[character.character_class]),
        sources = [abjuration, conjuration, divination, enchantment, evocation, illusion, necromancy, transmutation];
    let byLevel = [];

    sources.forEach((source) => {
        source.forEach((spell) => {
            if (!prepared.includes(spell.name)) {
                return;
            } else {
                if (!(spell.level in byLevel)) {
                    byLevel[spell.level] = [];
                }
                byLevel[spell.level].push(spell);
            }
        });
    });
    byLevel = Array.from({ length: 20 }, (i, j) => (
        <SpellsByLevel
            spells={byLevel[j]}
            level={j}
            character_level={character.level}
            key={j}
        />
    ));

    return (
        <>
            <div className="characterClassSection p-4">
                <Container>
                    <Row>
                        <Col>
                            <SpellCastingAbility spellAbility={spellAbility} />
                        </Col>
                        <Col>
                            <SpellSaveDC
                                level={character.level}
                                spellAbility={spellAbility}
                                boostProps={boostProps}
                            />{" "}
                        </Col>
                        <Col>
                            <SpellAttackBonus
                                level={character.level}
                                spellAbility={spellAbility}
                            />{" "}
                        </Col>
                    </Row>
                </Container>
                <ClassSpells
                    level={character.level}
                    character_class={character.character_class}
                    boostProps={boostProps}
                />
            </div>
            <Container className="py-1 mb-1">{byLevel}</Container>
        </>
    );
}
