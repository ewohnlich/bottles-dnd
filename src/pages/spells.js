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
            <Row>
                <Col>
                    {spell.duration}
                    <Badge bg="warning">
                        Concentration
                    </Badge>
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Row>
                <Col>
                    {spell.duration}
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
        <Card style={{width: '18rem'}}>
            <Card.Header className="bg-spell text-white">
                {spell.name}
                <Button variant="body" onClick={handleShow} className="float-end">
                    <i className="bi-question-lg"/>
                </Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{spell.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><div dangerouslySetInnerHTML={{__html: spell.full}}></div></Modal.Body>
                </Modal>
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
                    <Row>
                        <Col>
                            <span className="me-1"><i className="bi-plus-square"/> </span>
                            <HoverLink title={"Bonus damage per spell slot over " + spell.level}
                                       id={"tooltip-" + spell.name}>

                                {spell.plus_slot}
                            </HoverLink>
                        </Col>
                    </Row>
                    <Duration spell={spell}/>
                </Container>
                <hr/>
                <Table>
                    <tbody>
                    <tr>
                        <th>Speed</th>
                        <td><Badge bg="spell-action">{spell.cast_time}</Badge></td>
                    </tr>
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
        <Container>
            <Row>
                {spells}
            </Row>
        </Container>
    )
}