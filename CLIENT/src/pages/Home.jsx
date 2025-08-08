import Hero from '../components/Hero.jsx'
import FeaturedDestination from '../components/FeaturedDestination.jsx';
import ExclusiveOffers from '../components/ExclusiveOffere.jsx';
import Testimonials from '../components/Testimonials.jsx';
import NewsLetter from '../components/NewsLetter.jsx';

const Home = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Hero />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonials />
      <NewsLetter />
    </div>
  );
} 

export default Home