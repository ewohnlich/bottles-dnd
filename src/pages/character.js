import Container from 'react-bootstrap/Container';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {useState, useEffect} from "react";


function InputWithLabel({id, name, placeholder, classNames}) {
    const [state, setState] = useState(JSON.parse(localStorage.getItem(name) || 0));

    function handleChange(e) {
        setState(e.target.value);
    }

    useEffect(() => {
        // storing input name
        localStorage.setItem(name, JSON.stringify(state));
    }, [state]);

    return (
        <>
            <input type="text" className={"form-control " + classNames} id={id}
                   onChange={handleChange}
                   value={state}
                   placeholder={placeholder}/>
            <label htmlFor={id} className="form-label">{name}</label>
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
    function handleChange(e) {
        setter(e.target.value);
    }

    useEffect(() => {
        // storing input name
        console.log(value);
        localStorage.setItem("state-" + id, JSON.stringify(value));
    }, [value]);

    return (

        <Row>
            <Col>
                <label htmlFor="str" className="form-label">{title}</label>
                <input type="text" className="form-control str-points" id={id + "-points"}
                       onChange={handleChange}
                       value={value}/>
            </Col>
        </Row>
    )
}

export default function Character() {
    const [strength, setStrength] = useState(JSON.parse(localStorage.getItem("state-strength") || 0));
    const [dexterity, setDexterity] = useState(JSON.parse(localStorage.getItem("state-dexterity") || 0));
    const [constitution, setConstitution] = useState(JSON.parse(localStorage.getItem("state-constitution") || 0));
    const [intelligence, setIntelligence] = useState(JSON.parse(localStorage.getItem("state-intelligence") || 0));
    const [wisdom, setWisdom] = useState(JSON.parse(localStorage.getItem("state-wisdom") || 0));
    const [charisma, setCharisma] = useState(JSON.parse(localStorage.getItem("state-charisma") || 0));


    return (
        <>
            <h1>Dungeons & Dragons</h1>
            <Form>
                <Container>
                    <Row>
                        <Col>
                            <InputWithLabel id="char_name" name="Character Name" classNames="character-name"
                                            placeholder="Sothar"/>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <InputWithLabel id="class_level" name="Class and Level" placeholder="Sorcerer"/>
                                </Col>
                                <Col>
                                    <InputWithLabel id="background" name="Background"/>
                                </Col>
                                <Col>
                                    <InputWithLabel id="player_name" name="Player Name" placeholder="Eric"/>
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
                    <Row>
                        <Col>
                            Total points: <Points strength={strength} dexterity={dexterity} constitution={constitution}
                                                  intelligence={intelligence} wisdom={wisdom} charisma={charisma}/>
                        </Col>
                    </Row>
                    <Stat id="strength" title="Strength" value={strength} setter={setStrength}/>
                    <Stat id="dexterity" title="Dexterity" value={dexterity} setter={setDexterity}/>
                    <Stat id="constitution" title="Constitution" value={constitution} setter={setConstitution}/>
                    <Stat id="intelligence" title="Intelligence" value={intelligence} setter={setIntelligence}/>
                    <Stat id="wisdom" title="Wisdom" value={wisdom} setter={setWisdom}/>
                    <Stat id="charisma" title="Charisma" value={charisma} setter={setCharisma}/>
                </Container>
            </Form>
        </>
    )
}