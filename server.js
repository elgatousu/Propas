const express = require("express");
const fetch = require("node-fetch");

const app = express();

const SUPABASE_URL = "https://jbaaxihuboiedptfqgrg.supabase.co";
const SUPABASE_KEY = "sb_publishable_Yu30CA4em3Adad3gkpA_Nw_-aYmjo4B";

async function getPedidos() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contador?id=eq.1`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    const data = await res.json();
    return data[0].pedidos;
}

async function setPedidos(valor) {
    await fetch(`${SUPABASE_URL}/rest/v1/contador?id=eq.1`, {
        method: "PATCH",
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pedidos: valor })
    });
}

app.get("/", (req, res) => {
    res.send("Servidor de pedidos activo");
});

app.get("/pedido", async (req, res) => {

    const action = req.query.action;
    let pedidos = await getPedidos();

    if (action === "add") {
        pedidos++;
        await setPedidos(pedidos);
        return res.send(`📦 Pedido recibido | Total: ${pedidos}`);
    }

    if (action === "sub") {
        pedidos = Math.max(0, pedidos - 1);
        await setPedidos(pedidos);
        return res.send(`❌ Pedido cancelado | Total: ${pedidos}`);
    }

    if (action === "reset") {
        pedidos = 0;
        await setPedidos(pedidos);
        return res.send(`🔄 Contador reiniciado | Total: ${pedidos}`);
    }

    res.send(`📦 Total pedidos: ${pedidos}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
