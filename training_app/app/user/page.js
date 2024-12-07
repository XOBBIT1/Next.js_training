"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Токен не найден");
        }
    
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
    
        // Получаем данные пользователя
        const userRes = await fetch(`http://127.0.0.1:8000/api/protected/users/get_user_by_id/`, {
          method: "GET",
          headers,
          credentials: "include",
        });
    
        if (!userRes.ok) {
          throw new Error("Ошибка при загрузке данных пользователя");
        }
    
        const userData = await userRes.json();
    
        // Получаем задачи пользователя
        const tasksRes = await fetch(`http://127.0.0.1:8000/api/protected/users/get_user_tasks/`, {
          method: "GET",
          headers,
          credentials: "include",
        });
    
        if (!tasksRes.ok) {
          throw new Error("Ошибка при загрузке задач пользователя");
        }
    
        const tasksData = await tasksRes.json();
    
        // Обновляем состояние с пользователем и его задачами
        setUser({ ...userData, tasks: tasksData.tasks || [] });
      } catch (err) {
        setError(err.message || "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Этот useEffect выполнится только один раз при монтировании компонента

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  // Проверка, что `user` не равен `null`
  if (!user) return <p>Данные пользователя недоступны</p>;

  return (
    <div className="box" key={user.id}>
      <h1>{user.username}</h1>
      <div className="add_task">
            <button onClick={() => router.push(`/user_update/`)}>Редактировать Профиля</button>
      </div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <h2>Ваши задачи:</h2>
      {user.tasks.length > 0 ? (
        <ul>
          {user.tasks.map((task, index) => (
            <li key={index}><Link href={`/task/${task.id}`}>{task.task_name}</Link></li>
          ))}
        </ul>
      ) : (
        <p>У пользователя нет задач.</p>
      )}
    </div>
  );
}
