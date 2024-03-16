import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "./Logo";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", valid: "" });
  const navigte = useNavigate()
  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email address is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({ email: "", password: "", valid: "" });

    try {
      await schema.validate({ email, password }, { abortEarly: false });
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: email,
        password: password,
      });
      navigte('/');
      const token = response.data.token;
      localStorage.setItem("token", token);
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ valid: "Login failed: invalid email or password" });
      }
    }
  };

  return (
    <div className="login container-fluid">
      <div className="login-content">
        <div className="login-split-content">
          <a href="/"><Logo /></a>
          <h1 style={{ fontWeight: '1000', fontSize: '50px', color: '#39364F' }} className="mb-4">Log in</h1>
          {errors.valid && <p className="text-danger" style={{ fontSize: 'small' }}>{errors.valid}</p>}
          <input type="text" placeholder="Email address" className="form-control input mt-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="text-danger" style={{ fontSize: 'small' }}>{errors.email}</p>}
          <input type="password" placeholder="Password" className="form-control input mt-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p className="text-danger" style={{ fontSize: 'small' }}>{errors.password}</p>}
          <button type="button" className="submit mt-3 mb-4" onClick={handleLogin}>Log in</button>
          <button type="button" className="email form-control">Email me a login link</button>
          <button type="button" className="google form-control"><div className="img"></div>Sign in with Google</button>
          <span className="mt-2">
            New user? <a href="/signup" className="text-decoration-none">Signup</a>
          </span>
        </div>
      </div>
      <div className="login-image"></div>
    </div>
  );
};

export default Login;
