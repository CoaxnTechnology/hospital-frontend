import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", patients: 100 },
  { month: "Feb", patients: 70 },
  { month: "Mar", patients: 20 },
  { month: "Apr", patients: 100 },
  { month: "May", patients: 120 },
  { month: "Jun", patients: 50 },
  { month: "Jul", patients: 70 },
  { month: "Aug", patients: 50 },
  { month: "Sep", patients: 100 },
  { month: "Oct", patients: 20 },
  { month: "Nov", patients: 50 },
  { month: "Dec", patients: 90 },
];

const PatientLineChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Patient Total
        </h4>
        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
          <i className="fa fa-caret-up"></i> 15% Higher than Last Month
        </span>
      </div>

      {/* CHART */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#patientGradient)"
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatientLineChart;
