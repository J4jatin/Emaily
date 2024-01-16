// const keys = require("../config/keys");
// const stripe = require("stripe")(keys.stripeSecretKey);
//
// module.exports = (app) => {
//   app.post("/api/stripe", async (req, res) => {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 500,
//       currency: "inr",
//       description: "$5 for 5 credits",
//       payment_method_data: {
//         type: "card",
//         card: {
//           token: req.body.id,
//         },
//       },
//       confirmation_method: "manual",
//       confirm: "true",
//     });
//
//     console.log(paymentIntent);
//   });
// };
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

module.exports = (app) => {
  app.post("/api/stripe", async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 500,
        currency: "usd",
        description: "$5 for 5 credits",
        payment_method_data: {
          type: "card",
          card: {
            token: req.body.id,
          },
        },
        confirmation_method: "manual",
        confirm: "true",
        return_url: 'http://localhost:3000/', // specify your return URL
      });

      // Log the Payment Intent for debugging purposes
      console.log(paymentIntent);

      // Send the client secret back to the client
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Unable to create Payment Intent.' });
    }
  });
};
