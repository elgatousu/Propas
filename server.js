const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// 🔐 variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SECRET = process.env.SECRET_KEY;

// 🧠 evitar crash si faltan variables
if (!SUPABASE_URL || !SUPABASE_KEY || !SECRET) {
    console.error("❌ Faltan variables de entorno");
    process.exit(1);
}

// 🟢 ruta base
app.get("/", (req, res) => {
    res.send("API de propinas funcionando 🚀");
});

// 🔥 obtener propinas
async function getPropas() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/propas?id=eq.1`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error("GET error: " + txt);
    }

    const data = await res.json();
    return data?.[0]?.propas || 0;
}

// 🔥 actualizar propinas
async function setPropas(valor) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/propas?id=eq.1`, {
        method: "PATCH",
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        },
        body: JSON.stringify({ propas: valor })
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error("PATCH error: " + txt);
    }
}

// 🟢 ver propinas (público)
app.get("/propa", async (req, res) => {
    try {
        const total = await getPropas();
        res.send(`💸 Propinas totales: $${total}`);
    } catch (err) {
        console.error("ERROR:", err.message);
        res.status(500).send("Error en propinas 💀");
    }
});

// 🔐 admin (modificar)
app.get("/propa/admin", async (req, res) => {
    try {
        const key = req.query.key;
        const action = req.query.action;
        const amount = parseInt(req.query.amount);

        // 🔐 protección
        if (!key || key !== SECRET) {
            return res.status(403).send("No autorizado");
        }

        let total = await getPropas();

        // ➕ sumar
        if (action === "add") {
            if (!amount || amount <= 0) {
                return res.send("❌ amount inválido");
            }

            total += amount;
            await setPropas(total);

            return res.send(`💸 +$${amount} | Total: $${total}`);
        }

        // ➖ restar
        if (action === "sub") {
            if (!amount || amount <= 0) {
                return res.send("❌ amount inválido");
            }

            total = Math.max(0, total - amount);
            await setPropas(total);

            return res.send(`💸 -$${amount} | Total: $${total}`);
        }

        // 🔄 reset
        if (action === "reset") {
            total = 0;
            await setPropas(total);

            return res.send("🗑️ Propinas reiniciadas");
        }

        return res.send("Acción no válida");

    } catch (err) {
        console.error("ERROR:", err.message);
        res.status(500).send("Error en propinas 💀");
    }
});

// 🚀 levantar servidor (IMPORTANTE para Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
