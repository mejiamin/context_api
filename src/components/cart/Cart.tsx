import { useCart, type Product } from '@/context'
import styles from './cart.module.css'

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'React Клавиатура', price: 100 },
  { id: 2, name: 'Vite Мышь', price: 50 },
]

export const Cart = () => {
  const { state, dispatch } = useCart()

  return (
    <div className={styles.container}>
      <h2>Магазин</h2>

      <div className={styles.products}>
        {MOCK_PRODUCTS.map((product) => (
          <button
            key={product.id}
            className={styles.button}
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
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
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
  )
}
