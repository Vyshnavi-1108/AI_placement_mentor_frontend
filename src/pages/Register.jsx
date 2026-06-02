import { useState } from "react";
import api from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      const response = await api.post("/api/auth/register", formData);

      alert(response.data.message);
    } catch (error) {
      console.log(error);

      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <button className="bg-blue-600 w-full p-3 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
