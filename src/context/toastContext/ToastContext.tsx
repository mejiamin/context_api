import { type ReactNode } from 'react'
import styles from './toast.module.css'

// 1. Типы для наших уведомлений


// 2. В контекст мы передаем ТОЛЬКО функцию добавления. 
// Компонентам не нужно знать обо всех текущих уведомлениях, 
// им нужно только уметь их создавать.


// 3. Провайдер
export const ToastProvider = ({ children }: { children: ReactNode }) => {

  return (
    <>
      {children}

      <div className={styles.toastContainer}>

        {/* toasts.map */}
        <div
          className={`${styles.toast}`}
        >
          text
        </div>

      </div>
    </>
  )
}

// 4. Наш любимый кастомный хук

