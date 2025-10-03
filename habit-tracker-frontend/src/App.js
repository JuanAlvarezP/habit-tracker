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

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  🎯 Habit Tracker
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {!authToken ? (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link to="/register" className="btn-primary text-sm">
                      Registrarse
                    </Link>
                    <Link to="/create-habit">Crear Hábito</Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      setAuthToken(null);
                    }}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
              element={
                authToken ? (
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Mis Hábitos
                    </h2>
                    <p className="text-gray-600">
                      ¡Bienvenido a tu sistema de seguimiento de hábitos!
                    </p>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/create-habit"
              element={authToken ? <CreateHabit /> : <Navigate to="/login" />}
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
