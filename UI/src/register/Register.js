import React, { useState } from "react";
import "./Register.css";
import apiService from "../util/Api";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await apiService.post("/register", formData);
      console.log("Register response: ", response);
      if (response.statusCode === 200) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {}
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="form-container">
        <div className="header-container my-3">
          <div>Create account</div>
        </div>
        <form onSubmit={handleSubmit} className="form-input-container">
          <div className="form-group my-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-3">
            <div className="form-label">Password</div>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="remember"
              id="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label className="form-check-label mx-2" htmlFor="remember">
              Remember me
            </label>
          </div>
          <div className="btn-container my-3">
            <button className="btn btn-primary w-100">Sign Up</button>
          </div>
          <div className="register-link d-flex my-3 justify-content-center">
            <div>Already have an account?</div>
            <a href="/login" className="mx-1">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
