import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Вхід</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {error && <p className="text-center text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
        >
          Увійти
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
          >
            Реєстрація
          </button>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded"
          >
            Забули пароль?
          </button>
        </div>
      </form>
    </div>
  );
}
