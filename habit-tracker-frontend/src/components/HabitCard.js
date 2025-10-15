import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HabitCard = ({ habit, onHabitUpdate, onHabitDelete }) => {
  const [isCompleted, setIsCompleted] = useState(habit.is_completed);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Sincronizar estado local con prop cuando cambie
  useEffect(() => {
    setIsCompleted(habit.is_completed);
  }, [habit.is_completed]);

  const handleEdit = () => {
    navigate(`/edit-habit/${habit.id}`);
  };

  const handleToggleComplete = async () => {
    if (isLoading) return;

    setIsLoading(true);
    console.log(
      "Alternando estado del hábito:",
      habit.id,
      "Estado actual:",
      isCompleted
    );

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.patch(
        `http://localhost:8000/api/habits/${habit.id}/toggle_complete/`,
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);

      // Actualizar el estado local y notificar al componente padre
      const newCompletedState = response.data.is_completed;
      const updatedHabit = {
        ...habit,
        is_completed: newCompletedState,
      };

      console.log("Actualizando estado local a:", newCompletedState);
      setIsCompleted(newCompletedState);

      if (onHabitUpdate) {
        console.log("Notificando al componente padre");
        onHabitUpdate(updatedHabit);
      }
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8000/api/habits/${habit.id}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      // Notificar al componente padre para actualizar la lista
      if (onHabitDelete) {
        onHabitDelete(habit.id);
      }

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting habit:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-dark rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              ¿Eliminar hábito?
            </h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar el hábito "{habit.name}"?
              Esta acción no se puede deshacer y se perderán todos los datos
              asociados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <span className="text-gray-300">
                    Recordatorio: {habit.reminder_time}
                  </span>
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
              onClick={() => setShowDeleteModal(true)}
              className="flex-shrink-0 rounded-full p-2 transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/30"
              title="Eliminar hábito"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={handleToggleComplete}
              disabled={isLoading}
              className={`flex-shrink-0 rounded-full p-2 transition-colors ${
                isCompleted
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-primary/20 text-primary hover:bg-primary/30"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              title={
                isLoading
                  ? "Actualizando..."
                  : isCompleted
                  ? "Desmarcar como completado"
                  : "Marcar como completado"
              }
            >
              {isLoading ? (
                <svg
                  className="w-6 h-6 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
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
              )}
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border-dark">
          <div className="flex justify-between text-sm">
            <span className="text-white">Progreso de hoy</span>
            <span className={isCompleted ? "text-green-400" : "text-white"}>
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
    </>
  );
};

export default HabitCard;
