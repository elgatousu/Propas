const express = require("express");
const fetch = require("node-fetch");

const app = express();

const SUPABASE_URL = "https://gfjxahvhvdgqpcflrwvz.supabase.co";
const SUPABASE_KEY = "sb_publishable_UlmSgg73poiWmh87cquP-w_q-8T3a1T";

app.get("/propa", async (req, res) => {
  try {
    const action = req.query.action;
    const amount = Number(req.query.amount) || 0;

    console.log("ACTION:", action, "AMOUNT:", amount);

    // GET actual
    const getRes = await fetch(`${SUPABASE_URL}/rest/v1/propas?id=eq.1`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await getRes.json();
    let total = data?.[0]?.propas || 0;

    // lógica segura
    if (action === "add") {
      total += amount;
      if (total < 0) total = 0;
    }

    if (action === "sub") {
      total = Math.max(0, total - amount);
    }

    if (action === "reset") {
      total = 0;
    }

    // PATCH seguro
    if (action) {
      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/propas?id=eq.1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ propas: total })
      });

      if (!updateRes.ok) {
        throw new Error("Error al actualizar en Supabase");
      }
    }

    res.send(`💸 Propinas totales: $${total}`);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("Error en el servidor 💀");
  }
});

app.listen(process.env.PORT || 10000);
