import "./CreditCard.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

export default function CreditCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const total = location.state?.total || 0;
  const pedidoId = location.state?.pedidoId || "";
  const userId = location.state?.userId || "";

  const [form, setForm] = useState({
    nome: "",
    numero: "",
    validade: "",
    cvv: "",
    bandeira: "",
  });

  const detectBandeira = (numero: string) => {
    if (/^4/.test(numero)) return "Visa";
    if (/^5[1-5]/.test(numero)) return "Mastercard";
    if (/^3[47]/.test(numero)) return "Amex";
    if (/^6/.test(numero)) return "Elo";
    return "";
  };

  useEffect(() => {
    const bandeira = detectBandeira(form.numero.replace(/\s/g, ""));
    setForm((prev) => ({ ...prev, bandeira }));
  }, [form.numero]);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePagar = async () => {
    if (
      form.nome.length < 5 ||
      form.numero.replace(/\s/g, "").length < 16 ||
      !/^\d{2}\/\d{2}$/.test(form.validade) ||
      form.cvv.length < 3
    ) {
      alert("Preencha os dados corretamente.");
      return;
    }

    try {
      const codigoTransacao = `cc-${pedidoId}-${form.bandeira}`;
      await fetch("http://localhost:3000/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: pedidoId,
          method: "credit",
          transactionCode: codigoTransacao,
        }),
      });

      clearCart();
      alert("✅ Pagamento efetuado com sucesso!");
      navigate("/orders");
    } catch (err) {
      alert("Erro ao registrar pagamento.");
    }
  };

  return (
    <div className="creditcard-container">
      <h1>Cartão de Crédito</h1>
      <div className="card-visual">
        <div className="card">
          <div className="chip" />
          <div className="card-number">{form.numero || "•••• •••• •••• ••••"}</div>
          <div className="card-footer">
            <div className="card-name">{form.nome || "NOME COMPLETO"}</div>
            <div className="card-validity">{form.validade || "MM/AA"}</div>
            <div className="card-flag">{form.bandeira}</div>
          </div>
        </div>
      </div>

      <div className="card-form">
        <input name="nome" placeholder="Nome no cartão" value={form.nome} onChange={handleInput} />
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
              handleInput({ target: { name: "cvv", value: e.target.value.replace(/\D/g, "").slice(0, 4) } })
            }
          />
        </div>

        <button onClick={handlePagar}>💳 Confirmar Pagamento</button>
      </div>
    </div>
  );
}
