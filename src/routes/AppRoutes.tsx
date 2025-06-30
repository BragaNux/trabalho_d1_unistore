import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa todas as páginas principais do app
import Start from "../pages/Home/Start";
import Profile from "../pages/Perfil/Profile";
import Payment from "../pages/Pagamento/Payment";
import OrderTracking from "../pages/Pedidos/OrderTracking";
import Login from "../pages/Login/Login";
import CreateAccount from "../pages/Register/CreateAccount";
import Cart from "../pages/Carrinho/Cart";
import Orders from "../pages/Pedidos/Orders";
import Shop from "../pages/Shop/Shop";
import ProductView from "../pages/Shop/ProductView";
import Home from "../pages/Home/Home";
import NotFound from "../pages/Error/NotFound";
import SavedAccounts from "../pages/SalvarUsuarios/SavedAccounts";
import Boleto from "../pages/FormasPagamento/Boleto";
import Pix from "../pages/FormasPagamento/Pix";
import CreditCard from "../pages/FormasPagamento/CreditCard";

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
