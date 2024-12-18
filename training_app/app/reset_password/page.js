"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [secure_code, setSecureCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirm_password) {
      setError('Пароли не совпадают.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/protected/users/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secure_code, password, confirm_password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Не удалось установить новый пароль.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessage(data.message || 'Пароль успешно изменен!');
      setTimeout(() => {
        router.push('/loging'); // Перенаправление на страницу входа
      }, 2000);
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='wrapper'>
      <h1>Восстановление пароля</h1>
      <form  className="base_form" onSubmit={handleResetPassword}>
        <div>
          <input
            type="text"
            id="secure_code"
            value={secure_code}
            onChange={(e) => setSecureCode(e.target.value)}
            placeholder="Введите ваш код доступа"
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите ваш пароль"
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="confirm_password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите пароль"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Отправить'}
        </button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
