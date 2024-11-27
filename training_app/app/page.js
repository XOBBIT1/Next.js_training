"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false); // Инициализация состояния
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Флаг для клиентского рендера
  }, []);

  const fetchTasksWithSubscribers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен не найден");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const tasksRes = await fetch(
        "http://127.0.0.1:8000/api/protected/tasks/get_all_tasks/",
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      if (!tasksRes.ok) {
        throw new Error("Ошибка при получении задач");
      }

      const tasksData = await tasksRes.json();
      const tasksWithSubscribers = await Promise.all(
        tasksData.tasks.map(async (task) => {
          // Загружаем подписчиков для каждой задачи
          const subscribersRes = await fetch(
            `http://127.0.0.1:8000/api/protected/tasks/get_all_subscribers/${task.id}/`,
            {
              method: "GET",
              headers,
              credentials: "include",
            }
          );

          const subscribersData = await subscribersRes.json();
          return { ...task, subscribers: subscribersData.users || [] };
        })
      );

      setTasks(tasksWithSubscribers);
    } catch (err) {
      setError(err.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscrib = async (taskId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Токен не найден");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await fetch(`http://127.0.0.1:8000/api/protected/tasks/subscribe_on_task/${taskId}`, {
        method: "POST",
        headers,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Ошибка при подписке на задачу");
      }

      alert("Вы подписались на задачу!");
      router.push(`/`); // Возвращаемся на страницу списка задач
    } catch (err) {
      setError(err.message || "Произошла ошибка");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const isConfirmed = window.confirm(
        "Вы уверены, что хотите удалить данную задачу?"
      );
      if (!isConfirmed) return;

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Токен не найден");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await fetch(
        `http://127.0.0.1:8000/api/protected/tasks/delete_task/${taskId}/`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Ошибка при удалении задачи");
      }

      alert("Задача удалена успешно!");
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message || "Произошла ошибка");
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchTasksWithSubscribers();
    }
  }, [isClient]);

  if (!isClient) return null;
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="add_task">
        <button onClick={() => router.push(`/task/create/`)}>
          Добавить задачу
        </button>
      </div>
      <div className="tasks_boks">
        <h1 className="box_header">Задачи</h1>
        {tasks.map((task) => (
          <div className="box" key={task.id}>
            <div className="add_task">
              <button onClick={() => router.push(`/task/${task.id}`)}>
                Подробнее
              </button>
            </div>
            <h2>{task.task_name}</h2>
            <p>Статус: {task.status}</p>
            <p>Приоритет: {task.priority}</p>
            <div>
              <h3>Подписчики:</h3>
              {task.subscribers.length > 0 ? (
                 <h5>{task.subscribers.map((subscriber, index) => (
                   <li key={index}><Link href={"/user"}>{subscriber.username}</Link></li>
                 ))}</h5>
              ) : (
                <p>Нет подписчиков</p>
              )}
            </div>
            <div className="add_task">
              <button onClick={() => handleDelete(task.id)}>
                Удалить задачу
              </button>
              <button onClick={() => handleSubscrib(task.id)}>
                Подписаться на задачу
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
