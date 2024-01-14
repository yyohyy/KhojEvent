import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';


import img1 from '../assets/images/img1.jpg';
var heroData = [
  {
    id: 1,
    image: require('../assets/images/img-hero1.jpg'),
    title: 'Find the Events with Us',
    description: 'Welcome to KhojEvent, your one-stop destination for seamless event planning and management! At KhojEvent, we understand the importance of creating unforgettable moments, and our user-friendly website is designed to streamline the entire event management process.',
    link: 'https://www.google.com'
  },
  {
    id: 2,
    image: require('../assets/images/img-hero2.jpg'),
    title: 'Book the Tickets ',
    description: 'Enjoy the peace of mind that comes with our secure online payment system. Purchase tickets with confidence, knowing that your transaction is protected and your information is handled with the utmost care.!',
    link: 'https://www.facebook.com'
  },
  {
    id: 3,
    image: require('../assets/images/img-hero3.jpg'),
    title: 'Promote your Event ',
    description: 'Introducing EventBoost – Amplify Your Experience! Unlock the full potential of your events with our powerful promotion tools that guarantee heightened visibility and attendance. Create a buzz around your event by leveraging our strategic promotional features. Craft eye-catching event pages with customizable designs, compelling descriptions, and vibrant multimedia content. Showcase what makes your event unique and irresistible to potential attendees.',
    link: 'https://www.twitter.com'
  }
]
const blogData = [
  {
    id: 1,
    image: require('../assets/images/blog1.jpg'),
    time: ' 01 Jan 2024',
    title: 'New Year Carnival',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
    link: 'https://www.google.com'
  },
  {
    id: 2,
    image: require('../assets/images/blog2.jpg'),
    time: '27 Jan 2024',
    title: 'Art Exhibition',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
    link: 'https://www.facebook.com'
  },
  {
    id: 3,
    image: require('../assets/images/blog3.jpg'),
    time: '15 Feb 2024',
    title: 'Bartika Eam Rai Concert',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
    link: 'https://www.twitter.com'
  }
]
function AppHero() {
  return (
    <section id="home" className="hero-block">
       <Carousel>
          {
            heroData.map(hero => {
              return (
                <Carousel.Item key={hero.id}>
                  <img
                    className="d-block w-100"
                    src={hero.image}
                    alt={"slide " + hero.id}
                  />
                  <Carousel.Caption>
                    <h2>{hero.title}</h2>
                    <p>{hero.description}</p>
                    <a className="btn btn-primary" href={hero.link}>Learn More <i className="fas fa-chevron-right"></i></a>
                  </Carousel.Caption>             
                </Carousel.Item>
              );
            })
          }
      </Carousel>
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
        <div className="title-holder">
          <h2>Coming Soon</h2>
          <div className="subtitle">Stay Tuned</div>
        </div>
        <Row>
          {
            blogData.map(blog => {
              return (
                <Col sm={4} key={blog.id}>
                  <div className='holder'>
                    <Card>
                      <Card.Img variant="top" src={blog.image} />
                      <Card.Body>
                        <time>{blog.time}</time>
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Text>
                          {blog.description}
                        </Card.Text>
                        <a href={blog.link} className="btn btn-primary">Read More <i className="fas fa-chevron-right"></i></a>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              )
            })
          }
        </Row>
      </Container>

    </section>
  );
}

export default AppHero;