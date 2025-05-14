import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import evocation from "./data/spells/evocation.json";
import 'bootstrap/dist/css/bootstrap.min.css';

function Spell({name, short, spellClass}) {
    return (
        <Card style={{width: '18rem'}}>
            <Card.Header className="bg-spell">{name}</Card.Header>
            <Card.Body>
                <Card.Text>
                    {short}
                    <ul>
                        <li className="text-spell">Action</li>
                        <li>{spellClass}</li>
                    </ul>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default function Spells() {
    const sources = [evocation],
        spells = sources[0].map(spell => {
            return (
                <Container>
                    <Row>
                        <Col>
                        <Spell name={spell['name']} spellClass={spell['class']} short={spell['short']}/>
                        </Col>
                    </Row>
                </Container>
            )
        });

    return (spells)
}