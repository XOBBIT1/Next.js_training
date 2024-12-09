"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditTaskPage() {
  const { task_id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  

  const STATUS_OPTIONS = [
    { value: "Новая задача", label: "Новая задача" },
    { value: "В разработке", label: "В разработке" },
    { value: "Выполненная задача", label: "Выполненная задача" },
  ];

  const PRIORITY_OPTIONS = [
    { value: "Низкий", label: "Низкий" },
    { value: "Средний", label: "Средний" },
    { value: "Высокий", label: "Высокий" },
  ];

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

  const handleUpdate = async (updatedTask) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Токен не найден");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await fetch(`http://127.0.0.1:8000/api/protected/tasks/update_task/${task_id}/`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updatedTask),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Ошибка при обновлении задачи");
      }

      alert("Задача обновлена успешно!");
      router.push(`/task/${task_id}/`); // Возвращаемся на страницу списка задач
    } catch (err) {
      setError(err.message || "Произошла ошибка");
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='wrapper'>
      <h2>Меню редактирование задачи</h2>
      <form
        className="base_form"
        onSubmit={(e) => {
          e.preventDefault();
          const updatedTask = {
            task_name: e.target.task_name.value,
            task_descriptions: e.target.task_descriptions.value,
            status: e.target.status.value,
            priority: e.target.priority.value,

          };
          handleUpdate(updatedTask);
        }}
      >
          <input type="text" name="task_name" placeholder="Название задачи " / >
        <br />
          <textarea  
           rows="5" // Количество строк
           cols="50" // Ширина в символах
           type="text" 
           name="task_descriptions"
           placeholder="Описание задачи"/>
        <br />
          <select name="status" defaultValue={task.status}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        <br />
          <select name="priority" defaultValue={task.priority}>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        <br />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}
