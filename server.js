const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
res.send("Servidor de propinas activo");
});

app.get("/propa", async (req, res) => {

const action = req.query.action;
const amount = parseInt(req.query.amount) || 1;

let { data } = await supabase
.from("propa")
.select("*")
.eq("id",1)
.single();

let propas = data.propas;

if(action === "add"){
propas += amount;

await supabase
.from("propa")
.update({propas})
.eq("id",1);

return res.send(`💸 Propinas totales: $${propas}`);
}

if(action === "sub"){
propas = Math.max(0, propas - amount);

await supabase
.from("propa")
.update({propas})
.eq("id",1);

return res.send(`💸 Propinas totales: $${propas}`);
}

if(action === "reset"){
propas = 0;

await supabase
.from("propa")
.update({propas})
.eq("id",1);

return res.send(`🔄 Propinas reiniciadas`);
}

res.send(`💸 Propinas totales: $${propas}`);

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
console.log(`Servidor activo en puerto ${PORT}`);
});
