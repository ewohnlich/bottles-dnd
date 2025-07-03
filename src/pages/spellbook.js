import { Col, Container, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";
import { useState } from "react";
import schools from "../data/schools.json";
import dmgTypes from "../data/dmgTypes.json";
import { classMap } from "../utils";

const Spell = ({ spell, isChecked, togglePrepared }) => {
    function handleClick(e) {
        togglePrepared(e.target.value);
    }

    return (
        <tr>
            <td>
                <Form.Check
                    type="switch"
                    id={spell.name}
                    onChange={handleClick}
                    checked={isChecked}
                    value={spell.name ? spell.name : ""}
                    label={spell.name}
                />
            </td>
            <td>{spell.level === 0 ? "Cantrip" : spell.level}</td>
            <td>{spell.school}</td>
            <td>{spell.classes ? spell.classes.join(", ") : ""}</td>
            <td>
                {spell.full
                    ? spell.full.map((para, idx) => <p key={idx}>{para}</p>)
                    : ""}
            </td>
        </tr>
    );
};

const spellLevelName = (level) => {
    if (level === 0) {
        return "Cantrip";
    } else if (level === 1) {
        return "1st";
    } else if (level === 1) {
        return "2nd";
    } else if (level === 1) {
        return "3rd";
    } else {
        return level + "th";
    }
};

const MoreFilter = ({ filters, handleChange }) => {
    const levels = Array(10)
            .fill(null)
            .map((i, j) => ({ value: j, label: spellLevelName(j) })),
        classes = Object.keys(classMap).map((name) => ({
            value: name,
            label: name,
        })),
        _schools = schools.map((school) => ({ value: school, label: school })),
        _dmgTypes = dmgTypes.map((dmg) => ({ value: dmg, label: dmg }));

    return (
        <>
            <Container>
                <Row>
                    <Col lg={4}>
                        <Select
                            id="spellfilter-level"
                            defaultValue={levels.find(
                                (element) => element.value === filters.level,
                            )}
                            onChange={(e) => handleChange("level", e)}
                            isMulti={true}
                            options={levels}
                        />
                        <Form.Label htmlFor="spellfilter-level">
                            Spell Level
                        </Form.Label>
                    </Col>
                    <Col lg={4}>
                        <Select
                            id="spellfilter-class"
                            defaultValue={classes.find(
                                (element) => element.value === filters.classes,
                            )}
                            onChange={(e) => handleChange("classes", e)}
                            isMulti={true}
                            options={classes}
                        />
                        <Form.Label htmlFor="spellfilter-class">
                            Class
                        </Form.Label>
                    </Col>
                    <Col lg={4}>
                        <Select
                            id="spellfilter-school"
                            defaultValue={_schools.find(
                                (element) => element.value === filters.school,
                            )}
                            onChange={(e) => handleChange("school", e)}
                            isMulti={true}
                            options={_schools}
                        />
                        <Form.Label htmlFor="spellfilter-school">
                            School
                        </Form.Label>
                    </Col>
                    <Col lg={4}>
                        <Select
                            id="spellfilter-dmgType"
                            defaultValue={_dmgTypes.find(
                                (element) => element.value === filters.dmg_type,
                            )}
                            onChange={(e) => handleChange("dmg_type", e)}
                            isMulti={true}
                            options={_dmgTypes}
                        />
                        <Form.Label htmlFor="spellfilter-dmgType">
                            Damage Type
                        </Form.Label>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

const SpellbookForm = ({ filters, handleChange }) => {
    const moreFilter = !filters.available ? (
        <MoreFilter filters={filters} handleChange={handleChange} />
    ) : (
        ""
    );

    return (
        <>
            <Form.Check
                type="switch"
                id="sbFilter-available"
                onChange={(e) => handleChange("available", e)}
                checked={filters.available}
                value={filters.available}
                label="Automatic (NYI)"
            />
            {moreFilter}
        </>
    );
};

const defaultSbForm = {
    available: false,
    level: [],
    classes: [],
    school: [],
    dmg_type: [],
};

export default function SpellSelect({
    character,
    prepared,
    setPrepared,
    book,
}) {
    const [filters, setFilters] = useState(defaultSbForm);

    const handleChange = (prop, e) => {
        const newFilters = { ...filters };
        if (prop === "available") {
            newFilters[prop] = e.target.checked;
        } else {
            newFilters[prop] = e.map((i) => i.value);
        }

        setFilters(newFilters);
    };

    book.sort((spell1, spell2) => {
        if (spell1.level === "Cantrip") {
            return -1;
        } else {
            return spell1.level - spell2.level;
        }
    });

    const isUsable = (spell) => {
        if (!filters.available) {
            let singleFields = ["level", "dmg_type", "school"],
                multiFields = ["classes"];
            let isValid = singleFields.every((field) => {
                return (
                    filters[field].length === 0 ||
                    filters[field].includes(spell[field])
                );
            });
            isValid =
                multiFields.every((field) => {
                    return (
                        filters[field].length === 0 ||
                        filters[field].filter((i) => spell[field].includes(i))
                            .length > 0
                    );
                }) && isValid;
            return isValid;
        }
        return (
            spell.classes.includes(character.character_class) ||
            spell.subclass.includes(
                character.subclass + " " + character.character_class,
            )
        );
    };

    function togglePrepared(spellName) {
        const newPrepared = prepared.slice();
        if (newPrepared.includes(spellName)) {
            const idx = newPrepared.indexOf(spellName);
            newPrepared.splice(idx, 1);
        } else {
            newPrepared.push(spellName);
        }
        setPrepared(newPrepared);
    }

    return (
        <>
            <SpellbookForm filters={filters} handleChange={handleChange} />
            <Table>
                <thead>
                    <tr>
                        <th>Prepared</th>
                        <th>Level</th>
                        <th>School</th>
                        <th>Class</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {book.filter(isUsable).map((spell) => (
                        <Spell
                            spell={spell}
                            isChecked={prepared.includes(spell.name)}
                            key={spell.name}
                            togglePrepared={togglePrepared}
                        />
                    ))}
                </tbody>
            </Table>
        </>
    );
}
