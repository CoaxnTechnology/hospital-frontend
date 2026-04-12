const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHero } from "../../services/setting.service";

const Hero = ({ showButton = true }: { showButton?: boolean }) => {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // FETCH
  useEffect(() => {
    const fetchData = async () => {
      const data = await getHero();
      setSlides(data);
    };
    fetchData();
  }, []);

  // AUTO SLIDE
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  // TOUCH
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
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  return (
    <>
      <section
        className="relative w-full h-[75vh] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          >
            {/* IMAGE */}
            <img
              src={`${BASE_URL}/uploads/hero/${slide.image}`}
              className="w-full h-full object-cover zoom-img"
            />

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-xl text-white animate-fadeInUp">
                  <h5 className="uppercase text-sm tracking-widest text-gray-300 mb-3">
                    We are here for your care
                  </h5>

                  <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4">
                    {slide.title} <br />
                    <span className="text-blue-300">{slide.highlight}</span>
                  </h1>

                  <p className="text-gray-200 mb-6 text-sm md:text-base leading-relaxed">
                    {slide.description}
                  </p>

                  {showButton && (
                    <button className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-full shadow-lg">
                      Make an Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ARROWS */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((prev) =>
                  prev === 0 ? slides.length - 1 : prev - 1,
                )
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* DOTS */}
        <div className="absolute bottom-6 w-full flex justify-center gap-3 z-20">
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

      {/* 🔥 INLINE CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease;
        }

        .zoom-img {
          transform: scale(1);
          animation: zoomEffect 6s ease-in-out forwards;
        }

        @keyframes zoomEffect {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
};

export default Hero;
