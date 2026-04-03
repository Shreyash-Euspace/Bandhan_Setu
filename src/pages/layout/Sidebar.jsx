import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/Authslice";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "User Requests",
    to: "/admin/requests",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-red-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-lg">
          💍
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight tracking-tight">BandhanSetu</h1>
          <p className="text-red-300 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="text-red-400 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to + item.label}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-white text-red-800 shadow-sm"
                  : "text-red-100 hover:bg-red-800 hover:bg-opacity-60"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-red-800" : "text-red-300 group-hover:text-white transition"}>
                  {item.icon}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-red-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-red-800 bg-opacity-50 mb-3">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-red-300 text-xs truncate">{user?.email || ""}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-200 hover:bg-red-800 hover:bg-opacity-60 hover:text-white transition-all duration-150"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen shrink-0"
        style={{ background: "linear-gradient(180deg, #6b0000 0%, #8B0000 100%)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside
            className="relative w-64 min-h-screen z-10 flex flex-col"
            style={{ background: "linear-gradient(180deg, #6b0000 0%, #8B0000 100%)" }}
          >
            {/* Close btn */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-red-200 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}