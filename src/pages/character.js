import Container from "react-bootstrap/Container";
import { Badge, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { useContext, useState } from "react";
import {
    classMap,
    DieBlock,
    getHitDie,
    getModifier,
    getProficiency,
    HoverLink,
} from "../utils";
import Select from "react-select";
import skills from "../data/skills.json";
import { CharacterContext, ProficiencyContext } from "./main";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import {
    GiD10,
    GiD12,
    GiDiceEightFacesEight,
    GiPerspectiveDiceSixFacesSix,
} from "react-icons/gi";

export const Subclass = ({ character, setCharacter }) => {
    if (!character.character_class) {
        return <></>;
    }
    const available = classMap[character.character_class].subclasses.map(
        (klass) => ({ value: klass, label: klass }),
    );

    return (
        <>
            <Select
                options={available}
                id="subclass"
                value={{ value: character.subclass, label: character.subclass }}
                onChange={(e) =>
                    setCharacter({ ...character, subclass: e.value })
                }
            />
            <Form.Label htmlFor="subclass">Subclass</Form.Label>
        </>
    );
};

export const CharacterClass = ({ character, setCharacter }) => {
    const available = Object.keys(classMap).map((klass) => ({
        value: klass,
        label: klass,
    }));

    return (
        <>
            <Select
                options={available}
                defaultValue={available.find(
                    (element) => element.value === character.character_class,
                )}
                onChange={(i) =>
                    setCharacter({
                        ...character,
                        character_class: i.value,
                        subclass: "",
                    })
                }
            />

            <Form.Label htmlFor="character_class" className="form-label">
                Class
            </Form.Label>
        </>
    );
};

export const CharacterLevel = () => {
    const [character, setCharacter] = Object.values(
        useContext(CharacterContext),
    );
    const available = Array(20)
        .fill(null)
        .map((i, j) => ({ value: j + 1, label: j + 1 }));

    return (
        <Col>
            <Select
                options={available}
                defaultValue={available.find(
                    (element) => element.value === character.level,
                )}
                onChange={(i) => setCharacter({ ...character, level: i.value })}
            />

            <Form.Label htmlFor="character_level" className="form-label">
                Level
            </Form.Label>
        </Col>
    );
};

function Points() {
    const character = useContext(CharacterContext).character;

    return (
        <>
            {Number(character.stats.strength) +
                Number(character.stats.dexterity) +
                Number(character.stats.constitution) +
                Number(character.stats.intelligence) +
                Number(character.stats.wisdom) +
                Number(character.stats.charisma)}
        </>
    );
}

function Stat({ id, title, value }) {
    const [character, setCharacter] = Object.values(
        useContext(CharacterContext),
    );
    const modifier = getModifier(value),
        prefix = modifier > 0 ? "+" : "";

    function handleChange(e) {
        const newChar = { ...character };
        newChar.stats[id] = e.target.value;
        setCharacter(newChar);
    }

    return (
        <Row>
            <Col>
                <InputGroup>
                    <Form.Control onChange={handleChange} value={value} />
                    <InputGroup.Text>
                        <Badge bg="primary" title="modifier">
                            {prefix}
                            {modifier}
                        </Badge>
                    </InputGroup.Text>
                </InputGroup>
                <Form.Label htmlFor={id} className="form-label mb-3">
                    {title}
                </Form.Label>
            </Col>
        </Row>
    );
}

function Initiative({ dexterity }) {
    return (
        <tr>
            <th>Initiative</th>
            <td>{getModifier(dexterity)}</td>
        </tr>
    );
}

function Proficiency({ level }) {
    return (
        <tr>
            <th>Proficiency</th>
            <td>{getProficiency(level)}</td>
        </tr>
    );
}

function SavingThrow({ level, stat, statName }) {
    const character = useContext(CharacterContext).character;
    const class_profs = {
            Sorcerer: ["Constitution", "Charisma"],
        },
        modifier = getModifier(stat),
        isProf =
            character.character_class in class_profs
                ? class_profs[character.character_class].includes(statName)
                : false,
        st = isProf ? modifier + getProficiency(level) : modifier;

    return (
        <tr>
            <th>{statName}</th>
            <td>
                {isProf ? (
                    <Badge bg="primary">
                        <HoverLink
                            id={st}
                            title="Proficiency"
                            children={st}
                            className="text-white text-decoration-none"
                        />
                    </Badge>
                ) : (
                    <Badge bg="secondary">{st}</Badge>
                )}
            </td>
        </tr>
    );
}

function SavingThrows({ level, stats }) {
    return (
        <>
            <SavingThrow
                level={level}
                stat={stats.strength}
                statName="Strength"
            />
            <SavingThrow
                level={level}
                stat={stats.dexterity}
                statName="Dexterity"
            />
            <SavingThrow
                level={level}
                stat={stats.constitution}
                statName="Constitution"
            />
            <SavingThrow
                level={level}
                stat={stats.intelligence}
                statName="Intelligence"
            />
            <SavingThrow level={level} stat={stats.wisdom} statName="Wisdom" />
            <SavingThrow
                level={level}
                stat={stats.charisma}
                statName="Charisma"
            />
        </>
    );
}

const Skill = ({ skillName, level, statName, stat }) => {
    const [proficiency, setProficiency] = Object.values(
        useContext(ProficiencyContext),
    );
    let modifier = getModifier(stat),
        shortName = statName.slice(0, 3);

    function handleChange(e) {
        if (!(skillName in proficiency)) {
            proficiency[skillName] = false;
        }
        const newProf = { ...proficiency };
        newProf[skillName] = !proficiency[skillName];
        setProficiency(newProf);
    }

    if (proficiency[skillName]) {
        modifier += getProficiency(level);
    }

    return (
        <tr>
            <th>
                <Form.Check
                    inline
                    id={skillName}
                    onChange={handleChange}
                    checked={proficiency[skillName]}
                    label={skillName + " (" + shortName + ")"}
                />
            </th>
            <td>
                <Badge
                    bg={proficiency[skillName] ? "primary" : "secondary"}
                    title="skill"
                >
                    {modifier}
                </Badge>
            </td>
        </tr>
    );
};

const Skills = ({ level, stats }) => {
    return (
        <>
            {Object.entries(skills).map(([skill, ability], idx) => (
                <Skill
                    skillName={skill}
                    key={skill}
                    level={level}
                    statName={ability}
                    stat={stats[ability]}
                />
            ))}
        </>
    );
};

export function Character({ character, setCharacter }) {
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        Total points:{" "}
                        <Points
                            strength={character.stats.strength}
                            dexterity={character.stats.dexterity}
                            constitution={character.stats.constitution}
                            intelligence={character.stats.intelligence}
                            wisdom={character.stats.wisdom}
                            charisma={character.stats.charisma}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        <Stat
                            id="strength"
                            title="Strength"
                            value={character.stats.strength}
                        />
                        <Stat
                            id="dexterity"
                            title="Dexterity"
                            value={character.stats.dexterity}
                        />
                        <Stat
                            id="constitution"
                            title="Constitution"
                            value={character.stats.constitution}
                        />
                        <Stat
                            id="intelligence"
                            title="Intelligence"
                            value={character.stats.intelligence}
                        />
                        <Stat
                            id="wisdom"
                            title="Wisdom"
                            value={character.stats.wisdom}
                        />
                        <Stat
                            id="charisma"
                            title="Charisma"
                            value={character.stats.charisma}
                        />
                    </Col>
                    <Col md="3">
                        <Table striped size="sm">
                            <tbody>
                                <Initiative
                                    dexterity={character.stats.dexterity}
                                />
                                <Proficiency level={character.level} />
                            </tbody>
                        </Table>

                        <h4>Saving Throws</h4>
                        <Table striped size="sm">
                            <tbody>
                                <SavingThrows
                                    level={character.level}
                                    stats={character.stats}
                                />
                            </tbody>
                        </Table>

                        <h4>Skills</h4>
                        <Table striped size="sm">
                            <tbody>
                                <Skills
                                    level={character.level}
                                    stats={character.stats}
                                />
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-armor"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                armorClass: e.target.value,
                                            })
                                        }
                                        value={character.armorClass}
                                    />
                                    <Form.Label htmlFor="character-armor">
                                        Armor Class
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-initiative"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                initiative: e.target.value,
                                            })
                                        }
                                        value={character.initiative}
                                    />
                                    <Form.Label htmlFor="character-initiative">
                                        Initiative
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-speed"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                speed: e.target.value,
                                            })
                                        }
                                        value={character.speed}
                                    />
                                    <Form.Label htmlFor="character-speed">
                                        Speed
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-hp"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                hp: e.target.value,
                                            })
                                        }
                                        value={character.hp}
                                    />
                                    <Form.Label htmlFor="character-hp">
                                        Hit Points
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-tempHp"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                tempHp: e.target.value,
                                            })
                                        }
                                        value={character.tempHp}
                                    />
                                    <Form.Label htmlFor="character-tempHp">
                                        Temporary Hit Points
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HitDice
                                    level={character.level}
                                    character_class={character.character_class}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <fieldset>
                                    <legend>Death Saves</legend>
                                    <DeathSaves />
                                </fieldset>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-age"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                age: e.target.value,
                                            })
                                        }
                                        value={character.age}
                                    />
                                    <Form.Label htmlFor="character-age">
                                        Age
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-height"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                height: e.target.value,
                                            })
                                        }
                                        value={character.height}
                                    />
                                    <Form.Label htmlFor="character-height">
                                        Height
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-weight"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                weight: e.target.value,
                                            })
                                        }
                                        value={character.weight}
                                    />
                                    <Form.Label htmlFor="character-weight">
                                        Weight
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-eyes"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                eyes: e.target.value,
                                            })
                                        }
                                        value={character.eyes}
                                    />
                                    <Form.Label htmlFor="character-eyes">
                                        Eyes
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-skin"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                skin: e.target.value,
                                            })
                                        }
                                        value={character.skin}
                                    />
                                    <Form.Label htmlFor="character-skin">
                                        Skin
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id="character-hair"
                                        onChange={(e) =>
                                            setCharacter({
                                                ...character,
                                                hair: e.target.value,
                                            })
                                        }
                                        value={character.hair}
                                    />
                                    <Form.Label htmlFor="character-hair">
                                        Hair
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            id="character-languages"
                                        />
                                        <Form.Label>
                                            Languages and Other Proficiencies
                                        </Form.Label>
                                    </Form.Group>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

