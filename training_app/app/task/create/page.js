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
    <div>
      <h1>Создание задачи</h1>
      <form
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
        <label>
          Название задачи:
          <input type="text" name="task_name" defaultValue="" />
        </label>
        <br />
        <label>
          Описание задачи:
          <input type="text" name="task_descriptions" defaultValue="" />
        </label>
        <br />
        <label>
          Статус:
          <select name="status" defaultValue="">
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Приоритет:
          <select name="priority" defaultValue="">
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}
