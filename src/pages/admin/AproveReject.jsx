import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingUsers,
  updateUserStatus,
  approveUser,
  updateUser,
  deleteUser,
} from "../../features/Admin/Adminslice";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
  approved: { label: "Approved", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  rejected: { label: "Rejected", bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200",   dot: "bg-red-500"   },
};

const AVATAR_COLORS = ["#8B0000", "#0f5132", "#084298", "#6f42c1", "#b5460f", "#0a4a5a"];

function getAvatarColor(id) {
  return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function Spinner({ className = "w-4 h-4" }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

export default function ApproveReject() {
  const dispatch = useDispatch();
  const {
    users, loading, error,
    actionLoadingId, updateLoadingId, deleteLoadingId, actionError,
  } = useSelector((s) => s.admin);

  const [selected,     setSelected]     = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search,       setSearch]       = useState("");
  const [editOpen,     setEditOpen]     = useState(false);
  const [editForm,     setEditForm]     = useState({ name: "", email: "", mobile: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { dispatch(fetchPendingUsers()); }, [dispatch]);

  useEffect(() => {
    if (selected) {
      const updated = users.find((u) => u.id === selected.id);
      if (updated) setSelected(updated);
      else setSelected(null);
    }
  }, [users]);

  const handleApprove = (id) => dispatch(approveUser(id));

  const handleStatusUpdate = (id, status) => {
    dispatch(updateUserStatus({ id, status }));
    if (selected?.id === id) setSelected((prev) => ({ ...prev, status }));
  };

  const openEdit = (user) => {
    setEditForm({ name: user.name, email: user.email, mobile: user.mobile });
    setEditOpen(true);
  };

  const handleEditSave = () => {
    dispatch(updateUser({ id: selected.id, ...editForm }))
      .unwrap()
      .then(() => setEditOpen(false))
      .catch(() => {});
  };

  const confirmDelete = () => {
    dispatch(deleteUser(deleteTarget.id))
      .unwrap()
      .then(() => { setDeleteTarget(null); setSelected(null); })
      .catch(() => {});
  };

  const filtered = users.filter((r) => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.mobile?.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = {
    all:      users.length,
    pending:  users.filter((r) => r.status === "pending").length,
    approved: users.filter((r) => r.status === "approved").length,
    rejected: users.filter((r) => r.status === "rejected").length,
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Spinner className="w-10 h-10 text-red-700" />
      <p className="text-gray-500 text-sm font-medium">Loading requests...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="text-5xl">⚠️</div>
      <p className="text-red-600 font-semibold">{error}</p>
      <button onClick={() => dispatch(fetchPendingUsers())} className="px-5 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { key: "all",      emoji: "📋", label: "Total Requests", grad: "from-blue-50 to-blue-100",   active: "border-blue-500 shadow-blue-100",   bar: "bg-blue-500",  pct: 100 },
          { key: "pending",  emoji: "⏳", label: "Pending",        grad: "from-amber-50 to-amber-100", active: "border-amber-500 shadow-amber-100", bar: "bg-amber-500", pct: counts.all ? (counts.pending  / counts.all) * 100 : 0 },
          { key: "approved", emoji: "✅", label: "Approved",       grad: "from-green-50 to-green-100", active: "border-green-500 shadow-green-100", bar: "bg-green-500", pct: counts.all ? (counts.approved / counts.all) * 100 : 0 },
          { key: "rejected", emoji: "❌", label: "Rejected",       grad: "from-red-50 to-red-100",     active: "border-red-500 shadow-red-100",     bar: "bg-red-500",   pct: counts.all ? (counts.rejected / counts.all) * 100 : 0 },
        ].map(({ key, emoji, label, grad, active, bar, pct }) => (
          <div
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`relative group rounded-xl p-5 cursor-pointer transition-all duration-300 bg-gradient-to-br ${grad} border-2 ${filterStatus === key ? `${active} shadow-lg` : "border-gray-200 hover:border-gray-300"} hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{emoji}</span>
              {filterStatus === key && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-700 text-white shadow-sm animate-pulse">Active</span>}
            </div>
            <p className="text-3xl font-bold text-gray-800">{counts[key]}</p>
            <p className="text-xs font-semibold mt-1 uppercase tracking-wide text-gray-500">{label}</p>
            <div className="mt-3 h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {actionError}
        </div>
      )}

      {/* Filters + Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 focus-within:border-red-500 transition-all duration-200">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, mobile…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-150 border ${filterStatus === s ? "bg-red-700 text-white border-red-700 shadow-md" : "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Table + Detail Panel */}
      <div className="flex flex-col xl:flex-row gap-4">

        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="font-semibold text-gray-800">Requests <span className="text-gray-400 font-normal text-sm">({filtered.length})</span></h3>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-medium text-gray-500">No requests found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((req) => {
                const st = STATUS_CONFIG[req.status];
                const isSelected = selected?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelected(isSelected ? null : req)}
                    className={`group flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200 ${isSelected ? "bg-red-50/50" : "hover:bg-gray-50"}`}
                  >
                    {req.photo_url ? (
  <img
    src={`${import.meta.env.VITE_BASE_URL}${req.photo_url}`}
    alt={req.name}
    className="w-11 h-11 rounded-full object-cover shadow-md shrink-0 transition-transform group-hover:scale-105"
  />
) : (
  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 transition-transform group-hover:scale-105" style={{ background: getAvatarColor(req.id) }}>
    {getInitials(req.name)}
  </div>
)}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{req.name}</p>
                      <p className="text-xs text-gray-400 truncate">{req.email} · {req.mobile}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5 shrink-0 ${st.bg} ${st.text} ${st.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>

                    {/* Row actions */}
                    <div className="hidden sm:flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {req.status === "pending" && (
                        <button onClick={() => handleApprove(req.id)} disabled={actionLoadingId === req.id}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed" title="Approve">
                          {actionLoadingId === req.id ? <Spinner /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                      )}
                      <button onClick={() => { setSelected(req); openEdit(req); }} disabled={updateLoadingId === req.id}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed" title="Edit">
                        {updateLoadingId === req.id ? <Spinner /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                      </button>
                      <button onClick={() => setDeleteTarget(req)} disabled={deleteLoadingId === req.id}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed" title="Delete">
                        {deleteLoadingId === req.id ? <Spinner /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="xl:w-96 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="font-semibold text-gray-800 text-sm">Request Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-6 py-6 text-center border-b border-gray-100">
             {selected.photo_url ? (
  <img
    src={`${import.meta.env.VITE_BASE_URL}${selected.photo_url}`}
    alt={selected.name}
    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-lg"
  />
) : (
  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg" style={{ background: getAvatarColor(selected.id) }}>
    {getInitials(selected.name)}
  </div>
)}
              <h4 className="font-bold text-gray-800 text-lg">{selected.name}</h4>
              <p className="text-gray-500 text-sm mt-1">{selected.email}</p>
              {(() => { const st = STATUS_CONFIG[selected.status]; return (
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border mt-3 ${st.bg} ${st.text} ${st.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                </span>
              ); })()}
            </div>

            <div className="px-6 py-5 space-y-3">
              {[
                { label: "User ID", value: `#${selected.id}` },
                { label: "Name",    value: selected.name    },
                { label: "Email",   value: selected.email   },
                { label: "Mobile",  value: selected.mobile  },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-3 py-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">{label}</span>
                  <span className="text-xs text-gray-700 font-medium text-right break-all">{value}</span>
                </div>
              ))}
            </div>

            {selected.status === "pending" && (
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50">
                <button onClick={() => handleApprove(selected.id)} disabled={actionLoadingId === selected.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {actionLoadingId === selected.id ? <Spinner /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                  {actionLoadingId === selected.id ? "Approving..." : "Approve"}
                </button>
                <button onClick={() => handleStatusUpdate(selected.id, "rejected")}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  Reject
                </button>
              </div>
            )}

            {selected.status !== "pending" && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button onClick={() => handleStatusUpdate(selected.id, "pending")}
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium py-2.5 rounded-lg transition">
                  Reset to Pending
                </button>
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => openEdit(selected)} disabled={updateLoadingId === selected.id}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {updateLoadingId === selected.id ? <><Spinner /> Saving...</> : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>Edit</>}
              </button>
              <button onClick={() => setDeleteTarget(selected)} disabled={deleteLoadingId === selected.id}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {deleteLoadingId === selected.id ? <><Spinner /> Deleting...</> : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>Delete</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#4a0000,#8B0000)" }}>
              <div>
                <h2 className="text-white font-bold text-lg">Edit User</h2>
                <p className="text-red-200 text-xs mt-0.5">Update profile details</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="text-red-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              {[
                { field: "name",   label: "Full Name",     type: "text",  placeholder: "Enter full name"  },
                { field: "email",  label: "Email Address", type: "email", placeholder: "Enter email"      },
                { field: "mobile", label: "Mobile Number", type: "tel",   placeholder: "Enter mobile"     },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
                  <input
                    type={type}
                    value={editForm[field]}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-gray-50 outline-none transition focus:bg-white"
                    onFocus={(e) => e.target.style.borderColor = "#8B0000"}
                    onBlur={(e)  => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              ))}
              {actionError && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{actionError}</p>}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setEditOpen(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold py-2.5 rounded-lg transition">
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={updateLoadingId === selected?.id}
                className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#8B0000" }}
                onMouseEnter={(e) => { if (!updateLoadingId) e.currentTarget.style.background = "#a80000"; }}
                onMouseLeave={(e) => { if (!updateLoadingId) e.currentTarget.style.background = "#8B0000"; }}
              >
                {updateLoadingId === selected?.id ? <><Spinner /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Delete User?</h3>
              <p className="text-gray-500 text-sm mt-2">
                Are you sure you want to delete <span className="font-semibold text-gray-700">{deleteTarget.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold py-2.5 rounded-lg transition">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleteLoadingId === deleteTarget.id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {deleteLoadingId === deleteTarget.id ? <><Spinner /> Deleting...</> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}