import abjuration from "../data/spells/abjuration.json";
import evocation from "../data/spells/evocation.json";
import {Badge, Form, InputGroup, Table} from "react-bootstrap";
import Select from "react-select";
import {useEffect, useState} from 'react';
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
            <td>{spell.level}</td>
            <td>{spell.name}</td>
            <td>{spell.classes ? spell.classes.join(", ") : ""}</td>
            <td>{spell.full ? spell.full.map((para, idx) => <p key={idx}>{para}</p>) : ""}</td>
        </tr>
    )
}

const MoreFilter = ({filters, handleChange}) => {
    const levels = Array(20).fill(null).map((i, j) => ({value: j + 1, label: j + 1})),
        classes = classNames.map((name) => (
            {value: name, label: name}
        ));
    console.log(filters)
    console.log(filters.class);
    console.log(classes.find((element) => element.value === filters.class));

    return <>
        <InputGroup className="mb-3">
            <Select id="spellfilter-level" defaultValue={levels.find((element) => element.value === filters.level)}
                    onChange={(e) => handleChange("level", e)}
                    options={levels}/>
            <Form.Label htmlFor="subclass">Level</Form.Label>
        </InputGroup>
        <InputGroup className="mb-3">
            <Select id="spellfilter-class" defaultValue={classes.find((element) => element.value === filters.class)}
                    onChange={(e) => handleChange("class", e)}
                    options={classes}/>
            <Form.Label htmlFor="subclass">Class</Form.Label>
        </InputGroup>
    </>
}


const SpellbookForm = ({filters, handleChange}) => {
    const moreFilter = !filters.available && <MoreFilter filters={filters} handleChange={handleChange}/> || "";

    return (
        <>
            <Form.Check
                type="switch"
                id="sbFilter-available"
                onChange={(e) => handleChange("available", e)}
                checked={filters.available}
                value={filters.available}
                label="Available to Character"
            />
            {moreFilter}
        </>
    )

}

const defaultSbForm = {
    available: false,
    level: 1,
    class: "",
    subclass: ""
}


export default function SpellSelect({level, character_class, subclass, prepared, setPrepared}) {
    const [filters, setFilters] = useState(localStorage.getItem("sbFilter") ? JSON.parse(localStorage.getItem("sbFilter")) : defaultSbForm),// useState(localStorage.getItem("sbFilter") === "true" || false),
        book = [...abjuration, ...evocation];

    const handleChange = (prop, e) => {

        const newFilters = {...filters}
        if (prop === "available") {
            newFilters[prop] = e.target.checked;
        } else {
            newFilters[prop] = e.value;
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
            return spell;
        }
        return (
            (spell.classes.includes(character_class) || spell.subclass.includes(subclass + " " + character_class))
            &&
            (spell.level <= level || spell.level === "Cantrip")
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