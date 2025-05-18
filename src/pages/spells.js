import {Card, Container, Col, Row, Table, Modal, Button, Badge} from 'react-bootstrap';
import {PiSwordDuotone} from "react-icons/pi";
import evocation from "../data/spells/evocation.json";
import "bootstrap-icons/font/bootstrap-icons.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {useState} from 'react';

const HoverLink = ({id, children, title}) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
        <a href="#" className="decoration-dotted text-secondary">{children}</a>
    </OverlayTrigger>
);


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
                    {spell.range} ft
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
                    {spell.aoe} ft
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
                    <HoverLink title={"Bonus damage per spell slot over " + spell.level}
                               id={"tooltip-" + spell.name}>
                        {spell.plus_slot}
                    </HoverLink>
                </Col>
            </Row>
        )
    }
}

function Spell({spell}) {
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
                        <Row>
                            <Col>
                                <span className="me-1"><PiSwordDuotone/></span>
                                {spell.short}
                                <span
                                    className={"badge ms-1 bg-dmgtype-" + spell.dmg_type.toLowerCase()}>{spell.dmg_type}</span>
                            </Col>
                        </Row>
                        <HigherLevel spell={spell}/>
                        <Row className="mt-2">
                            <Col>
                                {spell.spell_type}
                            </Col>
                        </Row>
                    </Container>
                    <hr/>
                    <Table>
                        <tbody>
                        <tr>
                            <th>Speed</th>
                            <td><Badge bg="spell-action">{spell.cast_time}</Badge></td>
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

export default function Spells() {
    const sources = [evocation],
        spells = sources[0].map(spell => {
            return (
                <Col key={spell.name}>
                    <Spell spell={spell}/>
                </Col>
            )
        });

    return (
        <>
            <Container>
                <h2>Spells</h2>
                <Row>
                    {spells}
                </Row>
            </Container>
        </>
    )
}