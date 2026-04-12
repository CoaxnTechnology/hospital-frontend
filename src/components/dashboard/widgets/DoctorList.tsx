import userImg from "../../../assets/icons/user-06.jpg";

type Doctor = {
  name: string;
  degree: string;
  online: boolean;
};

const doctors: Doctor[] = [
  { name: "Dr. Adam Billiard", degree: "MBBS, MD", online: true },
  { name: "Dr. Fred Macyard", degree: "MBBS, MD", online: true },
  { name: "Dr. Justin Stuart", degree: "MBBS, MD", online: false },
];

const DoctorList = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h4 className="text-lg font-semibold">Doctors</h4>
      </div>

      {/* LIST */}
      <ul className="divide-y">
        {doctors.map((doc, index) => (
          <li
            key={index}
            className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition"
          >
            {/* AVATAR */}
            <div className="relative">
              <img
                src={userImg}
                className="w-11 h-11 rounded-full border-2 border-blue-500"
                alt={doc.name}
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                  ${doc.online ? "bg-green-500" : "bg-gray-400"}`}
              />
            </div>

            {/* INFO */}
            <div className="flex-1">
              <p className="font-semibold">{doc.name}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {doc.degree}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* FOOTER */}
      <div className="px-6 py-3 text-center border-t">
        <a
          href="/doctors"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all Doctors
        </a>
      </div>
    </div>
  );
};

export default DoctorList;
