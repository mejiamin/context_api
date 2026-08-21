export const TestComponent = () => {


  return (
    <div style={{ height: '70vh', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
      <button> {/* Товар добавлен в корзину! */}
        Успех
      </button>

      <button> {/* Произошла ошибка при загрузке. */}
        Ошибка
      </button>

      <button> {/*  вас новое сообщение. */}
        Инфо
      </button>
    </div>
  )
}
