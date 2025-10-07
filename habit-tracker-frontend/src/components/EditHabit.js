import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateHabit.css";

const EditHabit = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("Diaria");
  const [reminderTime, setReminderTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHabit = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/habits/${id}/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        const habit = response.data;
        setName(habit.name);
        setDescription(habit.description || "");
        setFrequency(habit.frequency);
        setReminderTime(habit.reminder_time || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching habit:", err);
        setError("No se pudo cargar el hábito.");
        setLoading(false);
        if (err.response && err.response.status === 404) {
          navigate("/habits");
        }
      }
    };

    fetchHabit();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("Debes iniciar sesión para editar un hábito.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/habits/${id}/`,
        {
          name,
          description,
          frequency,
          reminder_time: reminderTime || null,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      setSuccess("¡Hábito actualizado exitosamente!");
      setTimeout(() => navigate("/habits"), 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(Object.values(err.response.data)[0][0]);
      } else {
        setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      }
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-dark text-content-dark">
        <p>Cargando hábito...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-content-dark">
      <header className="border-b border-border-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="text-primary w-6 h-6">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h1 className="text-lg font-bold text-white">Habit Tracker</h1>
            </div>
            <button
              onClick={() => navigate("/habits")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-background-dark hover:bg-primary/20 text-white"
            >
              <svg
                fill="currentColor"
                height="24"
                viewBox="0 0 256 256"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
              Editar hábito
            </h2>
            <p className="mt-2 text-center text-sm text-content-dark text-gray-400">
              Actualiza tu hábito para mantenerlo relevante.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400">
                {success}
              </div>
            )}

            <div className="rounded-lg shadow-sm -space-y-px">
              <div>
                <label className="sr-only" htmlFor="habit-name">
                  Nombre del hábito
                </label>
                <input
                  type="text"
                  id="habit-name"
                  name="habit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nombre del hábito"
                  className="appearance-none rounded-t-lg relative block w-full px-3 py-4 border border-border-dark placeholder-subtle-dark bg-background-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm text-white"
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="description">
                  Descripción (opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción (opcional)"
                  rows="3"
                  className="appearance-none rounded-none relative block w-full px-3 py-4 border border-border-dark placeholder-subtle-dark bg-background-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm text-white"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                <div>
                  <label className="sr-only" htmlFor="frequency">
                    Frecuencia
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                    className="form-select appearance-none rounded-bl-lg relative block w-full px-3 py-4 border border-border-dark bg-background-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm text-white"
                  >
                    <option value="Diaria">Diaria</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensual">Mensual</option>
                  </select>
                </div>
                <div>
                  <label className="sr-only" htmlFor="reminder">
                    Recordatorios
                  </label>
                  <select
                    id="reminder"
                    name="reminder"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="form-select appearance-none rounded-br-lg relative block w-full px-3 py-4 border border-border-dark bg-background-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm text-white"
                  >
                    <option value="">Sin recordatorio</option>
                    <option value="08:00">Al despertar (8:00)</option>
                    <option value="12:00">Mediodía (12:00)</option>
                    <option value="20:00">Por la noche (20:00)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/habits")}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium bg-background-dark text-white hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 focus:ring-offset-background-dark"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-dark"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditHabit;
