const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getBlogs } from "../../services/blog.service";

const Blog = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH BLOGS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBlogs();
        setBlogs(res.data || []);
      } catch (err) {
        console.error("Error loading blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 SCROLL FIX
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector("div");
      const cardWidth = (card as HTMLElement)?.clientWidth || 300;

      scrollRef.current.scrollBy({
        left: direction === "left" ? -(cardWidth + 20) : cardWidth + 20,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Health Blogs
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Explore latest health tips & medical insights
          </p>
        </div>

        <div className="relative">
          {/* LEFT */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition"
          >
            <ChevronLeft />
          </button>

          {/* RIGHT */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition"
          >
            <ChevronRight />
          </button>

          {/* BLOG LIST */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-4"
          >
            {/* 🔥 SKELETON */}
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[85%] sm:w-[48%] md:w-[32%] lg:w-[23%] flex-shrink-0 bg-white rounded-2xl shadow-md animate-pulse"
                >
                  <div className="h-56 bg-gray-300 rounded-t-2xl"></div>

                  <div className="p-5">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}

            {/* 🔥 NO DATA */}
            {!loading && blogs.length === 0 && (
              <p className="text-center w-full">No blogs available</p>
            )}

            {/* 🔥 BLOG DATA */}
            {!loading &&
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => navigate(`/blog/${blog.id}`)}
                  className="w-[85%] sm:w-[48%] md:w-[32%] lg:w-[24%] flex-shrink-0 bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
                >
                  <div className="w-full bg-gray-100 rounded-t-2xl overflow-hidden flex justify-center">
                    <img
                      src={`${BASE_URL}${blog.image}`}
                      alt={blog.title}
                      className="max-h-56 w-auto object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/no-image.png";
                      }}
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-semibold mb-2">
                      {blog.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-3">
                      {blog.description}
                    </p>

                    <span className="text-blue-600 text-sm font-medium">
                      Read More →
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 md:hidden">
            Swipe to see more →
          </p>
        </div>
      </div>

      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </section>
  );
};

export default Blog;
