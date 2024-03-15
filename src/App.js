import React, { useState } from "react";
import Header from "./Header";
import MyChart from "./Chart";
import WelcomePage from "./WelcomePage";
import Login from "./Login";
import SignUp from "./SignUp";


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  // const registerUsername = (username) => {
  //   Cookies.set("username", username);
  // }

  return (
    <Router>
      <div className="App">
        <Header onMenuItemClick={setSelectedMenuItem} />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/chart" element={<MyChart selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

