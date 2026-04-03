import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-150 focus:bg-white";

  const focusBorder = (e) => { e.target.style.borderColor = "#8B0000"; };
  const blurBorder  = (e) => { e.target.style.borderColor = "#e5e7eb"; };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #4a0000 0%, #8B0000 50%, #4a0000 100%)" }}
    >
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "#ff4444" }} />
      <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: "#ff4444" }} />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-7 text-center" style={{ background: "linear-gradient(135deg, #4a0000, #8B0000)" }}>
            <div className="text-4xl mb-2">💍</div>
            <h1 className="text-white text-2xl font-bold tracking-tight">BandhanSetu</h1>
            <p className="text-red-200 text-xs tracking-widest uppercase mt-1 font-medium">Admin Portal</p>
          </div>

          <div className="px-8 py-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-1">Create Account</h2>
            <p className="text-gray-400 text-sm mb-6">Register as an admin user</p>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-5 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-semibold">Registration Successful!</p>
                <p className="text-xs text-green-500 mt-1">Redirecting to login…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Full Name", name: "name", type: "text", placeholder: "Your full name" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com" },
                  { label: "Password", name: "password", type: "password", placeholder: "Min 6 characters" },
                  { label: "Confirm Password", name: "confirm", type: "password", placeholder: "Repeat password" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name} className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className={inputClass}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                    {errors[name] && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full text-white font-semibold py-2.5 rounded-lg transition-all duration-150 active:scale-[0.98] mt-2"
                  style={{ background: "#8B0000" }}
                  onMouseEnter={e => e.target.style.background = "#a80000"}
                  onMouseLeave={e => e.target.style.background = "#8B0000"}
                >
                  Create Account
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-400 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: "#8B0000" }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}