import {SpellSlots} from "./spells";
import {InfoBlock} from "../utils";
import {Modal, Table} from "react-bootstrap";
import {useState} from "react";


const Metamagic = () => {
    return (
        <>Metamagic - NYI</>
    )
}

const SorceryPoints = ({level}) => {
    const points = Array.from({length: level}, (_, i) => (<SorceryPoint idx={i}/>)),
     [show, setShow] = useState(false),
        createSpellCost = [
            {name: "1st", cost: 2},
            {name: "2nd", cost: 3},
            {name: "3rd", cost: 5},
            {name: "4th", cost: 6},
            {name: "5th", cost: 7},
        ],
        spellCosts = createSpellCost.map(spellLevel => {
            return <tr><th>{spellLevel.name}</th><td>{spellLevel.cost}</td></tr>;
        });


    const handleClose = () => setShow(false);
    function handleShow(e) {
        e.preventDefault();
        setShow(true);
    }

    if (level === 1) {
        return <></>
    }
    return (
        <>
            <InfoBlock header="Sorcery Points" body={points} />
            <button className="btn btn-secondary text-white" onClick={handleShow}>
                Main Actions
            </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sorcery Point Applications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>These actions are available regardless of metamagic choice.</p>
                    <h4>Creating Spell Slots</h4>
                    <p>You can transform unexpended sorcery points into one spell slot as a <span className="badge bg-spell-bonus">bonus</span> action on your turn.
                        The created spell slots vanish at the end of a long rest. The Creating Spell Slots table shows
                        the cost of creating a spell slot of a given level. You can create spell slots no higher in
                        level than 5th.</p>
                    <Table className="table striped hover vert">
                        <thead>
                        <tr>
                            <th>Spell Level</th>
                            <td>Point Cost</td>
                        </tr>
                        </thead>
                        <tbody>
                        {spellCosts}
                        </tbody>
                    </Table>
                    <h4>Convert Spell Slot to Sorcery Points</h4>
                    <p>As a bonus action on your turn, you can expend one spell slot and gain a number of sorcery points equal to the slot's level.</p>
                </Modal.Body>
            </Modal>
            <Metamagic level={level} />
        </>
    )
}

const SorceryPoint = ({idx}) => {
    function handleClick(el) {
        el.target.classList.toggle('spent');
    }

    return (
        <div className="spell-slot p-1 m-1 d-inline-block" onClick={handleClick}/>
    )
}

export const Sorcerer = ({level}) => {
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

            <h3>Sorcerer Class</h3>
            <SorceryPoints level={level} />

            <h3>Sorcerous Origin</h3>
            NYI
        </>
    )
}