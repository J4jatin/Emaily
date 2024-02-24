const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  app.post('/api/stripe', requireLogin, async (req, res) => {

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
        return_url: 'http://localhost:3000/',
      });


      req.user.credits += 5;
      const user = await req.user.save();

      // Send a combined response with user data and client secret
      // res.json({
      //   user,
      //   clientSecret: paymentIntent.client_secret
      // });
      res.send(user);

  });
};
