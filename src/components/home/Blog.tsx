const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getBlogs } from "../../services/blog.service"; // 🔥 API

const Blog = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<any[]>([]);

  // 🔥 FETCH BLOGS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBlogs();
        setBlogs(res.data || []);
        console.log("Blogs loaded:", res.data);
      } catch (err) {
        console.error("Error loading blogs", err);
      }
    };

    fetchData();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
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
            className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-1"
          >
            {blogs.length === 0 && (
              <p className="text-center w-full">No blogs available</p>
            )}

            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="min-w-[280px] sm:min-w-[300px] md:min-w-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
              >
                <div className="w-full bg-gray-100 rounded-t-2xl overflow-hidden flex justify-center">
                  <img
                    src={`${BASE_URL}/uploads/blogs/${encodeURIComponent(blog.image)}`}
                    alt={blog.title}
                    className="max-h-56 w-auto object-contain"
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
