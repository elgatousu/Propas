const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_KEY
);

app.get("/propa", async (req, res) => {

const action = req.query.action;
const amount = parseInt(req.query.amount) || 0;

const { data } = await supabase
.from("propas")
.select("*")
.eq("id",1)
.single();

let total = data.propas;

if(action === "add"){
total += amount;

await supabase
.from("propas")
.update({ propas: total })
.eq("id",1);
}

if(action === "sub"){
total = Math.max(0, total - amount);

await supabase
.from("propas")
.update({ propas: total })
.eq("id",1);
}

if(action === "reset"){
total = 0;

await supabase
.from("propas")
.update({ propas: 0 })
.eq("id",1);
}

res.send(`💸 Propinas totales: $${total}`);

});

app.listen(process.env.PORT || 10000);
