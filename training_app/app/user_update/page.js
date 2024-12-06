"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditTaskPage() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

        const res = await fetch(`http://127.0.0.1:8000/api/protected/users/get_user_by_id/`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Ошибка при загрузке задачи");
        }

        const data = await res.json();
        setUser(data);
        console.log(data);
      } catch (err) {
        setError(err.message || "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Добавлен массив зависимостей

  const handleUpdate = async (updatedUser) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Токен не найден");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await fetch(`http://127.0.0.1:8000/api/protected/users/update_user/`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updatedUser),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Ошибка при обновлении задачи");
      }

      alert("Профиль обновлен успешно!");
      router.push(`/user/`);
    } catch (err) {
      setError(err.message || "Произошла ошибка");
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Редактирование профиля: {user?.name || "Пользователь"}</h1>
      {user && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const updatedTask = {
              name: e.target.name.value,
              username: e.target.username.value,
              email: e.target.email.value, // Исправлено
            };
            handleUpdate(updatedTask);
          }}
        >
          <label>
            Имя:
            <input type="text" name="name" defaultValue={user.name} />
          </label>
          <br />
          <label>
            Имя пользователя:
            <input type="text" name="username" defaultValue={user.username} />
          </label>
          <br />
          <label>
            Почта:
            <input type="text" name="email" defaultValue={user.email} />
          </label>
          <br />
          <button type="submit">Сохранить</button>
        </form>
      )}
    </div>
  );
}
