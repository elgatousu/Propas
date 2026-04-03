const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// 🔐 variables de entorno
const SECRET = process.env.SECRET_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// 🔥 obtener pedidos
async function getPedidos() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/propas?id=eq.1`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    if (!res.ok) {
        throw new Error("Error GET pedidos");
    }

    const data = await res.json();
    return data?.[0]?.pedidos || 0;
}

// 🔥 actualizar pedidos
async function setPedidos(valor) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/propas?id=eq.1`, {
        method: "PATCH",
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        },
        body: JSON.stringify({ pedidos: valor })
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error("Error PATCH: " + txt);
    }
}

// 🟢 ruta pública (solo ver)
app.get("/pedido", async (req, res) => {
    try {
        const pedidos = await getPedidos();
        res.send(`📦 Total pedidos: ${pedidos}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error 💀");
    }
});

// 🔐 ruta protegida (modificar)
app.get("/pedido/admin", async (req, res) => {
    try {
        const key = req.headers["x-api-key"];

        if (!key || key !== SECRET) {
            return res.status(403).send("No autorizado");
        }

        const action = req.query.action;
        let pedidos = await getPedidos();

        if (action === "add") pedidos++;
        if (action === "sub") pedidos = Math.max(0, pedidos - 1);
        if (action === "reset") pedidos = 0;

        await setPedidos(pedidos);

        console.log("KEY usada:", key, "ACTION:", action);

        res.send(`📦 Total: ${pedidos}`);
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).send("Error 💀");
    }
});

// 🔥 servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});
