import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import {Outlet} from "react-router-dom";



export default function Layout() {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">Sothar</Navbar.Brand>
                    <Navbar.Toggle aria-controls="home-nav"/>
                    <Navbar.Collapse id="home-nav">
                        <Nav className="me-auto">
                                <Nav.Link href="/" className={ window.location.pathname === "/" ? "active" : "" }>Character</Nav.Link>
                                <Nav.Link href="/spells" className={ window.location.pathname === "/spells" ? "active" : "" }>Spells</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet/>
        </>
    )
}