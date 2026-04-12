import user from "../../../assets/icons/user-06.jpg";

type Patient = {
  name: string;
  email: string;
  phone: string;
  disease: string;
  color: string;
};

const patients: Patient[] = [
  {
    name: "John Doe",
    email: "johndoe21@gmail.com",
    phone: "+1-202-555-0125",
    disease: "Fever",
    color: "bg-red-100 text-red-600",
  },
  {
    name: "Richard",
    email: "richard123@yahoo.com",
    phone: "202-555-0127",
    disease: "Cancer",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Villiam",
    email: "villiam@yahoo.com",
    phone: "+1-202-555-0106",
    disease: "Eye",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Martin",
    email: "martin@gmail.com",
    phone: "776-2323 89562015",
    disease: "Fever",
    color: "bg-orange-100 text-orange-600",
  },
];

const NewPatientsTable = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg col-span-1 lg:col-span-2 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h4 className="text-lg font-semibold">New Patients</h4>
        <a
          href="/patients"
          className="text-sm bg-white/20 px-4 py-1.5 rounded-full hover:bg-white/30 transition"
        >
          View all
        </a>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {patients.map((p, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                {/* PATIENT */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={user}
                    className="w-9 h-9 rounded-full border"
                    alt={p.name}
                  />
                  <span className="font-semibold">{p.name}</span>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-gray-600">{p.email}</td>

                {/* PHONE */}
                <td className="px-6 py-4">{p.phone}</td>

                {/* DISEASE */}
                <td className="px-6 py-4 text-right">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${p.color}`}
                  >
                    {p.disease}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewPatientsTable;
