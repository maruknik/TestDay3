import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setSession, updatePassword } from '../../services/authService';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let accessToken = searchParams.get('access_token');
    let refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      accessToken = hashParams.get('access_token') || accessToken;
      refreshToken = hashParams.get('refresh_token') || refreshToken;
    }

    if (!accessToken || !refreshToken) {
      setMessage('Токен не знайдено, перейдіть на сторінку логіну.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    setSession(accessToken, refreshToken).catch(() => {
      setMessage('Невірний або прострочений токен. Перенаправлення на логін...');
      setTimeout(() => navigate('/login'), 3000);
    });
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage('Пароль має бути не менше 6 символів');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setMessage('Пароль успішно змінено. Перенаправляємо...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Зміна пароля
        </h2>
        <input
          type="password"
          placeholder="Новий пароль"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {message && (
          <p className="text-center text-sm text-green-600 dark:text-green-400">{message}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition"
        >
          {loading ? 'Змінюємо...' : 'Змінити пароль'}
        </button>
      </form>
    </div>
  );
}
