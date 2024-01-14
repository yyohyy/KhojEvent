import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';


import img1 from '../assets/images/img1.jpg';

function AppAbout() {


  return (
    <section id="about" className="block about-block">
      <Container fluid>
        <div className="title-holder">
          <h2>About Us</h2>
          <div className="subtitle">learn more about us</div>
        </div>
        <Row>
          <Col sm={6}>
            <Image src={img1} />
          </Col>
          <Col sm={6}>
            <p>KhojEvent is more than just a website; it's a dynamic ecosystem. Dive into our curated vendor directory, explore insightful blogs, connect with fellow organizers in our community forum, and discover the latest trends shaping the world of events.
                At the heart of KhojEvent is a team driven by passion and a shared love for celebrations. We're here to support you at every step, providing resources, inspiration, and a helping hand to ensure your events are nothing short of spectacular</p>
            <p>Join us on this exciting journey as we redefine the art of event planning. KhojEvent – Where Every Occasion Becomes an Extraordinary Experience. Start planning with us and let your events take center stage.</p>
           
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AppAbout;