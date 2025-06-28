import Container from 'react-bootstrap/Container';
import {Badge, Col, Form, InputGroup, Row, Table} from 'react-bootstrap';
import {useEffect, useState, useContext} from "react";
import {getModifier, getProficiency, HoverLink, InputWithLabel} from "../utils";
import Select from 'react-select';
import classNames from "../data/classNames.json"
import skills from "../data/skills.json"
import {CharacterContext} from "./main"


export const Subclass = () => {
    const [character, setCharacter] = Object.values(useContext(CharacterContext));
    const sorcerer = ["Aberrant", "Clockwork", "Divine Soul", "Draconic", "Lunar", "Shadow", "Storm", "Wild Magic"],
        druid = ["TBA"];
    if (!character.character_class) {
        return <></>
    }

    let available = {
        "Druid": druid,
        "Sorcerer": sorcerer
    }[character.character_class];
    available = available.map((name) => (
        {value: name, label: name}
    ))

    return (
        <>
            <Select options={available}
                    id="subclass"
                    defaultValue={available.find((element) => element.value === character.subclass)}
                    onChange={(e) => setCharacter({...character, subclass: e.value})}/>
            <Form.Label htmlFor="subclass">Subclass</Form.Label>
        </>
    )
}

export const CharacterClass = () => {
    const [character,setCharacter] = Object.values(useContext(CharacterContext))
    const available = Object.keys(classNames).map((name) => (
        {value: name, label: name}
    ));

    return (
        <>
            <Select options={available}
                    defaultValue={available.find((element) => element.value === character.character_class)}
                    onChange={(i) => setCharacter({...character, character_class: i.value})}/>

            <Form.Label htmlFor="character_class" className="form-label">Class</Form.Label>
        </>
    )
}

export const CharacterLevel = () => {
    const [character,setCharacter] = Object.values(useContext(CharacterContext))
    const available = Array(20).fill(null).map((i, j) => ({value: j + 1, label: j + 1}))

    return (
        <Col>
            <Select options={available}
                    defaultValue={available.find((element) => element.value === character.level)}
                    onChange={(i) => setCharacter({...character, level: i.value})}/>

            <Form.Label htmlFor="character_level" className="form-label">Level</Form.Label>
        </Col>
    )
}

function Points() {
    const character= useContext(CharacterContext).character

    return (
        <>
            {Number(character.stats.strength) + Number(character.stats.dexterity) + Number(character.stats.constitution) + Number(character.stats.intelligence) + Number(character.stats.wisdom) + Number(character.stats.charisma)}
        </>
    )

}


function Stat({id, title, value}) {
    const [character, setCharacter]= Object.values(useContext(CharacterContext))
    const modifier = getModifier(value),
        prefix = modifier > 0 ? '+' : '';

    function handleChange(e) {
        const newChar = {...character}
        newChar.stats[id] = e.target.value;
        setCharacter(newChar);
    }

    return (

        <Row>
            <Col>
                <InputGroup>
                    <Form.Control
                        onChange={handleChange}
                        value={value}/>
                    <InputGroup.Text><Badge bg="primary" title="modifier">{prefix}{modifier}</Badge></InputGroup.Text>
                </InputGroup>
                <Form.Label htmlFor={id} className="form-label mb-3">{title}</Form.Label>
            </Col>
        </Row>
    )
}

function Initiative({dexterity}) {
    return (
        <tr>
            <th>Initiative</th>
            <td>{getModifier(dexterity)}</td>
        </tr>
    )
}

function Proficiency({level}) {
    return (
        <tr>
            <th>Proficiency</th>
            <td>{getProficiency(level)}</td>
        </tr>
    )
}

