const express = require("express");
const fetch = require("node-fetch");

const app = express();

const SUPABASE_URL = "https://jbaaxihuboiedptfqgrg.supabase.co";
const SUPABASE_KEY = "sb_publishable_UlmSgg73poiWmh87cquP-w_q-8T3a1T";

app.get("/", (req, res) => {
    res.send("Servidor de propas activo 💸");
});

app.get("/propa", async (req, res) => {

    const action = req.query.action;
    const amount = parseInt(req.query.amount) || 1;

    try {

        const response = await fetch(`${SUPABASE_URL}/rest/v1/propa?id=eq.1`, {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`
            }
        });

        const data = await response.json();

        let propas = data[0]?.propas || 0;

        if (action === "add") propas += amount;
        if (action === "sub") propas = Math.max(0, propas - amount);
        if (action === "reset") propas = 0;

        await fetch(`${SUPABASE_URL}/rest/v1/propa?id=eq.1`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ propas })
        });

        res.send(`💸 Propinas totales: $${propas}`);

    } catch (error) {
        console.log(error);
        res.send("Error en el servidor");
    }

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
