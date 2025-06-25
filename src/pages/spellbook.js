import abjuration from "../data/spells/abjuration.json";
import evocation from "../data/spells/evocation.json";
import {Badge, Form, Col, Row, Container, Table} from "react-bootstrap";
import Select from "react-select";
import {useEffect, useState} from 'react';
import schools from "../data/schools.json";
import dmgTypes from "../data/dmgTypes.json";
import classNames from "../data/classNames.json";


const Spell = ({spell, isChecked, togglePrepared}) => {

    function handleClick(e) {
        togglePrepared(e.target.value)
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
            <td>{spell.name}</td>
            <td>{spell.classes ? spell.classes.join(", ") : ""}</td>
            <td>{spell.full ? spell.full.map((para, idx) => <p key={idx}>{para}</p>) : ""}</td>
        </tr>
    )
}

const spellLevelName = (level) => {
    if (level === 0) {
        return "Cantrip";
    } else if (level === 1) {
        return "1st"
    } else if (level === 1) {
        return "2nd"
    } else if (level === 1) {
        return "3rd"
    } else {
        return level + "th"
    }
}

const MoreFilter = ({filters, handleChange}) => {
    const levels = Array(10).fill(null).map((i, j) => ({value: j, label: spellLevelName(j)})),
        classes = Object.keys(classNames).map((name) => (
            {value: name, label: name}
        )),
        _schools = schools.map((school) => ({value: school, label: school})),
        _dmgTypes = dmgTypes.map((dmg) => ({value: dmg, label: dmg}))

    return <>
        <Container>
            <Row>
                <Col lg={4}>
                    <Select id="spellfilter-level"
                            defaultValue={levels.find((element) => element.value === filters.level)}
                            onChange={(e) => handleChange("level", e)} isMulti={true}
                            options={levels}/>
                    <Form.Label htmlFor="spellfilter-level">Spell Level</Form.Label>
                </Col>
                <Col lg={4}>
                    <Select id="spellfilter-class"
                            defaultValue={classes.find((element) => element.value === filters.classes)}
                            onChange={(e) => handleChange("classes", e)} isMulti={true}
                            options={classes}/>
                    <Form.Label htmlFor="spellfilter-class">Class</Form.Label>
                </Col>
                <Col lg={4}>
                    <Select id="spellfilter-school"
                            defaultValue={_schools.find((element) => element.value === filters.school)}
                            onChange={(e) => handleChange("school", e)} isMulti={true}
                            options={_schools}/>
                    <Form.Label htmlFor="spellfilter-school">School</Form.Label>
                </Col>
                <Col lg={4}>
                    <Select id="spellfilter-dmgType"
                            defaultValue={_dmgTypes.find((element) => element.value === filters.dmg_type)}
                            onChange={(e) => handleChange("dmg_type", e)} isMulti={true}
                            options={_dmgTypes}/>
                    <Form.Label htmlFor="spellfilter-dmgType">Damage Type</Form.Label>
                </Col>
            </Row>
        </Container>
    </>
}


const SpellbookForm = ({filters, handleChange}) => {
    const moreFilter = !filters.available ? <MoreFilter filters={filters} handleChange={handleChange}/> : "";

    return (
        <>
            <Form.Check
                type="switch"
                id="sbFilter-available"
                onChange={(e) => handleChange("available", e)}
                checked={filters.available}
                value={filters.available}
                label="Automatic"
            />
            {moreFilter}
        </>
    )

}

const defaultSbForm = {
    available: false,
    level: [],
    classes: [],
    school: [],
    dmg_type: [],
}


export default function SpellSelect({level, character_class, subclass, prepared, setPrepared}) {
    const [filters, setFilters] = useState(localStorage.getItem("sbFilter") ? JSON.parse(localStorage.getItem("sbFilter")) : defaultSbForm),// useState(localStorage.getItem("sbFilter") === "true" || false),
        book = [...abjuration, ...evocation];

    const handleChange = (prop, e) => {

        const newFilters = {...filters}
        if (prop === "available") {
            newFilters[prop] = e.target.checked;
        } else {
            newFilters[prop] = e.map((i) => i.value);
        }

        setFilters(newFilters);
    }

    useEffect(() => {
        localStorage.setItem("sbFilter", JSON.stringify(filters));
    }, [filters]);

    book.sort((spell1, spell2) => {
        if (spell1.level === "Cantrip") {
            return -1;
        } else {
            return spell1.level - spell2.level;
        }
    })

    const isUsable = (spell) => {
        if (!filters.available) {
            let isInvalid = ["level", "classes", "school"].filter((name) => {
                return filters[name].length !== 0 && !filters[name].filter(i => spell[name].includes(i)).length
            })
            if (!isInvalid.length) {
                isInvalid = ["dmg_type"].filter((name) => filters[name].length !== 0 && !filters[name].includes(spell.dmg_type))
            }
            if (isInvalid.length) {
                return;
            }
            return spell;
        }
        return (
            (spell.classes.includes(character_class) || spell.subclass.includes(subclass + " " + character_class))
        )
    }

    function togglePrepared(spellName) {
        const newPrepared = prepared.slice();
        if (newPrepared.includes(spellName)) {
            const idx = newPrepared.indexOf(spellName);
            newPrepared.splice(idx, 1);
        } else {
            newPrepared.push(spellName)
        }
        setPrepared(newPrepared);
    }

    return (
        <>
            <SpellbookForm filters={filters} handleChange={handleChange}/>
            <Table>
                <thead>
                <tr>
                    <th>Prepared</th>
                    <th>Level</th>
                    <th>Spell</th>
                    <th>Class</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {book.filter(isUsable).map(spell => <Spell spell={spell} isChecked={prepared.includes(spell.name)}
                                                           key={spell.name} togglePrepared={togglePrepared}/>)}
                </tbody>
            </Table>
        </>
        // JSON.stringify(book.filter(isUsable))
    )


}