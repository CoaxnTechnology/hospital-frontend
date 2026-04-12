import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import patientImg from "../../assets/doctors/doctor_2.png";
import { getPatients } from "../../services/patient.service";

type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  total_visits: number;
  last_visit: string;
};

const Patients = () => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PATIENTS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPatients();

        setPatients(response.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatients = patients.filter((p) =>
    `${p.name} ${p.email} ${p.id}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Patients</h2>

          <a
            href="/patients/add"
            className="inline-flex items-center gap-2
            bg-blue-600 text-white px-5 py-2.5
            rounded-lg hover:bg-blue-700 transition shadow"
          >
            <i className="fa fa-plus text-sm"></i>
            Add Patient
          </a>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search by Patient ID, Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3
            border border-gray-300 rounded-lg px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading patients...
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Photo</th>
                  <th className="px-4 py-3 text-left">Patient ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">Total Visits</th>
                  <th className="px-4 py-3 text-left">Last Visit</th>
                  <th className="px-4 py-3 text-right">History</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((p) => {
                  const age = p.dob
                    ? new Date().getFullYear() - new Date(p.dob).getFullYear()
                    : "-";

                  return (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={patientImg}
                          alt={p.name}
                          className="w-14 h-14 rounded-full object-cover
                          border border-gray-200 shadow-sm"
                        />
                      </td>

                      <td className="px-4 py-3 font-medium">#{p.id}</td>

                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-4 py-3">{p.email}</td>
                      <td className="px-4 py-3">{p.phone}</td>
                      <td className="px-4 py-3">{p.gender}</td>
                      <td className="px-4 py-3">{age}</td>

                      <td className="px-4 py-3">
                        <span
                          className="px-3 py-1 text-xs rounded-full
                        bg-blue-100 text-blue-700"
                        >
                          {p.total_visits}
                        </span>
                      </td>

                      <td className="px-4 py-3">{p.last_visit || "-"}</td>

                      <td className="px-4 py-3 text-right">
                        <a
                          href={`/patients/history/${p.id}`}
                          className="px-4 py-1.5 text-xs rounded-lg
                          bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          View History
                        </a>
                      </td>
                    </tr>
                  );
                })}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-10 text-gray-500"
                    >
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
