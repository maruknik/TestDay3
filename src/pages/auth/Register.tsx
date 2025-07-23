import { useState } from 'react';
import RegisterForm from './RegisterForm';
import { register } from '../../services/authService';
import type { RegisterFormValues } from '../../types/types';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: any) => {
    setStatusMessage('');
    try {
      await register(values.email, values.password, values.name);
      setStatusMessage('Підтвердіть email для входу');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setStatusMessage(error.message || 'Щось пішло не так');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <RegisterForm onSubmit={handleSubmit} statusMessage={statusMessage} />
    </div>
  );
}
