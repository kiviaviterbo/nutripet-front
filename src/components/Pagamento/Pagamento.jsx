import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../services/api";
import "./Pagamento.css";
import dogIcon from "../../assets/images/pagamento.png";

export default function Pagamento() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const pixIdRef = React.useRef(null);

    const [metodo, setMetodo] = useState("cartao");
    const [parcelas, setParcelas] = useState(1);

    const [formData, setFormData] = useState({
        nome: "",
        numero: "",
        validade: "",
        cvv: "",
    });

    const [loading, setLoading] = useState(false);
    const [pixCode] = useState("00020126360014BR.GOV.BCB.PIX0114+55999999999...");
    const [timeLeft, setTimeLeft] = useState(6);
    const [showPixCountdown, setShowPixCountdown] = useState(false);

    useEffect(() => {
        if (!showPixCountdown) return;
        if (timeLeft <= 0) {
            api.post("/assinaturas/webhook", {
                payment_subscription_id: pixIdRef.current,
                event: "payment_success"
            })
                .then(() => navigate(`/pagamento/sucesso/${pixIdRef.current}`))
                .catch(() => alert("Erro ao validar pagamento PIX."));
            return;
        }

        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);

    }, [timeLeft, showPixCountdown]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePagamento = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Você precisa estar logado para continuar.");
            navigate("/auth");
            return;
        }

        try {
            setLoading(true);

            // 1) Criar assinatura pendente
            const res = await api.post("/assinaturas/criar", {
                userId: user.id,
                metodo,
            });

            const id = res.data.subscriptionId;
            pixIdRef.current = id;

            // Se for cartão → processa direto
            if (metodo === "cartao") {
                await api.post("/assinaturas/webhook", {
                    payment_subscription_id: id,
                    event: "payment_success",
                });

                navigate(`/pagamento/sucesso/${id}`);
                return;
            }

            // Se for PIX → mostrar QR + contador
            if (metodo === "pix") {
                setShowPixCountdown(true);
                return;
            }

        } catch (err) {
            console.error(err);
            alert("Erro ao processar pagamento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NutripetNavbar />

            <section className="pagamento-section">
                <div className="pagamento-wrapper">
                    <div className="plano-card">
                        <img src={dogIcon} alt="Plano Premium" className="plano-img" />
                        <h3>Plano Premium 🏆</h3>
                        <p>
                            Acesso completo aos especialistas e recomendações nutricionais
                            personalizadas para o seu pet.
                        </p>
                        <div className="plano-preco">
                            <span className="valor">R$ 49,90</span>
                            <small>/ plano trimestral</small>
                        </div>
                        <ul className="plano-beneficios">
                            <li>✔ Consultas com veterinários</li>
                            <li>✔ Relatórios personalizados</li>
                            <li>✔ Descontos exclusivos</li>
                        </ul>
                    </div>
                    <div className="pagamento-card">
                        <h2>Finalize sua Assinatura</h2>
                        <p className="descricao">
                            Selecione o método de pagamento.
                        </p>

                        <label>Método de pagamento</label>
                        <select
                            value={metodo}
                            onChange={(e) => {
                                setMetodo(e.target.value);
                                setShowPixCountdown(false);
                                setTimeLeft(6);
                            }}
                        >
                            <option value="cartao">Cartão de Crédito</option>
                            <option value="pix">PIX</option>
                        </select>
                        {metodo === "pix" && (
                            <div className="pix-container">
                                <h3>Pague com PIX</h3>
                                <p style={{ fontWeight: "600", color: "#f5a623", marginBottom: "1rem" }}>
                                    Valor a ser pago no PIX: <strong>R$ 140,70</strong>
                                </p>
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pixmock"
                                    alt="QR Code PIX"
                                    className="pix-qrcode"
                                />
                                <p><strong>Código PIX (copia e cola):</strong></p>
                                <textarea readOnly value={pixCode} />

                                {!showPixCountdown && (
                                    <button
                                        className="btn-pagar-pix"
                                        onClick={handlePagamento}
                                    >
                                        Já fiz o pagamento
                                    </button>
                                )}
                                {showPixCountdown && (
                                    <p className="pix-timer">
                                        Validando pagamento... {timeLeft}s
                                    </p>
                                )}
                            </div>
                        )}
                        {metodo === "cartao" && (
                            <form onSubmit={handlePagamento} className="pagamento-form">

                                <label>Nome no cartão</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                />

                                <label>Número do cartão</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="linha">
                                    <div>
                                        <label>Validade (MM/AA)</label>
                                        <input
                                            type="text"
                                            name="validade"
                                            value={formData.validade}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <label>Parcelamento</label>
                                <select value={parcelas} onChange={(e) => setParcelas(e.target.value)}>
                                    <option value="1">1x de R$ 149,70 </option>
                                    <option value="2">2x de R$ 79,85 </option>
                                    <option value="3">3x de R$ 49,90 </option>
                                </select>

                                <button type="submit" disabled={loading}>
                                    {loading ? "Processando..." : "Ativar Assinatura"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
