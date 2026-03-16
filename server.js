const express = require("express");
const fetch = require("node-fetch");

const app = express();

const SUPABASE_URL = "https://jbaaxihuboiedptfqgrg.supabase.co";
const SUPABASE_KEY = "sb_publishable_UlmSgg73poiWmh87cquP-w_q-8T3a1T";

async function getData() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contador?id=eq.1`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    const data = await res.json();
    return data[0];
}

async function updateData(datos) {
    await fetch(`${SUPABASE_URL}/rest/v1/contador?id=eq.1`, {
        method: "PATCH",
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });
}

app.get("/", (req, res) => {
    res.send("Servidor de propas activo");
});

app.get("/propa", async (req, res) => {

    const action = req.query.action;
    const amount = parseInt(req.query.amount) || 0;

    let data = await getData();
    let propas = data.propas;

    if (action === "add") {

        propas += amount;

        await updateData({ propas });

        return res.send(`💸 Propa de $${amount} | Total: $${propas}`);
    }

    if (action === "sub") {

        propas = Math.max(0, propas - amount);

        await updateData({ propas });

        return res.send(`❌ Se quitó $${amount} | Total: $${propas}`);
    }

    if (action === "reset") {

        propas = 0;

        await updateData({ propas });

        return res.send(`🔄 Propas reiniciadas | Total: $${propas}`);
    }

    res.send(`💸 Total propas: $${propas}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
