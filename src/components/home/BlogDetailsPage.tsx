const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlog } from "../../services/blog.service";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<any>(null);

  // 🔥 FETCH BLOG
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const res = await getBlog(id);
        setBlog(res.data);
      } catch (err) {
        console.error("Error loading blog", err);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // 🔥 LOADING
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 🔥 HERO SECTION */}
      <div className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] overflow-hidden">
        {/* 🔥 IMAGE (FIXED PERFECT POSITION) */}
        <img
          src={`${BASE_URL}${blog.image}`}
          alt={blog.title}
          className="w-full h-full object-cover object-center md:object-[55%_40%] brightness-95"
        />

        {/* 🔥 GRADIENT OVERLAY (LIGHT + PREMIUM) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

        {/* 🔥 TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-extrabold max-w-4xl leading-tight drop-shadow-lg">
            {blog.title}
          </h1>

          <div className="mt-4 text-gray-200 text-xs sm:text-sm md:text-base flex flex-wrap gap-4 justify-center">
            <span className="flex items-center gap-1">👨‍⚕️ {blog.author}</span>
            <span className="flex items-center gap-1">
              📅 {new Date(blog.created_at).toDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* 🔥 DESCRIPTION */}
        {blog.description && (
          <p className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg leading-relaxed text-center">
            {blog.description}
          </p>
        )}

        {/* 🔥 CONTENT BOX */}
        <div className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl shadow-md leading-relaxed text-gray-700 text-sm sm:text-base whitespace-pre-line">
          {blog.content}
        </div>

        {/* 🔥 BACK BUTTON */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base shadow"
          >
            ← Back to Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
