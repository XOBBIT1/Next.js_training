"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter(); // Хук для навигации

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Отправка запроса на сервер
      const response = await fetch('http://127.0.0.1:8000/api/protected/users/forgot_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Не удалось отправить письмо для восстановления.');
        setLoading(false);
        return;
      }

      setMessage('Код для восстановления пароля отправлена на ваш email.');
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Восстановление пароля</h1>
      <form onSubmit={handleForgotPassword}>
        <div>
          <label htmlFor="email">Введите ваш email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email"
            required
          />
        </div>
        <button onClick={() => router.push(`/reset_password/`)} type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Отправить'} 
        </button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
