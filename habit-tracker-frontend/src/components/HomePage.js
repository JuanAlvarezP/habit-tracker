import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HabitCard from "./HabitCard";
import Navbar from "./Navbar";

const HomePage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHabits = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/habits/", {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        setHabits(response.data);
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError("Hubo un error al cargar tus hábitos.");
        // Si el token es inválido, redirigir al login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-dark text-content-dark">
        Cargando hábitos...
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-dark">
      <Navbar handleLogout={handleLogout} />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Mis Hábitos</h2>
              {habits.length > 0 && (
                <p className="text-gray-400 text-sm mt-1">
                  Tu progreso de hoy:{" "}
                  {habits.filter((habit) => habit.is_completed).length}/
                  {habits.length} hábitos completados
                </p>
              )}
            </div>
            <Link
              to="/create-habit"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nuevo Hábito
            </Link>
          </div>

          {error && <p className="text-red-400 text-center mb-6">{error}</p>}

          {habits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onHabitUpdate={(updatedHabit) => {
                    setHabits(
                      habits.map((h) =>
                        h.id === updatedHabit.id ? updatedHabit : h
                      )
                    );
                  }}
                  onHabitDelete={(deletedHabitId) => {
                    setHabits(habits.filter((h) => h.id !== deletedHabitId));
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-subtle-dark">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-gray-300 text-lg font-medium text-content-dark mb-2">
                No hay hábitos todavía
              </h3>
              <p className="text-subtle-dark mb-6">
                Comienza creando tu primer hábito para construir una mejor
                rutina.
              </p>
              <Link
                to="/create-habit"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
              >
                Crear mi primer hábito
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
