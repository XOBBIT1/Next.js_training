"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TaskStatus from "./components/TaskStatus";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("new"); // Категория
  const [searchQuery, setSearchQuery] = useState(""); // Строка поиска
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
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
      setError(" ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchTasksWithSubscribers();
    }
  }, [isClient]);

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

      const res = await fetch(
        `http://127.0.0.1:8000/api/protected/tasks/subscribe_on_task/${taskId}`,
        {
          method: "POST",
          headers,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Ошибка при подписке на задачу");
      }

      alert("Вы подписались на задачу!");
      router.push(`/`);
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

  if (!isClient) return null;
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  // Фильтрация задач по категориям
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      currentCategory === "all" ||
      (currentCategory === "new" && task.status === "Новая задача") ||
      (currentCategory === "in_progress" && task.status === "В разработке") ||
      (currentCategory === "completed" && task.status === "Выполненная задача");

    const matchesSearch =
      searchQuery.trim() === "" ||
      task.task_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });


  return (
    <div className="tasks_boks">
      <form>
        <input
          id="search"
          type="text"
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-white font-sembold outline-none p-5 ml-5 mt-10 w-4/5 rounded-md bl-black"
          autoComplete="off"
        />
        <button id="add-button" onClick={() => router.push(`/task/create`)}>Добавить задачу</button>
      </form>
      <h1 className="box_header">Задачи</h1>
      <div className="categories">
        <button className="nuv-button" onClick={() => setCurrentCategory("all")}>Все задачи задачи</button>
        <button className="nuv-button" onClick={() => setCurrentCategory("new")}>Новые задачи</button>
        <button className="nuv-button" onClick={() => setCurrentCategory("in_progress")}>
          В разработке
        </button>
        <button className="nuv-button" onClick={() => setCurrentCategory("completed")}>
          Выполненные задачи
        </button>
      </div>
      <div className="tasks_boks">
        {filteredTasks.map((task) => (
          <div className="box" key={task.id}>
            <div className="add_task">
              <button className="use-button" onClick={() => router.push(`/task/${task.id}`)}>
                Подробнее
              </button>
            </div>
            <div className="task-card-header">
              <h2>{task.task_name}</h2>
              <TaskStatus status={task.status} />
            </div>
            <p className="task-priority">Приоритет: {task.priority}</p>
            <div className="task-subscribers">
              <h3>Подписчики:</h3>
              {task.subscribers.length > 0 ? (
                <ul>
                  {task.subscribers.map((subscriber, index) => (
                    <li key={index}>
                      <Link href={"/user"}>{subscriber.username}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Нет подписчиков</p>
              )}
            </div>
            <div className="add_task">
              <button className="use-button" onClick={() => handleDelete(task.id)}>Удалить задачу</button>
              <button className="use-button" onClick={() => handleSubscrib(task.id)}>
                Подписаться на задачу
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
