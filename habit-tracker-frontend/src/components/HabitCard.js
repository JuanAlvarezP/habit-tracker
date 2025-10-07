import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HabitCard = ({ habit, onHabitUpdate }) => {
  const [isCompleted, setIsCompleted] = useState(habit.is_completed);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-habit/${habit.id}`);
  };

  const handleMarkComplete = async () => {
    if (isCompleted) return;

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.patch(
        `http://localhost:8000/api/habits/${habit.id}/complete/`,
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      // Actualizar el estado local y notificar al componente padre
      const updatedHabit = {
        ...habit,
        is_completed: true,
      };
      setIsCompleted(true);

      if (onHabitUpdate) {
        onHabitUpdate(updatedHabit);
      }
    } catch (error) {
      console.error("Error marking habit as complete:", error);
    }
  };

  return (
    <div className="bg-card-dark rounded-lg shadow-md p-6 transition-all hover:ring-2 hover:ring-primary/50">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={handleEdit}>
          <h3 className="text-lg font-semibold text-white mb-2">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-subtle-dark mb-4">{habit.description}</p>
          )}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-content-dark">
              <svg
                className="w-5 h-5 mr-2 text-subtle-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-400">
                Frecuencia: {habit.frequency}
              </span>
            </div>
            {habit.reminder_time && (
              <div className="flex items-center text-sm text-content-dark">
                <svg
                  className="w-5 h-5 mr-2 text-subtle-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Recordatorio: {habit.reminder_time}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-shrink-0 rounded-full p-2 transition-colors bg-primary/20 text-primary hover:bg-primary/30"
            title="Editar hábito"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className={`flex-shrink-0 rounded-full p-2 transition-colors ${
              isCompleted
                ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                : "bg-primary/20 text-primary hover:bg-primary/30"
            }`}
            title={isCompleted ? "Hábito completado" : "Marcar como completado"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border-dark">
        <div className="flex justify-between text-sm">
          <span className="text-white">Progreso de hoy</span>
          <span
            className={
              isCompleted ? "text-green-400" : "text-content-dark text-white"
            }
          >
            {isCompleted ? "Completado" : "Pendiente"}
          </span>
        </div>
        <div className="mt-2 h-2 bg-background-dark rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-in-out ${
              isCompleted ? "bg-green-500" : "bg-primary"
            }`}
            style={{
              width: isCompleted ? "100%" : "0%",
              transition: "width 500ms ease-in-out",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
