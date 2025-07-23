import * as Yup from 'yup';

export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .required("Ім'я обов'язкове"),
  email: Yup.string()
    .email('Невірний формат email')
    .required('Email обов’язковий'),
  password: Yup.string()
    .min(6, 'Пароль повинен містити мінімум 6 символів')
    .required('Пароль обов’язковий'),
});
