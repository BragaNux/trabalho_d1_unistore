import "./CreditCard.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function CreditCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  // Total da compra e dados do pedido passados pela navegação
  const total = location.state?.total || 0;
  const pedidoId = location.state?.pedidoId || "";
  const cartItems = location.state?.cart || [];

  // Estado do formulário do cartão
  const [form, setForm] = useState({
    nome: "",
    numero: "",
    validade: "",
    cvv: "",
    bandeira: "",
  });

  // Feedback visual ao usuário
  const [snackbar, setSnackbar] = useState("");

  // Detecta a bandeira do cartão com base no número
  const detectBandeira = (numero: string) => {
    if (/^4/.test(numero)) return "Visa";
    if (/^5[1-5]/.test(numero)) return "Mastercard";
    if (/^3[47]/.test(numero)) return "Amex";
    if (/^6/.test(numero)) return "Elo";
    return "";
  };

  // Atualiza automaticamente a bandeira ao digitar o número
  useEffect(() => {
    const bandeira = detectBandeira(form.numero.replace(/\s/g, ""));
    setForm((prev) => ({ ...prev, bandeira }));
  }, [form.numero]);

  // Manipula campos do formulário
  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Valida e processa o pagamento
  const handlePagar = () => {
    if (
      form.nome.length < 5 ||
      form.numero.replace(/\s/g, "").length < 16 ||
      !/^\d{2}\/\d{2}$/.test(form.validade) ||
      form.cvv.length < 3
    ) {
      alert("Preencha os dados corretamente.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (!user?.email) {
      alert("Erro: usuário não autenticado.");
      return;
    }

    const pedidosExistentes = JSON.parse(
      localStorage.getItem(`orders_${user.email}`) || "[]"
    );

    // Impede pagamentos duplicados para o mesmo pedido
    const jaExiste = pedidosExistentes.some((p: any) => p.id === pedidoId);
    if (jaExiste) {
      setSnackbar("❗ Este pedido já foi registrado.");
      return;
    }

    // Cria novo pedido e registra no localStorage
    const novoPedido = {
      id: pedidoId,
      items: cartItems.map((i: any) => i.name),
      total,
      metodo: "Cartão de Crédito",
      bandeira: form.bandeira,
      status: "Pago",
    };

    localStorage.setItem(
      `orders_${user.email}`,
      JSON.stringify([...pedidosExistentes, novoPedido])
    );

    // Salva os dados do pagamento
    localStorage.setItem(
      `pagamento_${user.email}`,
      JSON.stringify({
        metodo: "Cartão de Crédito",
        total,
        bandeira: form.bandeira,
        data: new Date().toISOString(),
      })
    );

    clearCart();
    setSnackbar("✅ Pagamento realizado com sucesso!");
    setTimeout(() => navigate("/orders"), 2000);
  };

  return (
    <div className="creditcard-container">
      <h1>Cartão de Crédito</h1>

      {/* Visualização do cartão animado */}
      <div className="card-visual">
        <div className="card">
          <div className="chip" />
          <div className="card-number">
            {form.numero || "•••• •••• •••• ••••"}
          </div>
          <div className="card-footer">
            <div className="card-name">{form.nome || "NOME COMPLETO"}</div>
            <div className="card-validity">{form.validade || "MM/AA"}</div>
            <div className="card-flag">{form.bandeira}</div>
          </div>
        </div>
      </div>

      {/* Formulário do cartão */}
      <div className="card-form">
        <input
          name="nome"
          placeholder="Nome no cartão"
          value={form.nome}
          onChange={handleInput}
        />
        <input
          name="numero"
          placeholder="Número do cartão"
          value={form.numero}
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, "").slice(0, 16);
            val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
            handleInput({ target: { name: "numero", value: val } });
          }}
        />
        <div className="form-row">
          <input
            name="validade"
            placeholder="Validade (MM/AA)"
            value={form.validade}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "").slice(0, 4);
              if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
              handleInput({ target: { name: "validade", value: val } });
            }}
          />
          <input
            name="cvv"
            placeholder="CVV"
            value={form.cvv}
            onChange={(e) =>
              handleInput({
                target: {
                  name: "cvv",
                  value: e.target.value.replace(/\D/g, "").slice(0, 4),
                },
              })
            }
          />
        </div>

        <button onClick={handlePagar}>💳 Confirmar Pagamento</button>

        {/* Mensagem de sucesso ou erro */}
        {snackbar && <div className="snackbar snackbar-success">{snackbar}</div>}
      </div>
    </div>
  );
}
