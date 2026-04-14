import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBranches } from "../services/branch.service";

const BranchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ NEW

  const [branch, setBranch] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getBranches();
      const found = data.find((b: any) => b.id == id);
      setBranch(found);
    };
    load();
  }, [id]);

  if (!branch) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const fullAddress = `${branch.address}, ${branch.area}, ${branch.city}`;

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 🔥 BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back to Home
        </button>

        {/* 🔥 CARD */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 🔥 HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {branch.city} - {branch.area}
            </h2>
            <p className="text-sm mt-1 opacity-90">
              Our Hospital Branch Location
            </p>
          </div>

          {/* 🔥 CONTENT */}
          <div className="p-6 space-y-6">
            {/* 🔥 ADDRESS */}
            <div className="bg-gray-50 border rounded-xl p-4">
              <h3 className="font-semibold mb-2">📍 Full Address</h3>
              <p className="text-gray-600">{fullAddress}</p>
            </div>
            {/* 🔥 PHONE */}
            <div className="bg-gray-50 border rounded-xl p-4">
              <h3 className="font-semibold mb-2">📞 Contact</h3>

              <p className="text-gray-600 mb-3">
                {branch.phone || "Not available"}
              </p>

              {branch.phone && (
                <a
                  href={`tel:${branch.phone}`}
                  className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  📞 Call Now
                </a>
              )}
            </div>
            {/* 🔥 BUTTON */}
            <div>
              <a
                href={mapUrl}
                target="_blank"
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                📍 Get Directions
              </a>
            </div>

            {/* 🔥 MAP */}
            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetails;
