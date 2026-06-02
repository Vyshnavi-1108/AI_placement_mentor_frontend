import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
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
      const response = await api.post("/api/auth/login", formData);

      login(response.data.access_token);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6">Login</h1>

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

        <button className="bg-green-600 w-full p-3 rounded">Login</button>

        <p className="mt-4">
          Don't have an account?
          <Link to="/register" className="text-blue-400 ml-2">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
