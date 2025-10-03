import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setAuthToken={setAuthToken} />}
          />
          <Route
            path="/habits"
            element={
              authToken ? <div>Habits Page</div> : <Navigate to="/login" />
            }
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
