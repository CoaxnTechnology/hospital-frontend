type Appointment = {
  patientName: string;
  doctorName: string;
  time: string;
  status: "Confirmed" | "Pending";
};

const appointments: Appointment[] = [
  {
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    patientName: "Maria Lee",
    doctorName: "Dr. Adams",
    time: "11:15 AM",
    status: "Pending",
  },
  {
    patientName: "Robert Fox",
    doctorName: "Dr. Brown",
    time: "12:00 PM",
    status: "Confirmed",
  },
];

const AppointmentTable = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg col-span-1 lg:col-span-2 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <h4 className="text-lg font-semibold tracking-wide">
          Upcoming Appointments
        </h4>

        <a
          href="/appointment"
          className="text-sm bg-white/20 px-4 py-1.5 rounded-full hover:bg-white/30 transition"
        >
          View all
        </a>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((item, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-blue-50/40 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {item.patientName}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {item.doctorName}
                </td>

                <td className="px-6 py-4">{item.time}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                      ${
                        item.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="px-4 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow">
                    Take up
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
