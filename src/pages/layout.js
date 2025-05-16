import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import {Outlet, Link} from "react-router-dom";
import ReactDOM from "react-dom/client";

export default function Layout() {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">Sothar</Navbar.Brand>
                    <Navbar.Toggle aria-controls="home-nav"/>
                    <Navbar.Collapse id="home-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Character</Nav.Link>
                            <Nav.Link href="/spells">Spells</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet/>
        </>
    )
}