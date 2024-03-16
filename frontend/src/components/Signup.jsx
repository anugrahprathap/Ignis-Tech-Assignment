import Logo from "./Logo";
import React, { useState } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    // confirmEmail: "",
    first_name: "",
    last_name: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    username: "",
    confirmEmail: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  
  // Define validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().email('Invalid email address').required('Email is required'),
    confirmEmail: Yup.string().oneOf([Yup.ref('username'), null], 'Emails must match').required('Confirm Email is required'),
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });
const navigate = useNavigate();
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prevData => ({
    ...prevData,
    [name]: value
  }));
  // Clear errors when user starts typing
  
};

  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await validationSchema.validate(formData, { abortEarly: false }); // Validate form data
    const response = await axios.post("http://127.0.0.1:8000/api/signup/", formData);
    if (response.status === 201) {
      const token = response.data.token;
      localStorage.setItem("token", token);
      alert('User Created Successfully');
      navigate('/');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Yup validation error
      const yupErrors = {};
      error.inner.forEach((err) => {
        yupErrors[err.path] = err.message;
      });
      setErrors(yupErrors);
    } else if (error.response && error.response.status === 400) {
      // Server validation error

      setErrors({'username':error.response.data.error});
      console.log(error.response.data)
    } else {
      console.error("Signup error:", error);
      // Handle other errors if needed
    }
  }
};

return (
  <div className="login container-fluid">
    <div className="login-content">
      <div className="login-split-content">
        <a href="/"><Logo /></a>
        <h1 style={{ fontWeight: '1000', fontSize: '50px', color: '#39364F' }} className="mb-4">Create an account</h1>
        <form onSubmit={handleSubmit}>
          <div className="container">
          
            <input
              type="text"
              name="username"
              placeholder="Email address"
              className="input form-control mt-3"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-danger" style={{fontSize:'small'}}>{errors.username}</p>}

            <input
              type="text"
              name="confirmEmail"
              placeholder="Confirm Email address"
              className="input form-control mt-3"
              value={formData.confirmEmail}
              onChange={handleChange}
            />
            {errors.username && <p className="text-danger" style={{fontSize:'small'}}>{errors.username}</p>}

            <div className="row">
              <div className="col">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  style={{ height: '60px', padding: '12px', borderRadius: '0' }}
                  className="form-control mt-3"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              {errors.first_name && <p className="text-danger" style={{fontSize:'small'}}>{errors.first_name}</p>}

              </div>
              <div className="col">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  style={{ height: '60px', padding: '12px', borderRadius: '0' }}
                  className="form-control mt-3"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              {errors.last_name && <p className="text-danger" style={{fontSize:'small'}}>{errors.last_name}</p>}
              </div>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input form-control mt-3"
              value={formData.password}
              onChange={handleChange}
            />
           {errors.password && <p className="text-danger" style={{fontSize:'small'}}>{errors.password}</p>}

            <button type="submit" className="submit mt-3 mb-4">Continue</button>
          </div>
        </form>
        <button type="submit" className="google form-control mb-2">
          <div className="img"></div>
          Sign up with Google
        </button>
        <span className="mt-3">
          Existing user ? <a href="/login" className="text-decoration-none">login</a>
        </span>
      </div>
    </div>
    <div className="login-image"></div>
  </div>
);
};

export default Signup;
