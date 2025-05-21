import {useState} from "react";
import {Row, Col} from "react-bootstrap";


const SpellSlot = ({level, slot}) => {

    function handleClick(el) {
        console.log(el.target);
        el.target.classList.toggle('spent');
    }

    return (
        <div className="spell-slot p-1 m-1 d-inline-block" onClick={handleClick}/>
    )
}

const SpellLevelSlots = ({level, count}) => {
    let blocks = [];
    for (let i = 0; i < count; i++) {
        blocks.push(<SpellSlot level={level} slot={i}/>)
    }
    return (
        <div className="spell-slot-level me-2">
            <div className="level-header p-1">Level {level}</div>
            <div className="level-slots">{blocks}</div>
        </div>
    )

}
const SpellSlots = ({slots}) => {
    let levels = [];
    if (slots) {
        slots.forEach((count, level) => {
            levels.push(<SpellLevelSlots level={level + 1} count={count}/>)
        })
        return (
            <>
                <h3>Spell Slots</h3>
                {levels}
            </>
        )
    }
}

const Sorcerer = ({level, character_class}) => {
    const slots = [
        [2],
        [3],
        [4, 2],
        [4, 3],
        [4, 3, 2],
        [4, 3, 3],
        [4, 3, 3, 1],
        [4, 3, 3, 2],
        [4, 3, 3, 3, 1],
        [4, 3, 3, 3, 2],
        [4, 3, 3, 3, 2, 1],
        [4, 3, 3, 3, 2, 1],
        [4, 3, 3, 3, 2, 1, 1],
        [4, 3, 3, 3, 2, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1, 1],
        [4, 3, 3, 3, 3, 1, 1, 1, 1],
        [4, 3, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 3, 2, 2, 1, 1],
    ];

    return (
        <>
            <SpellSlots slots={slots[level - 1]}/>

            <p>Sorcery Points = TBA</p>
        </>
    )
}

export default function ClassSpells({level, character_class}) {

    if (character_class === 'Sorcerer') {
        return <Sorcerer level={level} character_class={character_class}/>
    }
}