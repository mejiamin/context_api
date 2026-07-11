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

#### 👉 Урок 3: Связка Context API + useReducer

Когда `useState` перестает справляться. Мы интегрируем `useReducer` внутрь нашего провайдера для управления сложным состоянием (например, состоянием авторизации или корзины покупок) и типизируем все `actions` и `dispatch`.

#### Урок 4: Оптимизация производительности и рендеров

Главный минус Context API — лишние рендеры всех дочерних компонентов при изменении контекста. Мы разберем, как этого избежать: разделение одного контекста на два (State Context и Dispatch Context) и использование `useMemo`.

#### Урок 5: Финальная практика (с CSS Modules)

Соберем небольшую фичу в твоем окружении, объединив всё вместе. Напишем глобальную систему уведомлений (Toasts) или корзину, стилизованную через твои CSS Modules, чтобы закрепить материал в условиях реального продакшена.

---

## Урок 3: Связка Context API + useReducer

Теперь мы переходим к более сложным вещам.

Когда состояние становится запутанным (например, оно представляет собой объект с массивами внутри, и разные действия обновляют разные части этого объекта), обычный `useState` превращается в кошмар. Здесь на помощь приходит `useReducer` в связке с Context API.

По сути, мы сейчас соберем **мини-Redux**, встроенный прямо в React, с идеальной поддержкой TypeScript.

Давай создадим простую корзину покупок.

## Шаг 1: Типы и Reducer

Создай файл `CartContext.tsx` в папке `context`. Сначала мы опишем форму наших данных и все возможные действия (экшены), которые могут с ними происходить. В TypeScript это делается через *Discriminated Unions* (размеченные объединения) — это невероятно мощная штука.

```tsx
import { createContext, useReducer, useContext, ReactNode } from 'react';

// 1. Описываем типы данных
export interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartState {
  items: Product[];
  total: number;
}

// 2. Описываем ВСЕ возможные действия в системе.
// TypeScript будет строго следить,
// чтобы мы не передали payload туда, где его нет.
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'CLEAR_CART' };

// 3. Начальное состояние
const initialState: CartState = {
  items: [],
  total: 0,
};

// 4. Пишем сам Reducer — чистую функцию,
// которая принимает старый State и Action, 
// а возвращает новый State.
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!itemToRemove) return state;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        total: state.total - itemToRemove.price,
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}
```

## Шаг 2: Создание Контекста, Провайдера и Хука

В этом же файле `CartContext.tsx` добавляем уже знакомый нам паттерн из Урока 2. Только вместо `theme` и `toggleTheme` мы будем передавать `state` и функцию `dispatch`.

```tsx
// 5. Типизируем значение контекста
interface CartContextType {
  state: CartState;
  
  // Типизация встроенного dispatch из React
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 6. Создаем Провайдер
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Используем useReducer вместо useState
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// 7. Создаем наш кастомный хук
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};
```

## Шаг 3: Использование в компоненте

Оберни свой `App.tsx` в `<CartProvider>` (можешь положить его прямо внутрь `<ThemeProvider>`, они отлично работают вместе).

Теперь создадим компонент `Cart.tsx` и файл стилей `Cart.module.css`.

**`Cart.tsx`:**

```tsx
import { useCart, Product } from '../context/CartContext';
import styles from './Cart.module.css';

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'React Клавиатура', price: 100 },
  { id: 2, name: 'Vite Мышь', price: 50 },
];

export default function Cart() {
  // Достаем state и dispatch из контекста
  const { state, dispatch } = useCart();

  return (
    <div className={styles.container}>
      <h2>Магазин</h2>
      <div className={styles.products}>
        {MOCK_PRODUCTS.map((product) => (
          <button
            key={product.id}
            className={styles.button}
            // Вызываем dispatch с нужным action! TS подскажет все поля.
            onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
          >
            Купить {product.name} (${product.price})
          </button>
        ))}
      </div>

      <div className={styles.cart}>
        <h3>Корзина ({state.items.length} товаров)</h3>
        <ul>
          {state.items.map((item, index) => (
            <li key={index} className={styles.cartItem}>
              {item.name} - ${item.price}
              <button
                className={styles.deleteButton}
                onClick={() => dispatch({ 
                  type: 'REMOVE_ITEM', payload: { id: item.id } 
                })}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <strong>Итого: ${state.total}</strong>
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

**Твое задание для Урока 3:**

1. Создай `CartContext.tsx` и внимательно изучи, как TypeScript проверяет `action.type` внутри `switch`. Попробуй сделать опечатку в `type: 'ADD_ITEM'` и посмотри, как TS сразу укажет на ошибку.
2. Создай компонент `Cart` и стили.
3. Добавь `CartProvider` в `App.tsx` и выведи компонент `<Cart />`. Проверь, как добавляются и удаляются товары, и как обновляется итоговая сумма.
