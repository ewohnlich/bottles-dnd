import {Badge, Container, Col, Form, InputGroup, Row, Table, Button} from 'react-bootstrap';
import schools from '../schools';
import dmgTypes from '../dmgTypes.json';
import classNames from '../classNames.json';
import {useState} from "react";
import Select from 'react-select';

export default function AddSpell() {
    const [name, setName] = useState(""),
        [school, setSchool] = useState(""),
        [level, setLevel] = useState(0),
        [range, setRange] = useState(""),
        [aoe, setAoe] = useState(""),
        [duration, setDuration] = useState(""),
        [concentration, setConcentration] = useState(false),
        [ritual, setRitual] = useState(false),
        [components, setComponents] = useState([]),
        [cast_time, setCastTime] = useState(""),
        [short, setShort] = useState(""),
        [dmg_type, setDmgType] = useState(""),
        [spell_type, setSpellType] = useState(""),
        [plus_slot, setPlusSlot] = useState(""),
        [cantrip_upgrade, setCantripUpgrade] = useState([{level: 5, dmg: ""},{level: 11, dmg: ""},{level: 17, dmg: ""}]),
        [full, setFull] = useState([""]),
        [classes, setClasses] = useState([]),
        [subclass, setSubclass] = useState([]);

    const schoolOpts = schools.map((name) => (
            {value: name, label: name}
        )),
        levelOpts = Array(10).fill(null).map((i, j) => ({value: j, label: j > 0 ? j : "Cantrip"})),
        componentOpts = ["M", "S", "V"].map((name) => (
            {value: name, label: name}
        )),
        dmgtypeOpts = dmgTypes.map((name) => (
            {value: name, label: name}
        ));
    let classOpts = [],
        subClassOpts = [];
    Object.keys(classNames).forEach((cls) => {
        classOpts.push({value: cls, label: cls});
        classNames[cls].forEach((sub) => {
            subClassOpts.push({value: `${sub} ${cls}`, label: `${sub} ${cls}`});
        })
    })

    const spellData = {
        name: name,
        school: school,
        level: level,
        range: range,
        aoe: aoe,
        duration: duration,
        concentration: concentration,
        ritual: ritual,
        components: components,
        cast_time: cast_time,
        short: short,
        dmg_type: dmg_type,
        spell_type: spell_type,
        plus_slot: plus_slot,
        cantrip_upgrade: cantrip_upgrade,
        full: full,
        classes: classes,
        subclass: subclass,
    };

    function copyData() {
        return (
            <>
                <code>
                    <pre>{JSON.stringify(spellData, null, 2)}</pre>
                </code>
                <Button variant="primary" onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(spellData, null, 2))
                }}>Copy</Button>
            </>
        )
    }

    return (
        <Container>
            <h1>Add Spell</h1>
            <Form id="form">
                <InputGroup className="mb-3">
                    <InputGroup.Text id="name">Name</InputGroup.Text>
                    <Form.Control
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Spell Name"
                        aria-describedby="name"/>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="school">School</InputGroup.Text>
                    <Select options={schoolOpts}
                            styles={{
                                control: (provided) => ({
                                    ...provided, minWidth: "400px"
                                })
                            }}
                            onChange={(e) => setSchool(e.value)}
                            name="school"
                            id="school"/>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="level">Level</InputGroup.Text>
                    <Select options={levelOpts}
                            styles={{
                                control: (provided) => ({
                                    ...provided, minWidth: "100px"
                                })
                            }}
                            onChange={(e) => setLevel(e.value)}
                            name="level"
                            id="level"/>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="range">Range</InputGroup.Text>
                    <Form.Control type="text" name="range" aria-labelledby="range"
                                  onChange={(e) => setRange(e.target.value)}></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="aoe">AoE</InputGroup.Text>
                    <Form.Control type="text" name="aoe" aria-labelledby="aoe"
                                  onChange={(e) => setAoe(e.target.value)}></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="duration">Duration</InputGroup.Text>
                    <Form.Control type="text" name="duration" aria-labelledby="duration"
                                  onChange={(e) => setDuration(e.target.value)}></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox name="concentration" aria-labelledby="concentration"
                                         onChange={(e) => setConcentration(e.target.checked)}/>
                    <InputGroup.Text id="concentration">Concentration</InputGroup.Text>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox name="ritual" aria-labelledby="ritual"
                                         onChange={(e) => setRitual(e.target.checked)}/>
                    <InputGroup.Text id="ritual">Ritual</InputGroup.Text>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="componentsLabel">Components</InputGroup.Text>
                    <Select options={componentOpts}
                            isMulti={true}
                            id="components"
                            onChange={(e) => setComponents((e).map((e) => e.value))}
                            aria-labelledby="componentsLabel"
                            styles={{
                                control: (provided) => ({
                                    ...provided, minWidth: "300px"
                                })
                            }}
                            name="components"/>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="cast_time">Cast Time</InputGroup.Text>
                    <Form.Control type="text" name="cast_time" aria-labelledby="cast_time"
                                  onChange={(e) => setCastTime(e.target.value)}></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="short">Short Description</InputGroup.Text>
                    <Form.Control type="text" name="short" aria-labelledby="short"
                                  placeholder="1d8"
                                  onChange={(e) => setShort(e.target.value)}></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="dmgtypeLabel">Damage Type</InputGroup.Text>
                    <Select options={dmgtypeOpts}
                            id="dmg_type"
                            onChange={(e) => setDmgType(e.value)}
                            aria-labelledby="dmgtypeLabel"
                            styles={{
                                control: (provided) => ({
                                    ...provided, minWidth: "300px"
                                })
                            }}
                            name="dmg_type"/>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="spell_type">Spell Type</InputGroup.Text>
                    <Form.Control type="text" name="spell_type" aria-labelledby="spell_type"
                                  placeholder="WIS save"
                                  onChange={(e) => setSpellType(e.target.value)}></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="plus_slot">At Higher Levels...</InputGroup.Text>
                    <Form.Control type="text" name="plus_slot" aria-labelledby="plus_slot"
                                  onChange={(e) => setPlusSlot(e.target.value)}></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <Form.Label id="full">Cantrip Upgrade</Form.Label>
                    <Cantrip cantrip_upgrade={cantrip_upgrade} setCantripUpgrade={setCantripUpgrade}/>
                </InputGroup>
                <Form.Group className="mb-3">
                    <Form.Label id="full">Full Description</Form.Label>
                    <Description full={full} setFull={setFull}/>
                </Form.Group>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="classesLabel">Classes</InputGroup.Text>
                    <Select options={classOpts}
                            id="classes"
                            isMulti={true}
                            onChange={(e) => setClasses((e).map((e) => e.value))}
                            aria-labelledby="classesLabel"
                            styles={{
                                control: (provided) => ({
                                    ...provided, minWidth: "300px"
                                })
                            }}
                            name="classes"/>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="subclassLabel">Subclasses</InputGroup.Text>
                    <Select options={subClassOpts}
                            id="subclass"
                            isMulti={true}
                            onChange={(e) => setSubclass((e).map((e) => e.value))}
                            aria-labelledby="subclassLabel"
                            styles={{
                                control: (provided) => ({
                                    ...provided, minWidth: "300px"
                                })
                            }}
                            name="subclass"/>
                </InputGroup>

            </Form>
            {copyData()}
        </Container>
    )
}

