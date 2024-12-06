"use client";

import Link from 'next/link'
import React from 'react'
import { useState, useEffect } from "react";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const userRes = await fetch(`http://127.0.0.1:8000/api/protected/users/get_user_by_id/`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!userRes.ok) {
          throw new Error("Ошибка при загрузке данных пользователя");
        }

        const userData = await userRes.json();
        setUser(userData);
      } catch {
        setUser(null); // Пользователь не авторизован
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header user={user} />
      {user ? (
        <p></p>
      ) : (
        <div className="box_header">
          <h1>Вы не авторизованы. Пожалуйста, войдите в систему.   
            <Link href="/loging"> -----Login</Link></h1>
        </div>
      )}
    </div>
  );
}

const Header = ({ user }) => (
  <header>
    <div className="header_box">
      {user ? (
        <Link href="/user">{user.username}</Link>
      ) : (
        <span>{/* Если user нет, просто пустое место */}</span>
      )}
      <h1>Task management system</h1>
    </div>
    <nav>
      <Link href="/">Home</Link>
      {!user && (
        <>
          <Link href="/loging">Login</Link>
          <Link href="/registration">Sign in</Link>
        </>
      )}
    </nav>
  </header>
);