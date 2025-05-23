import {Card, Container, Col, Row, Table, Modal, Button, Badge} from 'react-bootstrap';
import {PiSwordDuotone} from "react-icons/pi";
import evocation from "../data/spells/evocation.json";
import "bootstrap-icons/font/bootstrap-icons.css";
import {useState} from 'react';
import ClassSpells from "./class_spells"
import {InfoBlock} from "../utils";


export const SpellSlot = ({level, slot}) => {

    function handleClick(el) {
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
        <InfoBlock header={"Level " + level} body={blocks}/>
    )

}
export const SpellSlots = ({slots}) => {
    let levels = [];
    if (slots) {
        slots.forEach((count, level) => {
            levels.push(<SpellLevelSlots key={level+"-"+count} level={level + 1} count={count}/>)
        })
        return (
            <>
                <h3>Spell Slots</h3>
                {levels}
            </>
        )
    }
}

const Duration = ({spell}) => {
    if (spell.concentration) {
        return (
            <tr>
                <th>Duration</th>
                <td>
                    {spell.duration}
                    <Badge bg="warning" className="ms-2">
                        Concentration
                    </Badge>
                </td>
            </tr>
        )
    } else if (spell.duration) {
        return (
            <tr>
                <th>Duration</th>
                <td>
                    {spell.duration}
                </td>
            </tr>
        )
    }
}
const Range = ({spell}) => {
    if (spell.range) {
        return (
            <tr>
                <th>Range</th>
                <td>
                    {spell.range}
                </td>
            </tr>
        )
    }
}
const AoE = ({spell}) => {
    if (spell.aoe) {
        return (
            <tr>
                <th>Area of Effect</th>
                <td>
                    {spell.aoe}
                </td>
            </tr>
        )
    }
}

const HigherLevel = ({spell}) => {
    if (spell.plus_slot) {
        return (
            <Row>
                <Col>
                    <span className="me-1"><i className="small">at higher levels...</i> </span>
                    {spell.plus_slot} per level
                </Col>
            </Row>
        )
    }
}

const DmgType = ({spell, level}) => {
    let short = spell.short;
    if (spell.level === "Cantrip") {
        console.log(spell.cantrip_upgrade)
        spell.cantrip_upgrade.forEach(upgrade => {
            if (level >= upgrade.level) {
                short = upgrade.dmg;
            }
        })
    }
    if (short) {
        return (
            <Row>
                <Col>
                    <span className="me-1"><PiSwordDuotone/></span>
                    {short}
                    <span
                        className={"badge ms-1 bg-dmgtype-" + spell.dmg_type.toLowerCase()}>{spell.dmg_type}</span>
                </Col>
            </Row>

        )
    }
}


function Spell({spell, level}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Card style={{width: '18rem'}}>
                <Card.Header className="bg-spell text-white h3" onClick={handleShow} role="button">
                    {spell.name}
                </Card.Header>
                <Card.Body>
                    <Container>
                        <DmgType spell={spell} level={level}/>
                        <HigherLevel spell={spell}/>
                        <Row className="mt-2">
                            <Col>
                                {spell.spell_type}
                            </Col>
                        </Row>
                    </Container>
                    <Table>
                        <tbody>
                        <tr>
                            <th>Speed</th>
                            <td><Badge bg={"spell-" + spell.cast_time.toLowerCase()}>{spell.cast_time}</Badge></td>
                        </tr>
                        <Duration spell={spell}/>
                        <Range spell={spell}/>
                        <AoE spell={spell}/>
                        <tr>
                            <th>Components</th>
                            <td>{spell.components}</td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <th>Class</th>*/}
                        {/*    <td>{spellClasses}</td>*/}
                        {/*</tr>*/}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{spell.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={{__html: spell.full}}></div>
                </Modal.Body>
            </Modal>
        </>
    )
}

const SpellsByLevel = ({spells, level, character_level}) => {
    if (!spells) {
        return
    }
    spells = spells.map(spell => {
        return (
            <Col key={spell.name}>
                <Spell spell={spell} level={character_level}/>
            </Col>
        )
    });
    return (
        <>
            <Row><Col>Spell Level: {level}</Col></Row>
            <Row>{spells}</Row>
        </>
    );
}

export default function Spells({level, character_class}) {
    const sources = [evocation];
    let byLevel = {},
        cantrips = [];

    sources[0].forEach(spell => {
        if (spell.level === "Cantrip") {
            cantrips.push(spell);
        } else {
            if (!(spell.level in byLevel)) {
                byLevel[spell.level] = []
            }
            byLevel[spell.level].push(spell)
        }
    })
    byLevel = Array.from({length: 20}, (i, j) => (<SpellsByLevel spells={byLevel[j]} level={j} character_level={level}/>));

    return (
        <>
            <div className="characterClassSection p-4">
                <ClassSpells level={level} character_class={character_class}/>
            </div>
            <Container className="py-1 mb-1">
                <SpellsByLevel spells={cantrips} level="Cantrips" character_level={level}/>
                {byLevel}
            </Container>
        </>
    )
}