import Hero from '../components/Hero.jsx'
import FeaturedDestination from '../components/FeaturedDestination.jsx';
import ExclusiveOffers from '../components/ExclusiveOffere.jsx';
import Testimonials from '../components/Testimonials.jsx';
import NewsLetter from '../components/NewsLetter.jsx';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedDestination/>
      <ExclusiveOffers />
      <Testimonials />
      <NewsLetter/>
    </>
  );
} 

export default Home 