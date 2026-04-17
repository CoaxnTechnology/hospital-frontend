import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  markLeavesAsSeen,
} from "../../services/leave.service";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

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

const SkeletonLoader = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const Leaves = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<Leave[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedLeave, setSelectedLeave] = useState<number | null>(null);
  const [remark, setRemark] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  useEffect(() => {
    fetchLeaves();

    // 🔥 ADMIN ke liye mark seen call karo
    if (role === "admin") {
      markSeen();
    }
  }, []);
  const markSeen = async () => {
    try {
      await markLeavesAsSeen();
      console.log("✅ MARK SEEN CALLED");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (filter === "All") {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(leaves.filter((l) => l.status === filter));
    }
  }, [filter, leaves]);

  const fetchLeaves = async () => {
    setLoading(true);
    let res;

    if (role === "staff" || role === "doctor") {
      res = await getMyLeaves();
    } else {
      res = await getAllLeaves();
    }

    if (res.success) {
      setLeaves(res.data);
      setFilteredLeaves(res.data);
    }
    setLoading(false);
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
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {role === "staff" || role === "doctor"
              ? "My Leaves"
              : "Leave Requests"}
          </h2>

          {(role === "staff" || role === "doctor") && (
            <a
              href="/employee/add_leave"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Apply Leave
            </a>
          )}
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <SkeletonLoader className="h-8 w-8 rounded-lg" />
                    <SkeletonLoader className="h-4 w-16" />
                  </div>
                  <SkeletonLoader className="h-8 w-12 mb-2" />
                  <SkeletonLoader className="h-4 w-24" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg rounded-xl p-6 text-white hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 opacity-80" />
                  <span className="text-blue-100 text-sm font-medium">
                    Total
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{total}</h3>
                <p className="text-blue-100 text-sm">Leave Requests</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg rounded-xl p-6 text-white hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 opacity-80" />
                  <span className="text-yellow-100 text-sm font-medium">
                    Pending
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{pending}</h3>
                <p className="text-yellow-100 text-sm">Awaiting Review</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 shadow-lg rounded-xl p-6 text-white hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8 opacity-80" />
                  <span className="text-green-100 text-sm font-medium">
                    Approved
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{approved}</h3>
                <p className="text-green-100 text-sm">Successfully Approved</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 shadow-lg rounded-xl p-6 text-white hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <XCircle className="h-8 w-8 opacity-80" />
                  <span className="text-red-100 text-sm font-medium">
                    Rejected
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{rejected}</h3>
                <p className="text-red-100 text-sm">Not Approved</p>
              </div>
            </>
          )}
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {role === "admin" && (
                    <th className="px-6 py-4 text-left font-medium text-gray-900">
                      Employee
                    </th>
                  )}

                  <th className="px-6 py-4 font-medium text-gray-900">Type</th>
                  <th className="px-6 py-4 font-medium text-gray-900">From</th>
                  <th className="px-6 py-4 font-medium text-gray-900">To</th>
                  <th className="px-6 py-4 font-medium text-gray-900">Days</th>
                  <th className="px-6 py-4 font-medium text-gray-900">
                    Reason
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-900">
                    Remark
                  </th>

                  {role === "admin" && (
                    <th className="px-6 py-4 font-medium text-gray-900">
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {role === "admin" && (
                          <td className="px-6 py-4">
                            <SkeletonLoader className="h-4 w-20" />
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <SkeletonLoader className="h-4 w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonLoader className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonLoader className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonLoader className="h-4 w-8" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonLoader className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonLoader className="h-4 w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonLoader className="h-4 w-20" />
                        </td>
                        {role === "admin" && (
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <SkeletonLoader className="h-6 w-12" />
                              <SkeletonLoader className="h-6 w-12" />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  : filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50">
                        {role === "admin" && (
                          <td className="px-6 py-4 text-gray-900">
                            {leave.username || "-"}
                          </td>
                        )}

                        <td className="px-6 py-4 text-gray-900">
                          {leave.leave_type}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {formatDate(leave.date_from)}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {formatDate(leave.date_to)}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {leave.total_days}
                        </td>
                        <td className="px-6 py-4 text-gray-900 max-w-xs truncate">
                          {leave.reason}
                        </td>

                        <td className="px-6 py-4">
                          {leave.status === "Pending" && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Pending
                            </span>
                          )}
                          {leave.status === "Approved" && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Approved
                            </span>
                          )}
                          {leave.status === "Rejected" && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Rejected
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-900 max-w-xs truncate">
                          {leave.admin_remark || "-"}
                        </td>

                        {role === "admin" && leave.status === "Pending" && (
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => setSelectedLeave(leave.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <SkeletonLoader className="h-5 w-20" />
                      <SkeletonLoader className="h-6 w-16" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonLoader className="h-4 w-full" />
                      <SkeletonLoader className="h-4 w-3/4" />
                    </div>
                    <div className="flex gap-2">
                      <SkeletonLoader className="h-8 w-16" />
                      <SkeletonLoader className="h-8 w-16" />
                    </div>
                  </div>
                ))
              : filteredLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {leave.leave_type}
                        </h4>
                        {role === "admin" && (
                          <p className="text-sm text-gray-600">
                            {leave.username || "-"}
                          </p>
                        )}
                      </div>
                      {leave.status === "Pending" && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Pending
                        </span>
                      )}
                      {leave.status === "Approved" && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Approved
                        </span>
                      )}
                      {leave.status === "Rejected" && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">From:</span>{" "}
                        {formatDate(leave.date_from)}{" "}
                        <span className="font-medium">To:</span>{" "}
                        {formatDate(leave.date_to)} ({leave.total_days} days)
                      </p>
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {leave.reason}
                      </p>
                      {leave.admin_remark && (
                        <p>
                          <span className="font-medium">Remark:</span>{" "}
                          {leave.admin_remark}
                        </p>
                      )}
                    </div>

                    {role === "admin" && leave.status === "Pending" && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleApprove(leave.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex-1"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => setSelectedLeave(leave.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex-1"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>

        {/* POPUP */}
        {selectedLeave && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Reject Leave</h3>

              <textarea
                placeholder="Enter rejection reason"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Leaves;