const HitDice = ({ level, character_class }) => {
    const hitDie = getHitDie(character_class);
    let blocks = [];
    for (let i = 0; i < level; i++) {
        blocks.push(<HitDieSlot key={i} hitDie={hitDie} />);
    }
    return <DieBlock hitDie={hitDie} body={blocks} />;
};
const HitDieSlot = ({ hitDie }) => {
    const [used, setUsed] = useState(false);

    function handleClick(el) {
        setUsed(!used);
    }

    const diceClass = "die-slot p-2 m-1 d-inline-block",
        diceProps = {
            className: diceClass,
            onClick: handleClick,
            title: hitDie,
        },
        diceTags = {
            d6: <GiPerspectiveDiceSixFacesSix {...diceProps} />,
            d8: <GiDiceEightFacesEight {...diceProps} />,
            d10: <GiD10 {...diceProps} />,
            d12: <GiD12 {...diceProps} />,
        };

    if (used) {
        return (
            <MdOutlineDoNotDisturbAlt
                className={`${diceClass} spent`}
                onClick={handleClick}
            />
        );
    } else {
        return diceTags[hitDie];
    }
};

const DeathSaves = () => {
    return (
        <>
            <DeathSaveSlots header="Successes" variant="success" />
            <DeathSaveSlots header="Failures" variant="danger" />
        </>
    );
};

const DeathSaveSlots = ({ header, variant }) => {
    let blocks = [];
    for (let i = 0; i < 3; i++) {
        blocks.push(<DeathSaveSlot key={i} variant={variant} />);
    }

    return (
        <div className="ds-block me-2">
            <div className="ds-block-header primary p-1">{header}</div>
            <div className="ds-block-body">{blocks}</div>
        </div>
    );
};

const DeathSaveSlot = ({ variant }) => {
    const [used, setUsed] = useState(false);

    function handleClick(el) {
        setUsed(!used);
    }

    const spent = used ? "spent" : "";
    const dsClass = `ds-slot ${variant} p-2 m-1 d-inline-block ${spent}`;

    return <div className={dsClass} onClick={handleClick} />;
};
