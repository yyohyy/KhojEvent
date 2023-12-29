import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

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

function AppBlog() {
  return (
    <section id="blog" className="block blog-block">
      <Container fluid>
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
  )
}

export default AppBlog;