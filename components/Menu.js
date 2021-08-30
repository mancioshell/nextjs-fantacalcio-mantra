import { Navbar, Nav } from "react-bootstrap";
import { useSession, signOut } from "next-auth/client";

import Link from "next/link";

function Menu() {
  const [session, loading] = useSession();

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Fanta Mantra Helper</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="container-fluid">
          <Nav.Item>
            <Link href="/auction" passHref>
              <Nav.Link>Asta</Nav.Link>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link href="/teams" passHref>
              <Nav.Link>Rose Squadre</Nav.Link>
            </Link>
          </Nav.Item>

          <Nav.Item className="ml-auto">
            {session ? (
              <Nav.Link
                href="/api/auth/signout"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Logout
              </Nav.Link>
            ) : null}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export { Menu };

export default Menu;
