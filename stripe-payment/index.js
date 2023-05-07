const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// SETUP DOTENV
require('dotenv').config();

// IMPORT STRIPE
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CREATE EXPRESS APP
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));

/**
 * ROUTES
 */

// HOME ROUTE
app.get('/', (req, res) => {
  res.send('We are about to build the illest Stripe Payment API...');
});

// CHECKOUT ROUTE
app.post('/api/checkout', async (req, res) => {

  // RECEIVE PRODUCT AND CARD DETAILS FROM CLIENT
  const { product, card } = req.body;

  try {
    // CREATE STRIPE PAYMENT TOKEN
    const stripeToken = await stripe.tokens.create({
      card,
    });

    // CREATE STRIPE CUSTOMER
    const stripeCustomer = await stripe.customers.create({
      email: 'test@nishimwe.dev',
      source: stripeToken.id, //
      address: {
        line1: 'KK 137 ST',
        postal_code: '10001',
        city: 'Kigali',
      },
      shipping: {
        name: 'Nishimwe',
        address: {
          line1: 'KK 137 ST',
          postal_code: '10001',
          city: 'Kigali',
        },
      },
      name: 'NISHIMWE',
    });

    // CREATE STRIPE CHARGE
    const stripeCharge = await stripe.charges.create({
      amount: product.price * 100, // To convert to cents
      currency: 'usd',
      customer: stripeCustomer.id,
      description: `Purchased the ${product.name} for ${product.price}`,
    });

    // SEND RESPONSE
    res.status(200).json({
      message: 'Payment was successful',
      charge: stripeCharge,
    });
    
    // CATCH ERRORS
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE SERVER PORT
const port = process.env.PORT || 5000;

// LISTEN TO PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
