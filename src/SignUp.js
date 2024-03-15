import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import Cookies from 'js-cookie';

import 'bootstrap/dist/css/bootstrap.min.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const navigate = useNavigate();

  const formData = new FormData();

  const requestOptions = {
    method: 'POST',
    body: formData
  };

  const apiUrl = 'http://localhost:8000/auth.php';

  const onLoginSelected =() => {
    navigate("/auth/login");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform authentication logic here
    console.log('Username:', username);
    console.log('Password1:', password1);
    console.log('Password2', password2);

    if (password1 != password2) {
      alert("passwords do not match");
      console.log("passwords do not match")
      return;
    }

    formData.append('username', username);
    formData.append('password', password1);
    formData.append('action', 'register'); // Action for login

    fetch(apiUrl, requestOptions)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Handle the response data
        console.log(data);
        // Example: If authentication is successful, redirect to another page
        if (data.success) {
          Cookies.set("username", data["username"]);
          navigate("/");          
        } else {
            alert(data.message); // Show error message
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    setUsername('');
    setPassword1('');
    setPassword2('');
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
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
                <span onClick={onLoginSelected} className="text-primary text-decoration-underline" style={{cursor: "pointer"}}>Or Login instead</span>
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

