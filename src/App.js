import React, { useState } from "react";
import Header from "./Header";
import MyChart from "./Chart";
import WelcomePage from "./WelcomePage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  return (
    <Router>
      <div className="App">
        <Header onMenuItemClick={setSelectedMenuItem} />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/chart" element={<MyChart selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

