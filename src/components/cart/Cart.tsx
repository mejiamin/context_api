import styles from './cart.module.css';


export const Cart = () => {


  return (
    <div className={styles.container}>
      <h2>Магазин</h2>
      <div className={styles.products}>

        {/* MOCK_PRODUCTS.map */}
        <button
          className={styles.button}
        >
          Купить name price
        </button>

      </div>

      <div className={styles.cart}>
        <h3>Корзина items.length товаров</h3>
        <ul>

          {/* state.items.map */}
          <li className={styles.cartItem}>
            item.name - item.price
            <button className={styles.deleteButton}>
              ✕
            </button>
          </li>

        </ul>
        <div className={styles.footer}>
          <strong>Итого: $total</strong>
          <button>
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}
