import Container from 'react-bootstrap/Container';
import {Row, Col, Form, Badge, InputGroup, Table} from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';
import {useState, useEffect} from "react";
import {getModifier, getProficiency} from "../utils";
import Select from 'react-select';


export const CharacterClass = ({character_class, classChange}) => {
    const available = [
        {value: 'Druid', label: 'Druid'},
        {value: 'Sorcerer', label: 'Sorcerer'},
        {value: 'Wizard', label: 'Wizard'},
    ];

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
    const available = Array(20).fill(null).map((i,j) => ({value: j, label:j}))

    return (
        <>
            <Select options={available}
                    defaultValue={available.find((element) => element.value === level)}
                    onChange={levelChange}/>

            <label htmlFor="character_level" className="form-label">Level</label>
        </>
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

export function Character({level, character_class}) {
    const [strength, setStrength] = useState(JSON.parse(localStorage.getItem("state-strength") || 0));
    const [dexterity, setDexterity] = useState(JSON.parse(localStorage.getItem("state-dexterity") || 0));
    const [constitution, setConstitution] = useState(JSON.parse(localStorage.getItem("state-constitution") || 0));
    const [intelligence, setIntelligence] = useState(JSON.parse(localStorage.getItem("state-intelligence") || 0));
    const [wisdom, setWisdom] = useState(JSON.parse(localStorage.getItem("state-wisdom") || 0));
    const [charisma, setCharisma] = useState(JSON.parse(localStorage.getItem("state-charisma") || 0));


    return (
        <>
            <Container>
                <Row>
                    <Col>
                        Total points: <Points strength={strength} dexterity={dexterity} constitution={constitution}
                                              intelligence={intelligence} wisdom={wisdom} charisma={charisma}/>
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        <Stat id="strength" title="Strength" value={strength} setter={setStrength}/>
                        <Stat id="dexterity" title="Dexterity" value={dexterity} setter={setDexterity}/>
                        <Stat id="constitution" title="Constitution" value={constitution} setter={setConstitution}/>
                        <Stat id="intelligence" title="Intelligence" value={intelligence} setter={setIntelligence}/>
                        <Stat id="wisdom" title="Wisdom" value={wisdom} setter={setWisdom}/>
                        <Stat id="charisma" title="Charisma" value={charisma} setter={setCharisma}/>
                    </Col>
                    <Col md="6">
                        <Table striped>
                            <tbody>
                            <Initiative dexterity={dexterity} character_class={character_class}/>
                            <Proficiency level={level}/>
                            </tbody>
                        </Table>

                        saving throws, skills
                    </Col>
                    <Col>
                        armor class, init, speed, etc.
                    </Col>
                </Row>
            </Container>
        </>
    )
}