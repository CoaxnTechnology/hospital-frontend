import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Doctors from "../components/home/Doctors";
import Appointment from "../components/home/Appointment";
import Blog from "../components/home/Blog";
import Footer from "../components/layout/Footer";
import SpecialitiesSection from "../components/home/SpecialitiesSection";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* ✅ HOME */}
      <div id="home">
        <Hero />
      </div>

      {/* ✅ SPECIALITIES */}
      <div id="specialities">
        <SpecialitiesSection />
      </div>

      {/* ✅ DOCTORS */}
      <div id="doctors">
        <Doctors />
      </div>

      {/* ✅ APPOINTMENT */}
      <div id="appointment">
        <Appointment />
      </div>

      {/* ✅ SERVICES */}
      <div id="services">
        <Services />
      </div>

      {/* ✅ BLOG */}
      <div id="blog">
        <Blog />
      </div>

      <Footer />
    </>
  );
};

export default Home;
