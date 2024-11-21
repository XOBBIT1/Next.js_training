"use client";

import { useState, useEffect } from 'react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Асинхронная функция для получения данных
  const tasksData = async () => {
    try {
      // Проверка, доступен ли localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem('access_token');
        console.log(token)
        
        if (!token) {
          setError('Токен не найден');
          return;
        }
        const  headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
        const res = await fetch('http://127.0.0.1:8000/api/protected/tasks/get_all_tasks/', {
          method: 'GET',
          headers: headers,
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const result = await res.json();
        setTasks(result.tasks || []);  // Обновляем состояние задач
      } else {
        setError('localStorage не доступен');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  useEffect(() => {
    tasksData();  // Вызываем асинхронную функцию при монтировании компонента
  }, []); // Пустой массив зависимостей, чтобы запустить один раз при монтировании

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Задачи</h1>
      {tasks.map(task => (
        <div key={task.id}>
          <h2>{task.task_name}</h2>
          <p>{task.task_descriptions}</p>
          <p>{task.status}</p>
          <p>{task.priority}</p>
        </div>
      ))}
    </div>
  );
}
