import {
    Button,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
    Tooltip,
} from "react-bootstrap";
import schools from "../schools";
import dmgTypes from "../dmgTypes.json";
import {useState} from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import abjuration from "./abjuration.json";
import evocation from "./evocation.json";
import {classMap} from "../../utils";

const defaultSpellForm = {
    name: "",
    school: "",
    level: 0,
    range: "",
    aoe: "",
    duration: 0,
    concentration: false,
    ritual: false,
    components: [],
    cast_time: "",
    short: "",
    dmg_type: "",
    spell_type: "",
    plus_slot: "",
    cantrip_upgrade: [
        {level: 5, dmg: ""},
        {level: 11, dmg: ""},
        {level: 17, dmg: ""},
    ],
    full: [],
    classes: [],
    subclass: [],
};

const allSpells = [...abjuration, ...evocation];

export default function AddSpell() {
    const [spell, setSpell] = useState({...defaultSpellForm});

    const schoolOpts = schools.map((name) => ({value: name, label: name})),
        selectedOps = allSpells.map((spell) => ({
            value: spell.name,
            label: spell.name,
        })),
        levelOpts = Array(10)
            .fill(null)
            .map((i, j) => ({value: j, label: j > 0 ? j : "Cantrip"})),
        componentOpts = ["M", "S", "V"].map((name) => ({
            value: name,
            label: name,
        })),
        dmgtypeOpts = dmgTypes.map((name) => ({value: name, label: name})),
        castTimeOpts = ["Action", "Bonus", "Reaction", "Free"].map((name) => ({
            value: name,
            label: name,
        }));
    let classOpts = [],
        subClassOpts = [];
    Object.keys(classMap).forEach((cls) => {
        classOpts.push({value: cls, label: cls});
        classMap[cls].subclasses.forEach((sub) => {
            subClassOpts.push({
                value: `${sub} ${cls}`,
                label: `${sub} ${cls}`,
            });
        });
    });

    function clearForm(e) {
        setSpell({
            ...defaultSpellForm,
            // something is deep copying...
            cantrip_upgrade: [
                {level: 5, dmg: ""},
                {level: 11, dmg: ""},
                {level: 17, dmg: ""},
            ],
        });
    }

    function copySpell(e) {
        navigator.clipboard.writeText(JSON.stringify(spell, null, 2));
        e.target.classList.add("active");
        e.target.innerText = "Copied!";
        setTimeout(function () {
            e.target.classList.remove("active");
            e.target.innerText = "Copy";
        }, 2000);
    }

    function copyData() {
        return (
            <>
                <code>
                    <pre>{JSON.stringify(spell, null, 2)}</pre>
                </code>

                <Button
                    variant="success"
                    className="me-2"
                    onClick={copySpell}
                    id="copySpell"
                >
                    Copy
                </Button>
                <Button variany="danger" className="me-2" onClick={clearForm}>
                    Clear
                </Button>
            </>
        );
    }

    function handleSelect(selectedSpell) {
        if (selectedSpell) {
            const fromBook = allSpells.find(
                (spell) => spell.name === selectedSpell.value,
            );
            if (fromBook) {
                setSpell(fromBook);
            } else {
                setSpell({...defaultSpellForm, name: selectedSpell.value});
            }
        } else {
            clearForm();
        }
    }

    return (
        <Container className="mb-5">
            <h1>Add Spell</h1>
            <Form id="form">
                <InputGroup className="mb-3">
                    <InputGroup.Text id="school">Name</InputGroup.Text>
                    <CreatableSelect
                        options={selectedOps}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "400px",
                            }),
                        }}
                        isClearable={true}
                        value={{value: spell.name, label: spell.name}}
                        onChange={handleSelect}
                        name="name"
                        id="name"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="school">School</InputGroup.Text>
                    <Select
                        options={schoolOpts}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "400px",
                            }),
                        }}
                        value={{value: spell.school, label: spell.school}}
                        onChange={(e) =>
                            setSpell({...spell, school: e.value})
                        }
                        name="school"
                        id="school"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="level">Level</InputGroup.Text>
                    <Select
                        options={levelOpts}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "100px",
                            }),
                        }}
                        value={{
                            value: spell.level,
                            label: spell.level === 0 ? "Cantrip" : spell.level,
                        }}
                        onChange={(e) => setSpell({...spell, level: e.value})}
                        name="level"
                        id="level"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="range">Range</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="range"
                        aria-labelledby="range"
                        value={spell.range}
                        onChange={(e) =>
                            setSpell({...spell, range: e.target.value})
                        }
                    ></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="aoe">AoE</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="aoe"
                        aria-labelledby="aoe"
                        value={spell.aoe}
                        onChange={(e) =>
                            setSpell({...spell, aoe: e.target.value})
                        }
                    ></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="duration">Duration</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="duration"
                        aria-labelledby="duration"
                        value={spell.duration}
                        onChange={(e) =>
                            setSpell({...spell, duration: e.target.value})
                        }
                    ></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox
                        name="concentration"
                        aria-labelledby="concentration"
                        checked={spell.concentration}
                        onChange={(e) =>
                            setSpell({
                                ...spell,
                                concentration: e.target.checked,
                            })
                        }
                    />
                    <InputGroup.Text id="concentration">
                        Concentration
                    </InputGroup.Text>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox
                        name="ritual"
                        aria-labelledby="ritual"
                        checked={spell.ritual}
                        onChange={(e) =>
                            setSpell({...spell, ritual: e.target.checked})
                        }
                    />
                    <InputGroup.Text id="ritual">Ritual</InputGroup.Text>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="componentsLabel">
                        Components
                    </InputGroup.Text>
                    <Select
                        options={componentOpts}
                        isMulti={true}
                        id="components"
                        onChange={(e) =>
                            setSpell({
                                ...spell,
                                components: e.map((e) => e.value),
                            })
                        }
                        aria-labelledby="componentsLabel"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "300px",
                            }),
                        }}
                        value={spell.components.map((i) => ({
                            value: i,
                            label: i,
                        }))}
                        name="components"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="castTimeLabel">
                        Cast Time
                    </InputGroup.Text>
                    <Select
                        options={castTimeOpts}
                        id="cast_time"
                        onChange={(e) =>
                            setSpell({...spell, cast_time: e.value})
                        }
                        aria-labelledby="castTimeLabel"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "300px",
                            }),
                        }}
                        value={{
                            value: spell.cast_time,
                            label: spell.cast_time,
                        }}
                        name="dmg_type"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="short">
                        Short Description
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="short"
                        aria-labelledby="short"
                        placeholder="1d8"
                        value={spell.short}
                        onChange={(e) =>
                            setSpell({...spell, short: e.target.value})
                        }
                    ></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="dmgtypeLabel">
                        Damage Type
                    </InputGroup.Text>
                    <Select
                        options={dmgtypeOpts}
                        id="dmg_type"
                        onChange={(e) =>
                            setSpell({...spell, dmg_type: e.value})
                        }
                        aria-labelledby="dmgtypeLabel"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "300px",
                            }),
                        }}
                        value={{value: spell.dmg_type, label: spell.dmg_type}}
                        name="dmg_type"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="spell_type">
                        Spell Type
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="spell_type"
                        aria-labelledby="spell_type"
                        placeholder="WIS save"
                        value={spell.spell_type}
                        onChange={(e) =>
                            setSpell({...spell, spell_type: e.target.value})
                        }
                    ></Form.Control>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="plus_slot">
                        At Higher Levels...
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="plus_slot"
                        aria-labelledby="plus_slot"
                        value={spell.plus_slot}
                        onChange={(e) =>
                            setSpell({...spell, plus_slot: e.target.value})
                        }
                    ></Form.Control>
                </InputGroup>
                {spell.level === 0 ? (
                    <InputGroup className="mb-3">
                        <Form.Label id="full">Cantrip Upgrade</Form.Label>
                        <Cantrip spell={spell} setSpell={setSpell}/>
                    </InputGroup>
                ) : (
                    ""
                )}
                <Form.Group className="mb-3">
                    <Form.Label id="full">Full Description</Form.Label>
                    <Description spell={spell} setSpell={setSpell}/>
                </Form.Group>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="classesLabel">Classes</InputGroup.Text>
                    <Select
                        options={classOpts}
                        id="classes"
                        isMulti={true}
                        onChange={(e) =>
                            setSpell({
                                ...spell,
                                classes: e.map((e) => e.value),
                            })
                        }
                        aria-labelledby="classesLabel"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "300px",
                            }),
                        }}
                        value={spell.classes.map((i) => ({
                            value: i,
                            label: i,
                        }))}
                        name="classes"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="subclassLabel">
                        Subclasses
                    </InputGroup.Text>
                    <Select
                        options={subClassOpts}
                        id="subclass"
                        isMulti={true}
                        onChange={(e) =>
                            setSpell({
                                ...spell,
                                subclass: e.map((e) => e.value),
                            })
                        }
                        value={spell.subclass.map((i) => ({
                            value: i,
                            label: i,
                        }))}
                        aria-labelledby="subclassLabel"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: "300px",
                            }),
                        }}
                        name="subclass"
                    />
                </InputGroup>
            </Form>
            {copyData()}
        </Container>
    );
}

