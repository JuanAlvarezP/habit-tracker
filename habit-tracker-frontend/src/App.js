import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateHabit from "./components/CreateHabit";
import EditHabit from "./components/EditHabit";
import HomePage from "./components/HomePage";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  return (
    <Router>
      <div className="min-h-screen w-full bg-background-dark">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setAuthToken={setAuthToken} />}
          />
          <Route
            path="/habits"
            element={authToken ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-habit"
            element={authToken ? <CreateHabit /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit-habit/:id"
            element={authToken ? <EditHabit /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Navigate to={authToken ? "/habits" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
