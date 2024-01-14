import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function AppContact() {
  return (
    <section id="contact" className="block contact-block">
      <Container fluid>
        <div className="title-holder">
          <h2>Contact us</h2>
          <div className="subtitle">get connected with us</div>
        </div>
        <Form className='contact-form'>
          <Row>
            <Col sm={4}>
              <Form.Control type="text" placeholder="Enter your full name" required />
            </Col>
            <Col sm={4}>
              <Form.Control type="email" placeholder="Enter your email address" required />
            </Col>
            <Col sm={4}>
              <Form.Control type="tel" placeholder="Enter your contact number" required />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Form.Control as="textarea" placeholder="Enter your contact message" required />
            </Col>
          </Row>
          <div className='btn-holder'>
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Container>
      <div className='google-map'>
       
        <iframe title='map' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.359290659457!2d85.28176416799907!3d27.6990696678221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1860ae22d385%3A0x7c2444e8284cef52!2sKalimati%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1704909731306!5m2!1sen!2snp"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <Container fluid>
        <div className='contact-info'>
          <ul>
            <li>
              <i className="fas fa-envelope"></i>
              Kec@gmail.com
            </li>
            <li>
              <i className="fas fa-phone"></i>
              01-5672571
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              Kathmandu, Nepal
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default AppContact;