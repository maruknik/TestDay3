import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { RegisterFormValues } from '../../types/types';
import { registerValidationSchema } from './validationSchema';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues, formikHelpers: any) => Promise<void>;
  statusMessage: string;
}

export default function RegisterForm({ onSubmit, statusMessage }: RegisterFormProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Реєстрація</h1>

      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={registerValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="name"
                type="text"
                placeholder="Ім'я"
                className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="password"
                type="password"
                placeholder="Пароль"
                className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {statusMessage && (
              <p
                className={`text-center text-sm ${
                  statusMessage.toLowerCase().includes('помилка') ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
            >
              {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-md font-semibold"
            >
              Назад до входу
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
