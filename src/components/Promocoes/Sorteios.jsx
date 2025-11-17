import React, { useEffect, useState } from "react";
import NutripetNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PerfilLayout from "../PerfilLayout/PerfilLayout";
import api from "../../services/api";
import "./Sorteios.css";
import camiseta from "../../assets/images/camiseta.png";
import petz from "../../assets/images/petz.png";
import moto from "../../assets/images/moto.png";
import { Tag, Gift } from "lucide-react";

export default function Sorteios() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const [assinatura, setAssinatura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const [inscricoes, setInscricoes] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("inscricoes_sorteio"));
        if (Array.isArray(saved)) setInscricoes(saved);
    }, []);


    const menuPromos = [
        { label: "Cupons", icon: <Tag size={18} />, path: "/usuario/cupons" },
        { label: "Sorteios", icon: <Gift size={18} />, path: "/usuario/sorteios" },
    ];

    useEffect(() => {
        async function carregar() {
            try {
                const res = await api.get(`/assinaturas/status/${user.id}`);
                setAssinatura(res.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    if (loading) return;

    const isPremium = assinatura?.ativo;

    if (!isPremium) {
        return (
            <>
                <NutripetNavbar />
                <PerfilLayout menu={menuPromos}>
                    <h2 className="titulo">Sorteios</h2>
                    <div className="assinatura-free text-center">
                        <h3>Recurso exclusivo para assinantes Premium</h3>
                        <button className="btn-assinar" onClick={() => (window.location.href = "/pagamento")}>
                            Seja Premium
                        </button>
                    </div>
                </PerfilLayout>
                <Footer />
            </>
        );
    }

    const mesesCliente = 3;

    const sorteios = [
        {
            id: 1,
            img: camiseta,
            titulo: "Camiseta Exclusiva Nutripet",
            desc: "Clientes há 3 meses ou mais concorrem uma camiseta personalizada da Nutripet.",
            minimo: 3,
        },
        {
            id: 2,
            img: petz,
            titulo: "3 Meses Grátis na Petz",
            desc: "Clientes há 6 meses ou mais concorrem a a 3 meses de ração grátis na Petz. Válido para compras no site da Petz.",
            minimo: 6,
        },
        {
            id: 3,
            img: moto,
            titulo: "Concorra a uma Moto Elétrica",
            desc: "Clientes há 12 meses ou mais concorrem a uma moto elétrica.",
            minimo: 12,
        },
    ];

    const participar = (id, titulo) => {

        // evita duplicação (mock bem feito)
        if (inscricoes.includes(id)) return;

        const novasInscricoes = [...inscricoes, id];

        // atualiza estado
        setInscricoes(novasInscricoes);

        // salva no localStorage
        localStorage.setItem("inscricoes_sorteio", JSON.stringify(novasInscricoes));

        // pop-up mockado
        setPopup(`Inscrição confirmada para "${titulo}"!`);
        setTimeout(() => setPopup(false), 2200);
    };


    return (
        <>
            <NutripetNavbar />

            <PerfilLayout menu={menuPromos}>
                <h2 className="titulo">Sorteios</h2>

                <div className="sorteios-container">
                    {sorteios.map((s) => {
                        const elegivel = mesesCliente >= s.minimo;
                        const jaInscrito = inscricoes.includes(s.id);

                        return (
                            <div className="sorteio-card" key={s.id}>
                                <img src={s.img} className="sorteio-img" />

                                <div className="sorteio-info">
                                    <h3>{s.titulo}</h3>
                                    <p>{s.desc}</p>

                                    <button
                                        className={`sorteio-btn ${!elegivel
                                            ? "desabilitado"
                                            : jaInscrito
                                                ? "inscrito"
                                                : "ativo"
                                            }`}
                                        disabled={!elegivel || jaInscrito}
                                        onClick={() => participar(s.id, s.titulo)}
                                    >
                                        {!elegivel
                                            ? "Indisponível"
                                            : jaInscrito
                                                ? "Inscrito ✓"
                                                : "Participar"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PerfilLayout>

            <Footer />

            {popup && <div className="np-popup">{popup}</div>}
        </>
    );
}
