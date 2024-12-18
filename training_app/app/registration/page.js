"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Хук для навигации

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    
    try {
      // Отправка данных на сервер
      const response = await fetch('http://127.0.0.1:8000/api/auth/registration_user/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ email, password, username, name }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
      if (response.ok) {
        router.push("/loging");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка регистрации");
      }
    } catch (err) {
      setError("Произошла ошибка. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='wrapper'>
      <h1 id="base_h1">Registration</h1>
      <form className="base_form" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name='email'
            id="email_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email"
            required></input>
        </div>
        <div>
          <input
            type="text"
            name='name'
            id="name_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите вашe имя"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name='username'
            id="username_input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите ваше имя пользователя"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name='password'
            id="password_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите ваш пароль"
            required
          />
        </div>
        <button type="submit" >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
