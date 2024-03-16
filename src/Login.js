import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import Cookies from 'js-cookie';

import 'bootstrap/dist/css/bootstrap.min.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const formData = new FormData();

  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  const apiUrl = 'http://localhost:8000/login.php';

  const onRegisterSelected =() => {
    navigate("/auth/signup");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform authentication logic here
    console.log('Email:', email);
    console.log('Password:', password);

    formData.append('email', email);
    formData.append('password', password);
    formData.append('action', 'login'); // Action for login

    fetch(apiUrl, requestOptions)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Handle the response data
        console.log(data);
        if (data.success) {
          Cookies.set("email", data["email"]);
          Cookies.set("username", data["username"]);
          navigate("/");          
        } else {
            alert(data.message); // Show error message
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Reset form fields
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Authorization Form</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block p-2">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

