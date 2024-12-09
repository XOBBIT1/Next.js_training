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
          <h3>Вы не авторизованы. Пожалуйста, войдите в систему.   
            <Link href="/loging">  Login</Link></h3>
        </div>
      )}
    </div>
  );
}

const Header = ({ user }) => (
  <header className="header">
    <div className="header_box">
      <h1>Task Management System</h1>
    </div>
    <nav className="navbar">
      <ul className="nav-links">
        {user ? (
          <>
            <li>
              <Link href="/user" className="nav-link">
                {user.username}
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/loging" className="nav-link">
                Login
              </Link>
            </li>
            <li>
              <Link href="/registration" className="nav-link">
                Sign in
              </Link>
            </li>
          </>
        )}
        <li>
          <Link href="/" className="nav-link">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  </header>
);