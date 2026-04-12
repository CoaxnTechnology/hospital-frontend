import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", ICU: 35, OPD: 28 },
  { month: "Feb", ICU: 59, OPD: 48 },
  { month: "Mar", ICU: 80, OPD: 40 },
  { month: "Apr", ICU: 81, OPD: 19 },
  { month: "May", ICU: 56, OPD: 86 },
  { month: "Jun", ICU: 55, OPD: 27 },
];

const PatientsBarChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Patients In
        </h4>

        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-blue-500">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> ICU
          </span>
          <span className="flex items-center gap-1 text-yellow-500">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span> OPD
          </span>
        </div>
      </div>

      {/* CHART */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ICU" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="OPD" fill="#facc15" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatientsBarChart;
