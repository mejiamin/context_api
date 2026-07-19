import { Cart } from "@/components"
import { CartProvider } from "./context"

export const App = () => {
  return (
    <CartProvider>
      <Cart />
    </CartProvider>
  )
}