function Cantrip({spell, setSpell}) {
    const handleChange = (index, type, e) => {
        const newFields = [...spell.cantrip_upgrade];
        newFields[index][type] = e.target.value;
        setSpell({...spell, cantrip_upgrade: newFields});
    };

    return (
        <Container>
            {Array(spell.cantrip_upgrade.length)
                .fill("")
                .map((el, i) => (
                    <Row key={i}>
                        <Col xs={1}>
                            <Form.Group
                                className="mb-3"
                                controlId={`cantrip_${i}_level`}
                            >
                                <Form.Label>Level</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={(e) =>
                                        handleChange(i, "level", e)
                                    }
                                    value={spell.cantrip_upgrade[i].level}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group
                                className="mb-3"
                                controlId="cantrip_0_dmg"
                            >
                                <Form.Label>Damage</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={(e) => handleChange(i, "dmg", e)}
                                    value={spell.cantrip_upgrade[i].dmg}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                ))}
        </Container>
    );
}

function Description({spell, setSpell}) {
    const handleAddField = () => {
        setSpell({...spell, full: [...spell.full, ""]});
    };

    const handleRemoveField = (index) => {
        const newFields = [...spell.full];
        newFields.splice(index, 1);
        setSpell({...spell, full: newFields});
    };

    const handleChange = (index, e) => {
        const newFields = [...spell.full];
        newFields[index] = e.target.value;
        setSpell({...spell, full: newFields});
    };

    return (
        <Container>
            {spell.full.map((field, index) => (
                <Row key={index} className="mb-3">
                    <Col>
                        <Form.Control
                            as="textarea"
                            value={field}
                            onChange={(e) => handleChange(index, e)}
                        />
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            onClick={() => handleRemoveField(index)}
                        >
                            Remove
                        </Button>
                    </Col>
                </Row>
            ))}
            <Row>
                <Col>
                    <Button variant="success" onClick={handleAddField}>
                        Add
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
