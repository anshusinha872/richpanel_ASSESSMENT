import React, { useState } from "react";
import "./Login.css";
import apiService from "../util/Api";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
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
    if (!formData.email || !formData.password) {
      alert("Please fill in both email and password.");
      return;
    }
    try {
      const response = await apiService.post("/login", formData);
      if (response.statusCode === 200) {
        localStorage.setItem("token", response.data);
        navigate("/home");
      }
    } catch (error) {}
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="form-container">
        <div className="header-container my-3">
          <div>Login to your account</div>
        </div>
        <form onSubmit={handleSubmit} className="form-input-container">
          <div className="form-group my-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="email"
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
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </div>
          <div className="register-link d-flex my-3 justify-content-center">
            <div>New to Myapp?</div>
            <a href="/register" className="mx-1">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
