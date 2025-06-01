import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Product = { id: number; name: string; price: number; image: string };
export type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext({} as CartContextType);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userEmail, setUserEmail] = useState("");

  // Sincroniza o carrinho com o usuário logado
  const syncCart = () => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    const email = user?.email || "";

    if (email && email !== userEmail) {
      setUserEmail(email);
      const savedCart = localStorage.getItem(`cart_${email}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }

    // Se não houver usuário logado, limpa o carrinho visual
    if (!email && userEmail) {
      setUserEmail("");
      setCart([]);
    }
  };

  useEffect(() => {
    syncCart(); // Carrega no início

    // Escuta mudanças no localStorage (caso outro tab mude usuário)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user_logged") syncCart();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [userEmail]);

  // Atualiza o localStorage sempre que o carrinho mudar
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    }
  }, [cart, userEmail]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id: number, quantity: number) =>
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
    );

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
