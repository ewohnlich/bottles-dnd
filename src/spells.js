import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import evocation from "./data/spells/evocation.json";
import "bootstrap-icons/font/bootstrap-icons.css";

function Spell({spell}) {
    const spellClasses = spell.classes.map(sc => <span key={sc} className="badge bg-spell-classes me-2">{sc}</span>);
    return (
        <Card style={{width: '18rem'}}>
            <Card.Header className="bg-spell text-white">{spell.name}</Card.Header>
            <Card.Body>
                <span className="me-1"><i className="bi bi-bandaid"></i></span>
                {spell.short} <span className={"text-dmgtype-"+spell.dmg_type.toLowerCase()}>{spell.dmg_type}</span>
                    <ul>
                        <li key="action" className="text-spell">{spell.cast_time}</li>
                        <li key="classes">{spellClasses}</li>
                    </ul>
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