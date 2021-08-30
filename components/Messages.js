import { Toast, Row, Col } from "react-bootstrap";
import { useContext } from "react";

import UIContext from "../context/UIContext";

function Message({ message }) {
  const { removeMessage } = useContext(UIContext);

  return (
    <Toast
      className={`bg-${message.type}`}
      animation={true}
      onClose={() => removeMessage(message)}
      show={true}
      delay={3000} autohide
    >
      <Toast.Header>
        <h6 className="mr-auto">
          <i
            className={`fas ${
              message.type === "danger"
                ? "fa-exclamation-triangle"
                : "fa-check-circle"
            } mr-2`}
          ></i>
          {message.title}
        </h6>
      </Toast.Header>
      <Toast.Body>
        <strong>{message.text} </strong>
      </Toast.Body>
    </Toast>
  );
}

function Messages() {
  const { messages } = useContext(UIContext);

  let Messages = messages.map((message) => (
    <Message key={message.id} message={message}></Message>
  ));

  return (
    <Row className="mt-2">
      <Col sm={{ span: 4, offset: 4 }}>
        {Messages}
      </Col>
    </Row>
  );
}

export { Messages };

export default Messages;
