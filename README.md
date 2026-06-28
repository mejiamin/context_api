## Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

---

## Технологии

- React
- Vite
- TypeScript
- CSS Modules

---

## Context API | 5 уроков

Разбить курс на **5 практических уроков**. Мы пройдем путь от простого проброса данных до оптимизации рендеров в сложных приложениях.

### Вот наш план:

#### Урок 1: Основы и строгая типизация

Как создать контекст, обернуть приложение в `Provider` и получить данные через `useContext`. Мы сразу разберем, как правильно описывать интерфейсы для контекста в TypeScript (включая проблему значения по умолчанию — `null` vs `undefined`).

#### 👉 Урок 2: Динамический контекст и Custom Provider

Как передавать не только статические данные, но и функции для их изменения (например, `theme` и `toggleTheme`). Мы создадим отдельный компонент-провайдер и напишем кастомный хук (например, `useTheme`), чтобы инкапсулировать логику и избежать ошибок типизации в компонентах.

#### Урок 3: Связка Context API + useReducer

Когда `useState` перестает справляться. Мы интегрируем `useReducer` внутрь нашего провайдера для управления сложным состоянием (например, состоянием авторизации или корзины покупок) и типизируем все `actions` и `dispatch`.

#### Урок 4: Оптимизация производительности и рендеров

Главный минус Context API — лишние рендеры всех дочерних компонентов при изменении контекста. Мы разберем, как этого избежать: разделение одного контекста на два (State Context и Dispatch Context) и использование `useMemo`.

#### Урок 5: Финальная практика (с CSS Modules)

Соберем небольшую фичу в твоем окружении, объединив всё вместе. Напишем глобальную систему уведомлений (Toasts) или корзину, стилизованную через твои CSS Modules, чтобы закрепить материал в условиях реального продакшена.

---

## Урок 2: Динамический контекст и Custom Provider

В первом уроке мы передавали статические данные. Но в реальных приложениях данные меняются (пользователь логинится, товары добавляются в корзину, меняется тема оформления).

Когда мы добавляем изменение состояния (`useState`), писать логику прямо в `App.tsx` становится плохой идеей — компонент `App` быстро превратится в свалку. Кроме того, писать `if (!context)` в каждом компоненте, где мы читаем данные, очень утомляет.

Решение: **Custom Provider** (Кастомный провайдер) и **Custom Hook** (Кастомный хук).
Давай разберем это на классическом примере переключения светлой и темной темы.

### Шаг 1: Всё в одном файле (Context, Provider и Hook)

Создай файл `ThemeContext.tsx` в папке `context`. Мы соберем всю логику темы в одном месте.

```tsx
import { createContext, useState, useContext, ReactNode } from 'react';

// 1. Описываем типы
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void; // Функция для изменения стейта
}

// 2. Создаем контекст (экспортировать его больше 
// не нужно, он будет скрыт внутри файла!)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Создаем Custom Provider
// Он будет хранить состояние и отдавать его дочерним компонентам
interface ThemeProviderProps {
  children: ReactNode; // Тип для вложенных компонентов в React
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Создаем Custom Hook для удобного чтения контекста
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // Прячем проверку на undefined внутрь хука!
  // Теперь компоненты будут получать уже 100% валидные данные.
  if (!context) {
    throw new Error(
      'useTheme должен использоваться только внутри ThemeProvider'
    );
  }
  
  return context;
};
```

**В чем магия хука `useTheme`?** Нам больше не нужно импортировать `useContext` и сам `ThemeContext` в наши компоненты. Мы просто вызовем `useTheme()`, и TypeScript сразу поймет, что там есть `theme` и `toggleTheme`.

### Шаг 2: Обертка приложения

Теперь наш `App.tsx` выглядит гораздо чище. Нам не нужно держать тут `useState`.

```tsx
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggler from './components/ThemeToggler';

function App() {
  return (
    // Оборачиваем приложение в наш кастомный провайдер
    <ThemeProvider>
      <div style={{ padding: '20px' }}>
        <h1>Урок 2: Динамический контекст</h1>
        <ThemeToggler />
      </div>
    </ThemeProvider>
  );
}

export default App;

```

### Шаг 3: Используем контекст в компоненте

Создай компонент `ThemeToggler.tsx` и файл стилей `ThemeToggler.module.css`.

**`ThemeToggler.tsx`:**

```tsx
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeToggler.module.css';

export default function ThemeToggler() {
  // Смотри, как чисто! Никаких проверок на undefined.
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`
      ${styles.box} ${theme === 'dark' ? styles.dark : styles.light}
    `}>
      <p>Текущая тема: <strong>{theme}</strong></p>
      <button onClick={toggleTheme} className={styles.button}>
        Переключить тему
      </button>
    </div>
  );
}
```

---

**Твое задание для Урока 2:**

1. Создай `ThemeContext.tsx` с провайдером и хуком.
2. Создай компонент с кнопкой и подключи стили.
3. Оберни `App` в `<ThemeProvider>` и покликай на кнопку — тема должна плавно переключаться!

Паттерн "Кастомный Провайдер + Кастомный Хук" — это **золотой стандарт** работы с Context API в React (ты будешь использовать его в 99% случаев).
