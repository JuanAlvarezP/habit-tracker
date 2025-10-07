import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username: formData.username,
        password: formData.password,
      });
      console.log("User registered:", response.data);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <div className="bg-background-dark font-display">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                  fill="currentColor"
                />
              </svg>
              <h1 className="text-2xl font-bold text-foreground-dark">
                Habit Tracker
              </h1>
            </div>
          </div>

          <div className="bg-card-dark p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-foreground-dark mb-6">
              Crear cuenta
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-subtle-dark"
                  htmlFor="username"
                >
                  Nombre de usuario
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 rounded-DEFAULT bg-background-dark border border-input-dark text-foreground-dark placeholder-subtle-dark focus:ring-primary focus:border-primary"
                    placeholder="Ingresa tu nombre de usuario"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-subtle-dark"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 rounded-DEFAULT bg-background-dark border border-input-dark text-foreground-dark placeholder-subtle-dark focus:ring-primary focus:border-primary"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-subtle-dark"
                  htmlFor="confirm-password"
                >
                  Confirmar Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 rounded-DEFAULT bg-background-dark border border-input-dark text-foreground-dark placeholder-subtle-dark focus:ring-primary focus:border-primary"
                    placeholder="Confirma tu contraseña"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-DEFAULT shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Registrarse
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-subtle-dark">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-opacity-80"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
