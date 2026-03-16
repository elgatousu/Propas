const express = require("express");
const fetch = require("node-fetch");

const app = express();

const SUPABASE_URL = "https://jbaaxihuboiedptfqgrg.supabase.co";
const SUPABASE_KEY = "sb_publishable_UlmSgg73poiWmh87cquP-w_q-8T3a1T";

app.get("/propa", async (req, res) => {

    const action = req.query.action;
    const amount = parseInt(req.query.amount) || 0;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/propa?id=eq.1`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    const data = await response.json();

    let total = data[0]?.propas || 0;

    if(action === "add"){
        total += amount;
    }

    if(action === "sub"){
        total = Math.max(0, total - amount);
    }

    if(action === "reset"){
        total = 0;
    }

    if(action){
        await fetch(`${SUPABASE_URL}/rest/v1/propa?id=eq.1`,{
            method: "PATCH",
            headers:{
                "Content-Type":"application/json",
                apikey: SUPABASE_KEY,
                Authorization:`Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({propas: total})
        });
    }

    res.send(`💸 Propinas totales: $${total}`);
});

app.listen(process.env.PORT || 10000);
