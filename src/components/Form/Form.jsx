// Form.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Form.css";
import { AuthContext } from "../../AuthContext";

const From = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
  const idRegex = /^\d{5}$/;
  const nameRegex = /^[A-Z][a-zA-Z\s]{2,29}$/;

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", id: "", email: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let error = "";

    if (name === "name" && !nameRegex.test(value)) {
      error =
        "Name must start with an uppercase letter and contain 3-30 letters only.";
    } else if (name === "id" && !idRegex.test(value)) {
      error = "ID must be exactly 5 numeric characters.";
    } else if (name === "email" && !emailRegex.test(value)) {
      error = "Please enter a valid email address.";
    } else if (name === "password" && !passwordRegex.test(value)) {
      error =
        "Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        login(user);
        toast.success(`Login successful! Welcome, ${user.name}.`);
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        toast.error("Invalid email or password.");
      }
    } else {
      if (
        !formData.name ||
        !formData.id ||
        !formData.email ||
        !formData.password
      ) {
        toast.error("All fields are required.");
        return;
      }

      if (Object.values(errors).some((err) => err)) {
        toast.error("Please fix the errors before submitting.");
        return;
      }

      const emailExists = users.some((u) => u.email === formData.email);
      const idExists = users.some((u) => u.id === formData.id);

      if (emailExists) {
        toast.error("This email is already registered.");
        return;
      }

      if (idExists) {
        toast.error("This ID is already registered.");
        return;
      }

      const newUser = {
        name: formData.name,
        id: formData.id,
        email: formData.email,
        password: formData.password,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Registration successful! You can now log in.");
      toggleForm();
    }
  };

  return (
    <div className="login-register-container">
      <div className="form-card">
        <h2 className="form-title">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        <form className="form-content" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>ID</label>
                <input
                  type="text"
                  name="id"
                  placeholder="Enter your ID (5 digits)"
                  value={formData.id}
                  onChange={handleChange}
                />
                {errors.id && <p className="form-error">{errors.id}</p>}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="form-button">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="toggle-button"
              onClick={toggleForm}
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default From;
