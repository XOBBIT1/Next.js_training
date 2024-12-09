"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import TaskStatus from "@/app/components/TaskStatus";

export default function EditTaskPage() {
  const { task_id } = useParams(); // Получаем ID из маршрута
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Токен не найден");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const res = await fetch(`http://127.0.0.1:8000/api/protected/tasks/get_task_by_id/${task_id}/`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Ошибка при загрузке задачи");
        }

        const data = await res.json();
        setTask(data);
      } catch (err) {
        setError(err.message || "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [task_id]);


  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div className="box" key={task.id}>
          <h2>{task.task_name}</h2>
          <div className="add_task">
            <button onClick={() => router.push(`/edit/${task_id}`)}>Редактировать задачу</button>
          </div>
          <p>{task.task_descriptions}</p>
          <TaskStatus status={task.status} />
          <p>{task.priority}</p>
      </div>
  );
}