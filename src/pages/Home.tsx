import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import Fields from '@/components/Fields';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <Fields />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default Home;