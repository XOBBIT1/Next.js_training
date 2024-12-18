"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CreateTaskPage() {
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

  const handleCreate = async (createdTask) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Токен не найден");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await fetch(`http://127.0.0.1:8000/api/protected/tasks/create_task/`, {
        method: "POST",
        headers,
        body: JSON.stringify(createdTask),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Ошибка при создании задачи");
      }

      alert("Задача создана успешно!");
      router.push(`/`); // Возвращаемся на страницу списка задач
    } catch (err) {
      setError(err.message || "Произошла ошибка");
    }
  };

  return (
    <div className='wrapper'>
      <h2>Создание задачи</h2>
      <form
        className="base_form"
        onSubmit={(e) => {
          e.preventDefault();
          const createdTask = {
            task_name: e.target.task_name.value,
            task_descriptions: e.target.task_descriptions.value,
            status: e.target.status.value,
            priority: e.target.priority.value,
          };
          handleCreate(createdTask);
        }}
      >
          <input type="text" name="task_name" defaultValue="" placeholder="Название задачи"/>
        <br />
          <textarea 
          rows="5" // Количество строк
          cols="50" // Ширина в символах
          type="text" 
          name="task_descriptions" 
          defaultValue="" 
          placeholder="Описание задачи" />
        <br />
          <select name="status" defaultValue="" placeholder="Статус">
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        <br />
          <select name="priority" defaultValue="" placeholder="Приоритет">
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
