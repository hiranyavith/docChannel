import { useEffect, useState } from "react";
import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { MdPerson } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/DocBookReuseCom/Dropdown";
import axios from "axios";
import { CiUser } from "react-icons/ci";

function UserProfile() {
  const [isAppointment, setIsAppointmet] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const navigate = useNavigate();
  const [isSignedUpComplete, setIsSignedUpComplete] = useState(true);
  const { user, logout, isAuthenticated, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [accountStatus, setIsaccountStatus] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    mobileCode: "+94",
    mobileNumber: "",
    email: "",
    nicNo: "",
    address: "",
    country: "",
    state: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
    fetchAppointments();
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) {
        setError("User Information not availbale");
        return;
      }
      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUserData(data.user);
        console.log(data);

        // Pre-fill form data
        const mobile = data.user.mobile || "";
        const mobileCode = mobile.substring(0, 3) || "+94";
        const mobileNumber = mobile.substring(3) || "";

        setIsaccountStatus(data.user.status_type);

        setFormData({
          fullName: data.user.initial_with_name || "",
          firstName: data.user.f_name || "",
          lastName: data.user.l_name || "",
          mobileCode: mobileCode,
          mobileNumber: mobileNumber,
          email: data.user.email || "",
          nicNo: data.user.nic_no || "",
          address: data.user.address || "",
          country: data.user.country || "",
          state: data.user.state || "",
          city: data.user.city_name || "",
        });
        setCity(data.user.city_city_id || "");
        setDistrict(data.user.district_district_id || "");
        setProvince(data.user.province_province_id || "");
      } else {
        setError(data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setIsLoadingAppointments(true);
      const response = await axios.get(
        "http://localhost:5000/api/appointments/user-appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setAppointments(response.data.appointments);
        console.log(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/update-profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setUserData((prev) => ({
          ...prev,
          profile_image: response.data.image,
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <HeaderDocChannel Title={"User Profile"} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72A6BB]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <HeaderDocChannel Title={"User Profile"} />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button
              onClick={fetchUserProfile}
              className="mt-4 bg-[#72A6BB] text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="p-3 sm:p-4 md:p-6">
        <HeaderDocChannel Title={"User Profile"} />

        <div className="py-5">
          <div className="flex md:flex-row flex-col gap-2 p-2 bg-[#D9D9D9]/42 rounded-2xl items-center justify-around">
            <div className="flex flex-col gap-3 p-2 items-center">
              {userData?.profile_image ? (
                <img
                  src={userData.profile_image}
                  alt="Profile"
                  className="object-cover object-center rounded-full w-[200px] h-[200px]"
                />
              ) : (
                <div className="flex items-center justify-center rounded-full w-[200px] h-[200px] bg-gray-200">
                  <CiUser size={80} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                id="profileImageInput"
                onChange={handleUpdateProfile}
              />
              <div className="flex w-full p-2 bg-[#72A6BB] rounded-2xl">
                <button
                  className="font-nunito font-bold text-white px-3"
                  onClick={() =>
                    document.getElementById("profileImageInput").click()
                  }
                >
                  Change Profile Image
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
                <div className="flex flex-col gap-1 justify-start">
                  <label className="font-nunito font-bold">Name</label>
                  <span className="font-nunito font-semibold">
                    {" "}
                    {user?.fullName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 justify-start">
                  <label className="font-nunito font-bold">Email</label>
                  <span className="font-nunito font-semibold">
                    {user?.email || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex w-full bg-[#FF002F] rounded-2xl justify-center items-center p-4">
                <button
                  className="font-nunito text-white font-bold"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <Accordion className="">
              <AccordionItem
                header="Profile Information"
                className={"font-nunito font-bold text-black p-2"}
              >
                <div className="grid md:grid-cols-2 grid-cols-1 p-4 gap-4">
                  <div className="flex w-full gap-2 flex-col">
                    <label htmlFor="" className="font-nunito font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      id=""
                      className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
                    />
                  </div>
                  <div className="flex w-full gap-2 flex-col">
                    <label htmlFor="" className="font-nunito font-semibold">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      id=""
                      className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
                    />
                  </div>
                  <div className="flex w-full gap-2 flex-col">
                    <label htmlFor="" className="font-nunito font-semibold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      id=""
                      className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
                    />
                  </div>
                  <div className="flex w-full gap-2 flex-col">
                    <label
                      htmlFor="mobile-code"
                      className="font-nunito font-semibold"
                    >
                      Mobile
                    </label>
                    <div className="flex flex-row gap-3 w-full">
                      <input
                        type="text"
                        name="mobileCode"
                        value={formData.mobileCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        id="mobile-code"
                        placeholder="+94"
                        className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none w-20"
                      />
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        id="mobile-number"
                        placeholder="712345678"
                        className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex w-full gap-2 flex-col">
                    <label htmlFor="" className="font-nunito font-semibold">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      id=""
                      className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
                    />
                  </div>
                  <div className="flex w-full gap-2 flex-col">
                    <label htmlFor="" className="font-nunito font-semibold">
                      NIC No
                    </label>
                    <input
                      type="text"
                      name="nicNo"
                      value={formData.nicNo}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      id=""
                      className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
                    />
                  </div>
                  <div className="flex w-full gap-2 flex-col">
                    <label htmlFor="" className="font-nunito font-semibold">
                      Status
                    </label>
                    <input
                      type="text"
                      name=""
                      value={accountStatus}
                      id="account-status"
                      className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
                      disabled={true}
                    />
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="pt-5">
            <Accordion className="">
              <AccordionItem
                header="Address Information"
                className={"font-nunito font-bold text-black p-2"}
              >
                <div className="flex flex-col gap-2 w-full p-2">
                  <label htmlFor="">Address</label>
                  <textarea
                    name=""
                    id=""
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 p-4 gap-4">
                  <div className="flex flex-col gap-2 w-full p-2">
                    <Dropdown
                      label="City"
                      type="cities"
                      value={city}
                      OnChange={(e) => {
                        setCity(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }));
                      }}
                      disabled={!isEditing || !state}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full p-2">
                    <Dropdown
                      label="District"
                      type="district"
                      value={district}
                      OnChange={(e) => {
                        setDistrict(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          district: e.target.value,
                        }));
                      }}
                      disabled={!isEditing || !state}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full p-2">
                    <Dropdown
                      label="Province"
                      type="provinces"
                      value={province}
                      OnChange={(e) => {
                        setProvince(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          province: e.target.value,
                        }));
                      }}
                      disabled={!isEditing || !state}
                    />
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="pt-5">
            <Accordion className="">
              <AccordionItem
                header="Appointment Information"
                className={"font-nunito font-bold text-black p-2"}
              >
                <div className="pt-3">
                  {isLoadingAppointments ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#72A6BB]"></div>
                    </div>
                  ) : appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <div className="pt-3">
                        <div
                          className="flex w-full md:flex-row flex-col bg-[#D9D9D9]/32 p-3 items-center gap-4 rounded-lg justify-between"
                          key={appointment.appointment_id}
                        >
                          <div className="flex-shrink-0 bg-gray-400 rounded-full p-3">
                            <MdPerson className="w-30 h-30" color="white" />
                          </div>

                          <div className="flex flex-col gap-2 items-center md:items-start">
                            <span className="font-medium text-[#FF002F]/47 font-nunito">
                              DR {appointment.f_name.toUpperCase()}{" "}
                              {appointment.l_name.toUpperCase()}
                            </span>
                            <span className="text-gray-600 text-sm font-nunito">
                              {appointment.speciality_type}
                            </span>
                            <div className="flex pt-3 flex-col">
                              <span className="text-xs font-nunito">
                                {appointment.date_part}
                              </span>
                              <span className="text-xs font-nunito">
                                {appointment.time_part}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 items-center">
                            <span className="font-medium font-nunito">
                              Patient Number
                            </span>
                            <span className=" text-[#FF002F]/47 text-sm">
                              {appointment.queue_number}
                            </span>
                          </div>
                          <div className="flex flex-col gap-3 items-center">
                            <div className="w-full bg-[#FF7B7B] p-3 rounded-lg">
                              <span className="text-white font-nunito font-semibold">
                                Make A Refund
                              </span>
                            </div>
                            <div className="w-full bg-[#7B8AFF] p-3 rounded-lg">
                              <span className="text-white font-nunito font-semibold">
                                More Details
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex w-full bg-gray-100 p-3 items-center justify-center rounded-lg">
                      <span className="text-gray-500">
                        No appointment scheduled
                      </span>
                    </div>
                  )}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