function SavingThrow({level, stat, statName}) {
    const character = useContext(CharacterContext).character;
    const class_profs = {
            "Sorcerer": ["Constitution", "Charisma"]
        },
        modifier = getModifier(stat),
        isProf = character.character_class in class_profs ? class_profs[character.character_class].includes(statName) : false,
        st = isProf ? modifier + getProficiency(level) : modifier;

    return (
        <tr>
            <th>
                {statName}
            </th>
            <td>
                {isProf ? <Badge bg="primary">
                    <HoverLink id={st} title="Proficiency" children={st} className="text-white text-decoration-none"/>
                </Badge> : <Badge bg="secondary">{st}</Badge>}
            </td>
        </tr>
    )
}

function SavingThrows({level, stats}) {

    return (
        <>
            <SavingThrow level={level} stat={stats.strength} statName="Strength"/>
            <SavingThrow level={level} stat={stats.dexterity} statName="Dexterity"/>
            <SavingThrow level={level} stat={stats.constitution} statName="Constitution"/>
            <SavingThrow level={level} stat={stats.intelligence} statName="Intelligence"/>
            <SavingThrow level={level} stat={stats.wisdom} statName="Wisdom"/>
            <SavingThrow level={level} stat={stats.charisma} statName="Charisma"/>
        </>
    )
}

const Skill = ({skillName, level, statName, stat}) => {
    const [proficient, setProficient] = useState(localStorage.getItem(skillName + "Proficiency") === "true");
    let modifier = getModifier(stat),
        shortName = statName.slice(0, 3)

    useEffect(() => {
        localStorage.setItem(skillName + "Proficiency", proficient ? "true" : "false");
    }, [proficient, skillName])

    function handleChange(e) {
        setProficient(!proficient);
    }

    if (proficient) {
        modifier += getProficiency(level);
    }

    return (
        <tr>
            <th>
                <Form.Check
                    inline
                    id={skillName}
                    onChange={handleChange}
                    checked={proficient}
                    label={skillName + " (" + shortName + ")"}
                />
            </th>
            <td>
                <Badge bg={proficient ? "primary" : "secondary"} title="skill">{modifier}</Badge>
            </td>
        </tr>
    )
}

const Skills = ({level, stats}) => {
    return (
        <>
            {Object.entries(skills).map(([skill, ability], idx) => (
                <Skill skillName={skill}
                       key={skill}
                       level={level}
                       statName={ability}
                       stat={stats[ability]}/>
            ))}
        </>
    )
}

export function Character({character}) {

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        Total points: <Points strength={character.stats.strength} dexterity={character.stats.dexterity}
                                              constitution={character.stats.constitution}
                                              intelligence={character.stats.intelligence} wisdom={character.stats.wisdom}
                                              charisma={character.stats.charisma}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        <Stat id="strength" title="Strength" value={character.stats.strength}/>
                        <Stat id="dexterity" title="Dexterity" value={character.stats.dexterity}/>
                        <Stat id="constitution" title="Constitution" value={character.stats.constitution}/>
                        <Stat id="intelligence" title="Intelligence" value={character.stats.intelligence}/>
                        <Stat id="wisdom" title="Wisdom" value={character.stats.wisdom}/>
                        <Stat id="charisma" title="Charisma" value={character.stats.charisma}/>
                    </Col>
                    <Col md="3">
                        <Table striped size="sm">
                            <tbody>
                            <Initiative dexterity={character.stats.dexterity} />
                            <Proficiency level={character.level}/>
                            </tbody>
                        </Table>

                        <h4>Saving Throws</h4>
                        <Table striped size="sm">
                            <tbody>

                            <SavingThrows level={character.level} stats={character.stats}/>
                            </tbody>
                        </Table>

                        <h4>Skills</h4>
                        <Table striped size="sm">
                            <tbody>
                            <Skills level={character.level} stats={character.stats}/>
                            </tbody>

                        </Table>
                    </Col>
                    <Col>
                        <Row>
                            <Col><InputWithLabel id="armorClass" name="Armor Class" placeholder="10"/></Col>
                            <Col><InputWithLabel id="initiative" name="Initiative" placeholder="10"/></Col>
                            <Col><InputWithLabel id="speed" name="Speed" placeholder="30"/></Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}