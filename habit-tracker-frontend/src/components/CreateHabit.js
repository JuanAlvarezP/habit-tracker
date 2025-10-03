import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateHabit = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("Diaria");
  const [reminderTime, setReminderTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Obtener el token de autenticación del almacenamiento local
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You must be logged in to create a habit.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/habits/",
        {
          name,
          description,
          frequency,
          reminder_time: reminderTime || null, // Envía null si el campo está vacío
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      setSuccess("Habit created successfully!");
      console.log("Habit created:", response.data);
      setName("");
      setDescription("");
      setFrequency("Diaria");
      setReminderTime("");
      navigate("/habits"); // Redirige a la lista de hábitos
    } catch (err) {
      if (err.response && err.response.data) {
        // Muestra un error específico de la API si existe
        setError(Object.values(err.response.data)[0][0]);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="create-habit-container">
      <h2>Crear un nuevo hábito</h2>
      <p>Construye una mejor versión de ti, un hábito a la vez.</p>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-group">
          <label htmlFor="habit-name">Nombre del hábito</label>
          <input
            type="text"
            id="habit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="habit-description">Descripción (opcional)</label>
          <textarea
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="habit-frequency">Frecuencia</label>
            <select
              id="habit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="Diaria">Diaria</option>
              <option value="Semanal">Semanal</option>
              <option value="Mensual">Mensual</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="habit-reminder">Recordatorio</label>
            <input
              type="time"
              id="habit-reminder"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/habits")}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button type="submit" className="save-button">
            Guardar Hábito
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHabit;
