import { useNavigate } from "react-router-dom";
import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import { useState } from "react";

function AdminSignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/loginadmin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      // const text = await response.text();
      console.log(data);

      if (!response.ok) {
        setError(data.message || "Login failed");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));

      navigate("/admin-panel");
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="p-8">
        <HeaderDocChannel Title={"Admin Sign In"} />
        <div className="pt-[60px]">
          <div className="flex justify-center items-center">
            <span className="font-nunito font-semibold text-2xl">
              Admin Sign In
            </span>
          </div>
        </div>
        <div className="pt-5">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl bg-white rounded-xl borde">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label className="block text-lg mb-2 font-nunito font-semibold">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-200 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-lg mb-2 font-nunito font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-200 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder=""
                  />
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#9EC1CC] hover:bg-[#86AFBC] text-black font-semibold px-10 py-3 rounded-lg transition w-full"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSignIn;
