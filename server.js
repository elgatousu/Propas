const express = require("express");

const app = express();

let total = 0;

app.get("/propa", (req, res) => {
    const action = req.query.action;
    const amount = parseInt(req.query.amount) || 0;

    if (action === "add") {
        total += amount;
    }

    if (action === "sub") {
        total = Math.max(0, total - amount);
    }

    if (action === "reset") {
        total = 0;
    }

    res.send(`💸 Propinas totales: $${total}`);
});

app.listen(process.env.PORT || 10000, () => {
    console.log("Servidor activo");
});
