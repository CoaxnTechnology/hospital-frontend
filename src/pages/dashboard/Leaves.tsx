import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../../services/leave.service";

type Leave = {
  id: number;
  leave_type: string;
  date_from: string;
  date_to: string;
  total_days: number;
  reason: string;
  status: string;
  admin_remark?: string;
  username?: string;
};

const Leaves = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<Leave[]>([]);
  const [filter, setFilter] = useState("All");

  const [selectedLeave, setSelectedLeave] = useState<number | null>(null);
  const [remark, setRemark] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    if (filter === "All") {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(leaves.filter((l) => l.status === filter));
    }
  }, [filter, leaves]);

  const fetchLeaves = async () => {
    let res;

    if (role === "staff") {
      res = await getMyLeaves();
    } else {
      res = await getAllLeaves();
    }

    if (res.success) {
      setLeaves(res.data);
      setFilteredLeaves(res.data);
    }
  };

  const handleApprove = async (id: number) => {
    const res = await updateLeaveStatus(id, {
      status: "Approved",
      admin_remark: "Approved",
    });

    if (res.success) fetchLeaves();
  };

  const handleReject = async () => {
    if (!selectedLeave) return;

    const res = await updateLeaveStatus(selectedLeave, {
      status: "Rejected",
      admin_remark: remark,
    });

    if (res.success) {
      setSelectedLeave(null);
      setRemark("");
      fetchLeaves();
    }
  };

  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {role === "staff" ? "My Leaves" : "Leave Requests"}
          </h2>

          {role === "staff" && (
            <a
              href="/employee/add_leave"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Apply Leave
            </a>
          )}
        </div>

        {/* ANALYTICS */}

        <div className="grid grid-cols-4 gap-4">

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total</p>
            <h3 className="text-xl font-semibold">{total}</h3>
          </div>

          <div className="bg-yellow-50 shadow rounded-lg p-4">
            <p className="text-yellow-600 text-sm">Pending</p>
            <h3 className="text-xl font-semibold">{pending}</h3>
          </div>

          <div className="bg-green-50 shadow rounded-lg p-4">
            <p className="text-green-600 text-sm">Approved</p>
            <h3 className="text-xl font-semibold">{approved}</h3>
          </div>

          <div className="bg-red-50 shadow rounded-lg p-4">
            <p className="text-red-600 text-sm">Rejected</p>
            <h3 className="text-xl font-semibold">{rejected}</h3>
          </div>

        </div>

        {/* FILTER */}

        <div className="flex gap-3">

          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-lg border ${
                filter === f ? "bg-blue-600 text-white" : ""
              }`}
            >
              {f}
            </button>
          ))}

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">

            <thead className="bg-gray-100">
              <tr>

                {role !== "staff" && (
                  <th className="px-4 py-3 text-left">Employee</th>
                )}

                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Remark</th>

                {role !== "staff" && (
                  <th className="px-4 py-3">Action</th>
                )}

              </tr>
            </thead>

            <tbody>

              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="border-b">

                  {role !== "staff" && (
                    <td className="px-4 py-3">
                      {leave.username || "-"}
                    </td>
                  )}

                  <td className="px-4 py-3">{leave.leave_type}</td>

                  <td className="px-4 py-3">{leave.date_from}</td>

                  <td className="px-4 py-3">{leave.date_to}</td>

                  <td className="px-4 py-3">{leave.total_days}</td>

                  <td className="px-4 py-3">{leave.reason}</td>

                  <td className="px-4 py-3">

                    {leave.status === "Pending" && (
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    )}

                    {leave.status === "Approved" && (
                      <span className="text-green-600 font-medium">
                        Approved
                      </span>
                    )}

                    {leave.status === "Rejected" && (
                      <span className="text-red-600 font-medium">
                        Rejected
                      </span>
                    )}

                  </td>

                  <td className="px-4 py-3">
                    {leave.admin_remark || "-"}
                  </td>

                  {role !== "staff" && leave.status === "Pending" && (

                    <td className="px-4 py-3 flex gap-2">

                      <button
                        onClick={() => handleApprove(leave.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => setSelectedLeave(leave.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Reject
                      </button>

                    </td>

                  )}

                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* SMALL POPUP */}

        {selectedLeave && (
          <div className="fixed right-10 top-40 bg-white border rounded-lg shadow-lg p-4 w-[300px]">

            <h3 className="text-sm font-semibold mb-2">
              Reject Leave
            </h3>

            <textarea
              placeholder="Enter rejection reason"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border rounded p-2 text-sm mb-3"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setSelectedLeave(null)}
                className="border px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Reject
              </button>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Leaves;