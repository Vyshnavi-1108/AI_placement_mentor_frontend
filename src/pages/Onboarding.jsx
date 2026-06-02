import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

const Onboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    target_role: "",
    skill_level: "",
    weak_areas: "",
    daily_study_hours: "",
    placement_timeline: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post("/api/users/onboarding", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile Saved Successfully");

      navigate("/roadmap");
    } catch (error) {
      console.log(error);

      alert("Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-[500px]"
      >
        <h1 className="text-3xl font-bold mb-6">Placement Profile</h1>

        <input
          name="target_role"
          placeholder="Target Role"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <input
          name="skill_level"
          placeholder="Skill Level"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <input
          name="weak_areas"
          placeholder="Weak Areas"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <input
          name="daily_study_hours"
          placeholder="Daily Study Hours"
          type="number"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <input
          name="placement_timeline"
          placeholder="Placement Timeline (Months)"
          type="number"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <button className="bg-blue-600 p-3 rounded w-full">Save Profile</button>
      </form>
    </div>
  );
};

export default Onboarding;
