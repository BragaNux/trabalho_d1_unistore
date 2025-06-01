import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa todas as páginas principais do app
import Start from "../pages/Start";
import Profile from "../pages/Profile";
import Payment from "../pages/Payment";
import OrderTracking from "../pages/OrderTracking";
import Login from "../pages/Login";
import CreateAccount from "../pages/CreateAccount";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Shop from "../pages/Shop";
import ProductView from "../pages/ProductView";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SavedAccounts from "../pages/SavedAccounts";
import Boleto from "../pages/Boleto";
import Pix from "../pages/Pix";
import CreditCard from "../pages/CreditCard";

// Componente responsável por definir todas as rotas da aplicação
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela inicial do app */}
        <Route path="/" element={<Start />} />

        {/* Telas de autenticação */}
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />

        {/* Perfil do usuário */}
        <Route path="/profile" element={<Profile />} />

        {/* Carrinho e pedidos */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-tracking/:id" element={<OrderTracking />} />

        {/* Loja e produtos */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductView />} />

        {/* Tela principal (pós-login ou hub) */}
        <Route path="/home" element={<Home />} />

        {/* Seleção de contas salvas no localStorage */}
        <Route path="/saved-accounts" element={<SavedAccounts />} />

        {/* Pagamento - Subrotas para os métodos específicos */}
        <Route path="/payment">
          <Route index element={<Payment />} />
          <Route path="pix" element={<Pix />} />
          <Route path="boleto" element={<Boleto />} />
          <Route path="credit" element={<CreditCard />} />
        </Route>

        {/* Rota para qualquer caminho inexistente */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
