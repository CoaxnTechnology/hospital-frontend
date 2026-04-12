type Stat = {
  label: string;
  value: number;
  color: string;
};

const stats: Stat[] = [
  { label: "OPD Patient", value: 16, color: "bg-blue-500" },
  { label: "New Patient", value: 71, color: "bg-green-500" },
  { label: "Laboratory Test", value: 82, color: "bg-purple-500" },
  { label: "Treatment", value: 67, color: "bg-orange-500" },
  { label: "Discharge", value: 30, color: "bg-red-500" },
];

const HospitalManagementChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h4 className="text-lg font-semibold mb-6">Hospital Management</h4>

      <div className="space-y-5">
        {stats.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{item.label}</span>
              <span className="text-gray-500">{item.value}%</span>
            </div>

            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-700`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalManagementChart;
