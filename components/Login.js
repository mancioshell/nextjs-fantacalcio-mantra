import { signIn } from "next-auth/client";
import { Container, Col, Row, Button } from "react-bootstrap";

export default function AccessDenied() {
  return (
    <Container className="justify-content-md-center mt-5" fluid>
      <Row>
        <Col sm={{ span: 10, offset: 1 }}>
          <header className="mt-4">
            <h1>
              <i className="fas fa-user"></i> Accesso Non Consentito
            </h1>
          </header>

          <section>
            <p>
              Devi essere loggato tramite Github per poter utilizzare le
              funzionalità di amministrazione.
            </p>

            <Button
              className="mr-3 mt-3"
              variant="primary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              <i className="fas fa-sign-in-alt"></i> Login
            </Button>
          </section>
        </Col>
      </Row>
    </Container>
  );
}
