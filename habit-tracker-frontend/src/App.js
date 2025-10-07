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
import CreateHabit from "./components/CreateHabit";
import EditHabit from "./components/EditHabit";
import HomePage from "./components/HomePage";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  return (
    <Router>
      <div className="min-h-screen bg-background-dark">
        {/* Navigation */}
        <nav className="bg-card-dark shadow-sm border-b border-input-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-foreground-dark">
                  🎯 Habit Tracker
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {!authToken ? (
                  <>
                    <Link
                      to="/login"
                      className="text-subtle-dark hover:text-foreground-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="text-primary hover:text-opacity-80 text-sm font-medium"
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      setAuthToken(null);
                    }}
                    className="text-subtle-dark hover:text-foreground-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
        </main>
      </div>
    </Router>
  );
}

export default App;
