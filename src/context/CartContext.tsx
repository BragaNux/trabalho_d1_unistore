import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price_at_time: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
};

const CartContext = createContext({} as CartContextType);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔄 Carregar carrinho do banco ao iniciar
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const raw = localStorage.getItem("user_logged");
        if (!raw) return;

        const user = JSON.parse(raw);
        setUserId(user.id);

        const res = await axios.get<{ cart: CartItem[] }>(
          `http://localhost:3333/api/cart/${user.id}`
        );

        setCart(res.data.cart || []);
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product: Product) => {
    if (!userId) return;

    const existing = cart.find((item) => item.product_id === String(product.id));
    const quantity = existing ? existing.quantity + 1 : 1;

    try {
      await axios.post("http://localhost:3333/api/cart/add", {
        userId,
        productId: product.id,
        quantity,
        price: product.price,
      });

      if (existing) {
        setCart((prev) =>
          prev.map((item) =>
            item.product_id === String(product.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart((prev) => [
          ...prev,
          {
            id: "", // id do banco não é necessário no frontend
            product_id: String(product.id),
            name: product.name,
            price_at_time: product.price,
            quantity: 1,
            image: product.image,
          },
        ]);
      }
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!userId) return;
    if (quantity <= 0) return removeFromCart(productId);

    try {
      await axios.put("http://localhost:3333/api/cart/update", {
        userId,
        productId,
        quantity,
      });

      setCart((prev) =>
        prev.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!userId) return;

    try {
      await axios.delete("http://localhost:3333/api/cart/remove", {
        data: { userId, productId },
      } as any); // <- Corrige o erro TS com segurança

      setCart((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("Erro ao remover item:", err);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
