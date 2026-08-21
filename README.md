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

#### Урок 2: Динамический контекст и Custom Provider

Как передавать не только статические данные, но и функции для их изменения (например, `theme` и `toggleTheme`). Мы создадим отдельный компонент-провайдер и напишем кастомный хук (например, `useTheme`), чтобы инкапсулировать логику и избежать ошибок типизации в компонентах.

#### Урок 3: Связка Context API + useReducer

Когда `useState` перестает справляться. Мы интегрируем `useReducer` внутрь нашего провайдера для управления сложным состоянием (например, состоянием авторизации или корзины покупок) и типизируем все `actions` и `dispatch`.

#### Урок 4: Оптимизация производительности и рендеров

Главный минус Context API — лишние рендеры всех дочерних компонентов при изменении контекста. Мы разберем, как этого избежать: разделение одного контекста на два (State Context и Dispatch Context) и использование `useMemo`.

#### 👉 Урок 5: Финальная практика (с CSS Modules)

Соберем небольшую фичу в твоем окружении, объединив всё вместе. Напишем глобальную систему уведомлений (Toasts) или корзину, стилизованную через твои CSS Modules, чтобы закрепить материал в условиях реального продакшена.

---

# Урок 5: Финальная практика (с CSS Modules)

Финал! Система уведомлений (Toasts) — это идеальная задача для Context API.

Уведомления должны вызываться из **любой** точки приложения (например, из корзины или профиля), но при этом отрисовываться на **самом верхнем уровне** (поверх всего контента).

Мы применим знания об оптимизации: наш провайдер будет отдавать только одну функцию `addToast`, и мы обернем её в `useCallback`, чтобы её ссылка никогда не менялась и компоненты не перерисовывались впустую.

## Шаг 1: Создаем контекст и провайдер с логикой

Создай файл `ToastContext.tsx`. Здесь будет всё: типы, контекст, провайдер с состоянием и сам рендер всплывающих окон.

```tsx
import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  ReactNode } from 'react';
import styles from './Toast.module.css';

// 1. Типы для наших уведомлений
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

// 2. В контекст мы передаем ТОЛЬКО функцию добавления. 
// Компонентам не нужно знать обо всех текущих уведомлениях, 
// им нужно только уметь их создавать.
interface ToastContextType {
  addToast: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 3. Провайдер
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Используем useCallback, чтобы ссылка на функцию была стабильной
  const addToast = useCallback((text: string, type: ToastType = 'info') => {
    const id = Date.now();
    
    setToasts((prev) => [...prev, { id, text, type }]);

    // Автоматически удаляем уведомление через 3 секунды
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* 
        Отрисовываем уведомления прямо в провайдере!
        Они будут висеть поверх всех дочерних компонентов (children).
      */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`${styles.toast} ${styles[toast.type]}`}
          >
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// 4. Наш любимый кастомный хук
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast должен использоваться внутри ToastProvider');
  }
  return context;
};
```

## Шаг 2: Тестируем в бою!

Оберни свое приложение в `App.tsx` в `<ToastProvider>`. А затем создай кнопку в любом компоненте, чтобы проверить работу:

```tsx
import { useToast } from '../context/ToastContext';

export default function TestComponent() {
  const { addToast } = useToast();

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
      <button 
        onClick={() => addToast('Товар добавлен в корзину!', 'success')}
      >
        Успех
      </button>

      <button 
        onClick={() => addToast('Произошла ошибка при загрузке.', 'error')}
      >
        Ошибка
      </button>

      <button 
        onClick={() => addToast('У вас новое сообщение.', 'info')}
      >
        Инфо
      </button>
    </div>
  );
}
```

---

### 🎉 Курс завершен!

Ты прошел путь от базового `value` до сложных паттернов с `useReducer`, разделением контекстов на State/Dispatch и работой со стабильными ссылками. Теперь твой React-код стал намного чище и профессиональнее. Эти паттерны активно используются в современной Frontend-разработке.