function Cantrip({cantrip_upgrade, setCantripUpgrade}) {

    const handleChange = (index, type, e) => {
        const newFields = [...cantrip_upgrade];
        console.log(index);
        newFields[index][type] = e.target.value;
        setCantripUpgrade(newFields);
    };

    return (
        <Container>
            {Array(cantrip_upgrade.length).fill(null).map((el, i) => (
                    <Row>
                        <Col xs={1}>
                            <Form.Group className="mb-3" controlId={`cantrip_${i}_level`}>
                                <Form.Label>Level</Form.Label>
                                <Form.Control type="text" onChange={(e) => handleChange(i, "level", e)} value={cantrip_upgrade[i].level}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="cantrip_0_dmg">
                                <Form.Label>Damage</Form.Label>
                                <Form.Control type="text" onChange={(e) => handleChange(i, "dmg", e)} value={cantrip_upgrade[i].dmg}/>
                            </Form.Group>
                        </Col>
                    </Row>
                )
            )}
        </Container>
    )
}

function Description({full, setFull}) {

    const handleAddField = () => {
        setFull([...full, null]);
    };

    const handleRemoveField = (index) => {
        const newFields = [...full];
        newFields.splice(index, 1);
        setFull(newFields);
    };

    const handleChange = (index, e) => {
        const newFields = [...full];
        newFields[index] = e.target.value;
        setFull(newFields);
    };

    return (
        <Container>

            {full.map((field, index) => (
                <Row key={index} className="mb-3">
                    <Col>
                        <Form.Control as="textarea"
                                      value={field}
                                      onChange={(e) => handleChange(index, e)}
                        />
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={() => handleRemoveField(index)}>
                            Remove
                        </Button>
                    </Col>
                </Row>
            ))}
            <Row>
                <Col>
                    <Button variant="success" onClick={handleAddField}>Add</Button>
                </Col>
            </Row>

        </Container>
    )
}