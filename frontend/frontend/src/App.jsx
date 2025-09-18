import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";
import Alerts from "./components/alert";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/profile";
import WeatherByLocation from "./components/weatherbylocation";
import Assistant from "./pages/ai-integration/assistant";
import GovernmentDataPage from "./pages/governmentdata";
import Prediction from "./pages/prediction";
import ChecklistPage from "./components/checklistpage";
import EarthquakeAlert from "./pages/earthquakealert";
import CollectorAlerts from "./pages/collectoralerts";

const App = () => {
  return (
    <Router>
      <EarthquakeAlert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path="/check-wether" element={<WeatherByLocation/>} />
        <Route path='/assistant' element={<Assistant/>}></Route>
        <Route path="/gov-data" element={<GovernmentDataPage/>}></Route>
        <Route path="/predict-disaster" element={<Prediction/>}></Route>
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/collector-alerts" element={<CollectorAlerts />} />
      </Routes>
    </Router>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#0077b6",
    color: "#fff"
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold"
  },
  link: {
    color: "#fff",
    marginLeft: "20px",
    textDecoration: "none",
    fontSize: "1rem"
  }
};

export default App;
