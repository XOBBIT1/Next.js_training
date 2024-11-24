"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false); // Инициализация состояния
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Флаг для клиентского рендера
  }, []);

  // Асинхронная функция для получения данных
  const tasksData = async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Токен не найден');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const res = await fetch('http://127.0.0.1:8000/api/protected/tasks/get_all_tasks/', {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const result = await res.json();
        setTasks(result.tasks || []); // Обновляем задачи
      } else {
        setError('localStorage не доступен');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false); // Завершение загрузки
    }
  };

  useEffect(() => {
    if (isClient) {
      tasksData(); // Загружаем данные только на клиенте
    }
  }, [isClient]); // Добавляем зависимость от isClient

  if (!isClient) return null; // Рендерим только на клиенте
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="add_task">
        <button>Добавить задачу</button>
      </div>
      <div className="tasks_boks">
        <h1 className="box_header">Задачи</h1>
        {tasks.map((task) => (
          <div className="box" key={task.id}>
            <div className="add_task">
              <button onClick={() => router.push(`/task/${task.id}`)}>Подробнее</button>
            </div>
            <h2>{task.task_name}</h2>
            <p>Статус: {task.status}</p>
            <p>Приоритет: {task.priority}</p>
            <div className="add_task">
              <button onClick={() => handleDelete(task.id)}>Удалить задачу</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
