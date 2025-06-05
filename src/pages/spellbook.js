import abjuration from "../data/spells/abjuration.json";
import evocation from "../data/spells/evocation.json";
import {Badge, Form, Table} from "react-bootstrap";
import Select from "react-select";
import {useEffect, useState} from 'react';


const Spell = ({spell, togglePrepared}) => {
    const [isChecked, setChecked] = useState(localStorage.getItem("spellbook-" + spell.name) === "true" || false);

    function handleClick(e) {
        togglePrepared(e.target.value)
        setChecked(e.target.checked);
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
            <td>{spell.full ? spell.full.map((para,idx) => <p key={idx}>{para}</p>) : ""}</td>
        </tr>
    )
}


const SpellbookForm = ({filter, handleChange}) => {

    return (
        <Form.Check
            type="switch"
            id="spellbook-filter"
            onChange={handleChange}
            checked={filter}
            value={filter}
            label="Filter spells"
        />

    )

}

export default function SpellSelect({level, character_class, subclass, prepared, setPrepared}) {
    const [filter, setFilter] = useState(localStorage.getItem("sbFilter") === "true" || false),
        book = [...abjuration, ...evocation];

    const handleChange = () => {
        setFilter(!filter);
    }

    useEffect(() => {
        // storing input name
        localStorage.setItem("sbFilter", JSON.stringify(filter));
    }, [filter]);

    book.sort((spell1, spell2) => {
        if (spell1.level === "Cantrip") {
            return -1;
        }
        else {
            return spell1.level - spell2.level;
        }
    })

    const isUsable = (spell) => {
        if (!filter) {
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
            <SpellbookForm filter={filter} handleChange={handleChange}/>
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