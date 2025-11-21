const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

app.post("/api/pago", async (req, res) => {
  const { total } = req.body;

  if (!total) {
    return res.status(400).json({ error: "Falta el monto total." });
  }

  try {
    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: "Pago Tienda CARA",
          quantity: 1,
          currency_id: "PEN",
          unit_price: Number(total),
        }
      ],
      back_urls: {
        success: "https://tu-web.com/success",
        failure: "https://tu-web.com/failure",
      },
      auto_return: "approved",
    });

    res.json({ url: preference.body.init_point });
  } catch (err) {
    console.error("ERROR MP:", err);
    res.status(500).json({ error: "Error creando el pago" });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log("Microservicio MercadoPago escuchando en " + PORT);
});
