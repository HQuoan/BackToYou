import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LatestEpisodes from './components/LatestEpisodes';
import Topics from './components/Topics';
import Trending from './components/Trending';
import Footer from './components/Footer';


const App = () => (
  <>
     {/* <LatestEpisodes /> */}
    <Navbar />
    <main>
      <HeroSection />
      <LatestEpisodes />
      <Topics />
      <Trending />
    </main>
    <Footer />
  </>
);

export default App;