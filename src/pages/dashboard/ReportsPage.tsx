import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Reports</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Total Sales</h3>
            <p className="text-xl font-bold">₹ 0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Total Purchase</h3>
            <p className="text-xl font-bold">₹ 0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Profit</h3>
            <p className="text-xl font-bold text-green-600">₹ 0</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
