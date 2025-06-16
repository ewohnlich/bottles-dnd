import Container from 'react-bootstrap/Container';
import {Badge, Col, Form, InputGroup, Row, Table} from 'react-bootstrap';
import {useEffect, useState} from "react";
import {getModifier, getProficiency, HoverLink, InputWithLabel} from "../utils";
import Select from 'react-select';
import classNames from "../data/classNames.json"


export const Subclass = ({character_class, subclass, subclassChange}) => {
    const sorcerer = ["Aberrant", "Clockwork", "Divine Soul", "Draconic", "Lunar", "Shadow", "Storm", "Wild Magic"],
        druid = ["TBA"];

    let available = {
        "Druid": druid,
        "Sorcerer": sorcerer
    }[character_class]
    available = available.map((name) => (
        {value: name, label: name}
    ))

    return (
        <>
            <Select options={available}
                    id="subclass"
                    defaultValue={available.find((element) => element.value === subclass)}
                    onChange={subclassChange}/>
            <Form.Label htmlFor="subclass">Subclass</Form.Label>
        </>
    )
}

export const CharacterClass = ({character_class, classChange}) => {
    const available = classNames.map((name) => (
        {value: name, label: name}
    ));

    return (
        <>
            <Select options={available}
                    defaultValue={available.find((element) => element.value === character_class)}
                    onChange={classChange}/>

            <label htmlFor="character_class" className="form-label">Class</label>
        </>
    )
}
export const CharacterLevel = ({level, levelChange}) => {
    const available = Array(20).fill(null).map((i, j) => ({value: j + 1, label: j + 1}))

    return (
        <Col>
            <Select options={available}
                    defaultValue={available.find((element) => element.value === level)}
                    onChange={levelChange}/>

            <label htmlFor="character_level" className="form-label">Level</label>
        </Col>
    )
}

function Points({strength, dexterity, constitution, intelligence, wisdom, charisma}) {
    return (
        <>
            {Number(strength) + Number(dexterity) + Number(constitution) + Number(intelligence) + Number(wisdom) + Number(charisma)}
        </>
    )

}


function Stat({id, title, value, setter}) {
    const modifier = getModifier(value),
        prefix = modifier > 0 ? '+' : '';

    function handleChange(e) {
        setter(e.target.value);
    }

    useEffect(() => {
        // storing input name
        localStorage.setItem("state-" + id, JSON.stringify(value));
    }, [id, value]);

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

function Initiative({dexterity, character_class}) {
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

function SavingThrow({level, character_class, stat, stat_name}) {
    const class_profs = {
            "Sorcerer": ["Constitution", "Charisma"]
        },
        modifier = getModifier(stat),
        isProf = character_class in class_profs ? class_profs[character_class].includes(stat_name) : false,
        st = isProf ? modifier + getProficiency(level) : modifier;

    return (
        <tr>
            <th>
                {stat_name}
            </th>
            <td>
                {isProf ? <Badge bg="primary">
                    <HoverLink id={st} title="Proficiency" children={st} className="text-white text-decoration-none"/>
                </Badge> : <Badge bg="secondary">{st}</Badge>}
            </td>
        </tr>
    )
}

function SavingThrows({level, character_class, strength, dexterity, constitution, intelligence, wisdom, charisma}) {

    return (
        <>
            <SavingThrow level={level} character_class={character_class} stat={strength} stat_name="Strength"/>
            <SavingThrow level={level} character_class={character_class} stat={dexterity} stat_name="Dexterity"/>
            <SavingThrow level={level} character_class={character_class} stat={constitution} stat_name="Constitution"/>
            <SavingThrow level={level} character_class={character_class} stat={intelligence} stat_name="Intelligence"/>
            <SavingThrow level={level} character_class={character_class} stat={wisdom} stat_name="Wisdom"/>
            <SavingThrow level={level} character_class={character_class} stat={charisma} stat_name="Charisma"/>
        </>
    )
}

export function Character({level, character_class, allStats}) {

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        Total points: <Points strength={allStats.strength} dexterity={allStats.dexterity}
                                              constitution={allStats.constitution}
                                              intelligence={allStats.intelligence} wisdom={allStats.wisdom}
                                              charisma={allStats.charisma}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        <Stat id="strength" title="Strength" value={allStats.strength} setter={allStats.setStrength}/>
                        <Stat id="dexterity" title="Dexterity" value={allStats.dexterity}
                              setter={allStats.setDexterity}/>
                        <Stat id="constitution" title="Constitution" value={allStats.constitution}
                              setter={allStats.setConstitution}/>
                        <Stat id="intelligence" title="Intelligence" value={allStats.intelligence}
                              setter={allStats.setIntelligence}/>
                        <Stat id="wisdom" title="Wisdom" value={allStats.wisdom} setter={allStats.setWisdom}/>
                        <Stat id="charisma" title="Charisma" value={allStats.charisma} setter={allStats.setCharisma}/>
                    </Col>
                    <Col md="3">
                        <Table striped hover size="sm">
                            <tbody>
                            <Initiative dexterity={allStats.dexterity} character_class={character_class}/>
                            <Proficiency level={level}/>
                            </tbody>
                        </Table>

                        <h4>Saving Throws</h4>
                        <Table striped hover size="sm">
                            <tbody>

                            <SavingThrows level={level} character_class={character_class}
                                          strength={allStats.strength}
                                          dexterity={allStats.dexterity}
                                          constitution={allStats.constitution}
                                          intelligence={allStats.intelligence}
                                          wisdom={allStats.wisdom}
                                          charisma={allStats.charisma}/>
                            </tbody>
                        </Table>

                        skills
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