import { useNavigate } from "react-router-dom";

type Appointment = {
  patientName: string;
  doctorName: string;
  time: string;
  status: string;
};

type Props = {
  data: any[];
};

const AppointmentTable = ({ data }: Props) => {
  const navigate = useNavigate();

  // 👉 TODAY DATE
  const today = new Date().toISOString().split("T")[0];

  // 👉 FILTER TODAY DATA
  const todayAppointments = data.filter((item: any) => {
    const itemDate = item.date.split("T")[0];
    return itemDate === today;
  });

  // 👉 FORMAT DATA
  const appointments: Appointment[] = todayAppointments.map((item: any) => ({
    patientName: item.patient_name,
    doctorName: item.doctor_name,
    time: item.time,
    status: item.status,
  }));

  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-white z-10">
        <tr className="text-left text-gray-500 border-b">
          <th className="px-6 py-3">Patient</th>
          <th className="px-6 py-3">Doctor</th>
          <th className="px-6 py-3">Time</th>
          <th className="px-6 py-3">Status</th>
        </tr>
      </thead>

      <tbody>
        {appointments.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center p-6 text-gray-400">
              No appointments today
            </td>
          </tr>
        ) : (
          appointments.map((item, index) => (
            <tr
              key={index}
              onClick={() => navigate("/appointments")}
              className="cursor-pointer border-b hover:bg-blue-50/40"
            >
              <td className="px-6 py-4 font-medium">
                {item.patientName}
              </td>

              <td className="px-6 py-4">
                {item.doctorName}
              </td>

              <td className="px-6 py-4">
                {item.time}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium
                  ${
                    item.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default AppointmentTable;