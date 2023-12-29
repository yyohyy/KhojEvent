import Carousel from 'react-bootstrap/Carousel';

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
    </section>
  );
}

export default AppHero;