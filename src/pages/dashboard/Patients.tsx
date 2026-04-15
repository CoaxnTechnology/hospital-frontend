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
  age: number;
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
        console.log("Fetched patients:", response.data);

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
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const PageSkeletonLoader = () => (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-8 w-44 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="h-12 w-full sm:w-44 rounded-full bg-gray-200 animate-pulse"></div>
      </div>

      <div className="space-y-4">
        <div className="h-12 rounded-3xl bg-gray-200 animate-pulse"></div>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 w-32 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-20 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-4/6 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Patients</h2>

          <a
            href="/patients/add"
            className="inline-flex flex-shrink-0 min-w-max items-center gap-2 whitespace-nowrap bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow"
          >
            <i className="fa fa-plus text-sm"></i>
            <span className="whitespace-nowrap">Add Patient</span>
          </a>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search by Patient ID, Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE / MOBILE CARDS */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <PageSkeletonLoader />
          ) : filteredPatients.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No patients found
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Patient ID</th>
                      <th className="px-4 py-3 text-left">Name</th>

                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Gender</th>
                      <th className="px-4 py-3 text-left">Age</th>
                      <th className="px-4 py-3 text-left">Total Visits</th>
                      <th className="px-4 py-3 text-left">Last Visit</th>
                      <th className="px-4 py-3 text-right">History</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPatients.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{p.id}</td>

                        <td className="px-4 py-3">{p.name}</td>

                        <td className="px-4 py-3">{p.phone}</td>
                        <td className="px-4 py-3">{p.gender}</td>
                        <td className="px-4 py-3">{p.age ?? "-"}</td>

                        <td className="px-4 py-3">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                            {p.total_visits}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {p.last_visit ? formatDate(p.last_visit) : "-"}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <a
                            href={`/patients/history/${p.id}`}
                            className="inline-flex whitespace-nowrap px-4 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            View History
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 sm:hidden p-4">
                {filteredPatients.map((p) => (
                  <article
                    key={p.id}
                    className="rounded-3xl border border-gray-200 bg-slate-50 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={patientImg}
                        alt={p.name}
                        className="h-14 w-14 rounded-full object-cover border border-gray-200"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {p.name}
                        </p>
                        <p className="text-sm text-gray-500">#{p.id}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">
                          Phone:
                        </span>{" "}
                        {p.phone}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            Gender:
                          </span>{" "}
                          {p.gender}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            Age:
                          </span>{" "}
                          {p.age ?? "-"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Visits:
                        </span>{" "}
                        {p.total_visits}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Last Visit:
                        </span>{" "}
                        {p.last_visit ? formatDate(p.last_visit) : "-"}
                      </div>
                    </div>

                    <a
                      href={`/patients/history/${p.id}`}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 whitespace-nowrap"
                    >
                      View History
                    </a>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
