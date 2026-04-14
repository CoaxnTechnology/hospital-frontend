import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHero } from "../../services/setting.service";

const Hero = ({ showButton = true }: { showButton?: boolean }) => {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // 🔥 IMAGE URL BUILDER
  const getImageUrl = (path: string) => {
    const base = import.meta.env.VITE_BASE_URL;

    if (!path) return "";

    return path.startsWith("http")
      ? path
      : `${base}${path.startsWith("/") ? path : "/" + path}`;
  };

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHero();
        setSlides(data || []);
      } catch (err) {
        console.error("Hero API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  // 🔥 SCROLL TO APPOINTMENT
  const scrollToAppointment = () => {
    const el = document.getElementById("appointment");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // 🔥 TOUCH EVENTS
  const handleTouchStart = (e: any) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: any) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrent((prev) => (prev + 1) % slides.length);
    }

    if (touchEndX.current - touchStartX.current > 50) {
      setCurrent((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1
      );
    }
  };

  // 🔥 SKELETON LOADING UI
  if (loading) {
    return (
      <section className="w-full h-[75vh] md:h-[85vh] bg-gray-200 animate-pulse relative overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gray-300"></div>

        {/* CONTENT */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl space-y-4">

              <div className="h-4 w-40 bg-gray-400 rounded"></div>

              <div className="h-10 w-72 bg-gray-400 rounded"></div>
              <div className="h-10 w-60 bg-gray-400 rounded"></div>

              <div className="h-4 w-full bg-gray-400 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-400 rounded"></div>

              <div className="h-10 w-40 bg-gray-400 rounded-full mt-4"></div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const imgUrl = getImageUrl(slide.image);

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* BLUR BACKGROUND */}
            <img
              src={imgUrl}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/1200x600?text=Image+Error";
              }}
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
            />

            {/* MAIN IMAGE */}
            <img
              src={imgUrl}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/1200x600?text=Image+Error";
              }}
              className="relative w-full h-full object-contain"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-xl text-white">

                  <h5 className="text-xs uppercase text-gray-300 mb-2">
                    We are here for your care
                  </h5>

                  <h1 className="text-2xl md:text-5xl font-bold mb-4">
                    {slide.title}
                    <br />
                    <span className="text-blue-400">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="mb-6">{slide.description}</p>

                  {showButton && (
                    <button
                      onClick={scrollToAppointment}
                      className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-full shadow-lg"
                    >
                      Make an Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ARROWS */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) =>
                prev === 0 ? slides.length - 1 : prev - 1
              )
            }
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full shadow"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() =>
              setCurrent((prev) => (prev + 1) % slides.length)
            }
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full shadow"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* DOTS */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2 z-30">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              i === current ? "bg-white w-6" : "bg-white/40 w-3"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;