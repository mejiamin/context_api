import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  price: number
}

interface CartState {
  items: Product[]
  total: number
}

type CartAction = { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  total: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': return {
      ...state,
      items: [...state.items, action.payload],
      total: state.total + action.payload.price,
    }

    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload.id)
      if (!itemToRemove) return state
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        total: state.total - itemToRemove.price,
      }

    case 'CLEAR_CART': return initialState

    default: return state
  }
}

const CartStateContext = createContext<CartState | undefined>(undefined)

const CartDispatchContext = createContext<React.Dispatch<CartAction> | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

export const useCartState = () => {
  const context = useContext(CartStateContext)
  if (!context) throw new Error('useCartState должен использоваться внутри CartProvider')
  return context
}

export const useCartDispatch = () => {
  const context = useContext(CartDispatchContext)
  if (!context) throw new Error('useCartDispatch должен использоваться внутри CartProvider')
  return context
}
