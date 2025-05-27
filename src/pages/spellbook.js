import abjuration from "../data/spells/abjuration.json";
import evocation from "../data/spells/evocation.json";
import {Badge, Form, Table} from "react-bootstrap";
import {useState} from "react";


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
                    value={spell.name}
                    label={spell.name}
                />
            </td>
            <td>{spell.level}</td>
            <td>{spell.name}</td>
            <td>{spell.classes ? spell.classes.join(", ") : ""}</td>
            <td>{spell.full ? spell.full.map(para => <p>{para}</p>) : ""}</td>
        </tr>
    )
}

export default function SpellSelect({level, character_class, prepared, setPrepared}) {
    const [usable, setUsable] = useState(true),
        book = [...abjuration, ...evocation];
    book.sort((spell1, spell2) => {
        return spell1.level < spell2.level;
    })

    const isUsable = (spell) => {
        return spell.classes.includes(character_class) || !usable;
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
        <Table variant="hoverable">
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
                                                       togglePrepared={togglePrepared}/>)}
            </tbody>
        </Table>
        // JSON.stringify(book.filter(isUsable))
    )


}