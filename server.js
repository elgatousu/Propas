// PROPINAS

const SECRET = process.env.SECRET_KEY;

// 🔥 obtener propinas
async function getPropas() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/propas?id=eq.1`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    if (!res.ok) throw new Error("Error GET propas");

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
        throw new Error("Error PATCH: " + txt);
    }
}


// 🟢 VER PROPINAS (público)
app.get("/propa", async (req, res) => {
    try {
        const total = await getPropas();
        res.send(`💸 Propinas totales: $${total}`);
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).send("Error en propinas 💀");
    }
});


// 🔐 ADMIN (modificar)
app.get("/propa/admin", async (req, res) => {
    try {
        const key = req.query.key; // para Nightbot
        const action = req.query.action;
        const amount = parseInt(req.query.amount);

        // 🔐 protección
        if (!key || key !== SECRET) {
            return res.status(403).send("No autorizado");
        }

        let total = await getPropas();

        // ➕ SUMAR
        if (action === "add") {
            if (!amount || amount <= 0) {
                return res.send("❌ amount inválido");
            }

            total += amount;
            await setPropas(total);

            return res.send(`💸 +$${amount} | Total: $${total}`);
        }

        // ➖ RESTAR
        if (action === "sub") {
            if (!amount || amount <= 0) {
                return res.send("❌ amount inválido");
            }

            total = Math.max(0, total - amount);
            await setPropas(total);

            return res.send(`💸 -$${amount} | Total: $${total}`);
        }

        // 🔄 RESET
        if (action === "reset") {
            total = 0;
            await setPropas(total);

            return res.send(`🗑️ Propinas reiniciadas`);
        }

        return res.send("Acción no válida");

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).send("Error en propinas 💀");
    }
});
