import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useState} from "react";

export default function Notes() {
    const [notes, setNotes] = useState([]);

    const handleAddField = () => {
        setNotes([...notes, ""]);
    };

    const handleRemoveField = (index) => {
        const newFields = [...notes];
        newFields.splice(index, 1);
        setNotes(newFields);
    };

    const handleChange = (index, e) => {
        const newFields = [...notes];
        newFields[index] = e.target.value;
        setNotes(newFields);
    };

    return (
        <Container>
            <h2>Notes</h2>

        {notes.map((field, index) => (
            <Row key={index} className="mb-3">
                <Col>
                    <Form.Control
                        as="textarea"
                        value={field}
                        onChange={(e) => handleChange(index, e)}
                    />
                </Col>
                <Col>
                    <Button
                        variant="danger"
                        onClick={() => handleRemoveField(index)}
                    >
                        Remove
                    </Button>
                </Col>
            </Row>
        ))}
        <Row>
            <Col>
                <Button variant="success" onClick={handleAddField}>
                    Add
                </Button>
            </Col>
        </Row>
        </Container>
    );
}