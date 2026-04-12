import aboutImg from "../../assets/images/top_service.png";
import icon1 from "../../assets/icons/banner_1.svg";
import icon2 from "../../assets/icons/banner_2.svg";
import icon3 from "../../assets/icons/banner_3.svg";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative py-20 bg-gradient-to-b from-blue-50 to-white"
    >
      {/* light blue background shape */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-blue-100 rounded-t-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* LEFT IMAGE */}
          <div className="w-full lg:w-6/12 flex justify-center">
            <img
              src={aboutImg}
              alt="About Hospital"
              className="w-full max-w-md drop-shadow-lg"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Us
            </h2>

            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
              accumsan lacus vel.
            </p>

            <a
              href="#"
              className="inline-block bg-blue-600 text-white px-7 py-3 rounded-full font-medium hover:bg-blue-700 transition mb-10"
            >
              Learn More
            </a>

            {/* FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center lg:items-start">
                <img src={icon1} alt="Emergency" className="w-10 mb-2" />
                <h5 className="font-semibold text-gray-800">Emergency</h5>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <img src={icon2} alt="Appointment" className="w-10 mb-2" />
                <h5 className="font-semibold text-gray-800">Appointment</h5>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <img src={icon3} alt="Qualified" className="w-10 mb-2" />
                <h5 className="font-semibold text-gray-800">Qualified</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
