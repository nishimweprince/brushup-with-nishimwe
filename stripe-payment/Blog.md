# Add payments feature in your application using Node.js/Express and Stripe

In this article, we will learn how to add payments feature in your application using Express, a Node.js web application framework and [Stripe Charges API](https://stripe.com/docs/api/charges) to create a payment gateway.

## What is Stripe?

Stripe is a complete payments platform that offer a developer-friendly way to accept payments online and in mobile apps. To learn more about Stripe, visit their [website here](https://stripe.com/).

## Assumptions

* While we will cover everything from scratch and in detail, we will assume that you have a basic understanding of the following tools:

  * [Node.js](https://nodejs.org/en/download/)
  * Command line

* Adding to this, we will use `CommonJS` modules to import and export code.

If you are not familiar with the above technologies, I recommend you to check out the following resources:

+ [How To Get Started with Node.js and Express](https://www.digitalocean.com/community/tutorials/nodejs-express-basics)

+ [Command Line Interface Setup](https://www.codecademy.com/article/command-line-setup)

+ [Modules in JavaScript – CommonJS and ESmodules Explained](https://www.freecodecamp.org/news/modules-in-javascript/)

## Prerequisites

To follow along with this article, you need to have the following installed on your machine:

+ [Node.js](https://nodejs.org/en/download/)
+ A text editor of your choice. I recommend [VS Code](https://code.visualstudio.com/download)
+ [Postman](https://www.postman.com/downloads/): is a very simple and intuitive API testing tool or application. We will use it to test our API endpoints/routes.

+ A stripe account. If you don't have one, you can create one for free at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register). We will cover how to create a stripe account in detail in the next section.

## Table of contents

1. [Set up Stripe account](#create-a-stripe-account)
2. [Setup our Node.js/Express application](#create-a-nodejsexpress-application)
3. [Create payment gateway using Stripe Charges API](#create-a-payment-form)
4. [Test our payment endpoint using Postman](#test-our-payment-endpoint)
5. [Conclusion](#conclusion)

# Getting Started

## Create a Stripe account <a name="create-a-stripe-account"></a>

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register) and create a stripe account. You will be asked to provide your email address and a password to create an account.

2. After creating your account successfully, you will be redirected to the dashboard. Take copy of the **Publishable key** and **Secret key** from the **Developers** section of the dashboard. Our application will need these keys to access the Stripe Payments API. Below is a screenshot of the dashboard.

![Stripe dashboard](https://res.cloudinary.com/nishimweprince/image/upload/v1683485936/discover-with-nishimwe/stripe-payment/stripe-dashboard_qlvjza.png)


## Setting up our Node.js/Express application <a name="create-a-nodejsexpress-application"></a>

1. Create a new directory for our application and navigate to it using the command line.

```bash
mkdir stripe-payment
cd stripe-payment
```

2. Initialize a new Node.js application using the command below. This will create a `package.json` file in our project directory.

```bash
npm init -y
```

Our `package.json` file should look like this:

```json
{
  "name": "stripe-payment",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": { // we will add more scripts later
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
    
```

3. Install the following dependencies in our project directory.

```bash
npm install express cors body-parser dotenv nodemon stripe --save
```

### Understaning the dependencies

+ [Express](https://expressjs.com/) is a Node.js web application framework that provides a robust set of features for web and mobile applications.

+ [cors](https://www.npmjs.com/package/cors) will be required to enable our application communicate with the Stripe API by allowing cross-origin requests.

+ [body-parser](https://www.npmjs.com/package/body-parser) will be required to parse the incoming JSON request bodies in a middleware before our handlers.

+ [dotenv](https://www.npmjs.com/package/dotenv) will be required to load environment variables from a `.env` file into `process.env`. We use `.env` to store sensitive information outside of our codebase.

+ [nodemon](https://www.npmjs.com/package/nodemon) will be required to monitor for any changes in our source code and automatically restart our server.

+ [stripe](https://www.npmjs.com/package/stripe) is Node.js library for the Stripe API.

4. Create a `.env` file in the root of our project directory (where `package.json` is located) and add the following environment variables. Replace the values with your own keys.

```bash
PORT = 3000 // Or any other port of your choice
STRIPE_PUBLISHABLE_KEY= your_publishable_key
STRIPE_SECRET_KEY= your_secret_key
```

5. Create an `index.js` file in the root of our project directory and create a basic express server.

```javascript
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

// CREATE SERVER
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```

6. Update your `package.json` file to add the start script.

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js" // add this line
  },
```

7. Run the following command to start our server.

```bash
npm run dev
```

8. Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You should see the following screen:

![Express server running](https://res.cloudinary.com/nishimweprince/image/upload/v1683488318/discover-with-nishimwe/stripe-payment/express-server-sunning_glkd3u.png)

Now that our server is running successfully, let's create a payment gateway using the Stripe Charges API.

## Create payment gateway using Stripe Charges API <a name="create-a-payment-form"></a>

To create test payment gateways, Stripe provides test card numbers that we can use to simulate the payment process. You can find the test card numbers [here](https://stripe.com/docs/testing#cards).

In this demo, we will be using the following card details:

```json
card: {
    "number": "4242424242424242", // This is a VISA card number
    "exp_month": 2, // Choose any valid month of the year
    "exp_year": 2025, // Choose any year in the future
    "cvc": "314", // Any 3 digit number
}
```

1. Create a `checkout route` in our `index.js` file above the `app.listen()` method.

```javascript
// CHECKOUT ROUTE
app.post('/api/checkout', async (req, res) => {
  // RECEIVE PRODUCT AND CARD DETAILS FROM CLIENT
  const { product, card } = req.body;
});
```

2. Create a `try/catch` block inside the `checkout route` and add the following code.

```javascript
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
}
// CATCH ERRORS
catch (error) {
    return res.status(500).json({
      error: error.message,
    });
}
```

### Understanding the code

* We create a Stripe payment token using the `stripe.tokens.create()` method. This method takes payment information as an argument and returns a token object. The payment information may contain card details, and we receive it from the client. <br>
_Stripe payment tokens provide an extra layer of security by allowing you to handle and transmit sensitive payment information in a tokenized form. This reduces the risk of exposing or mishandling sensitive card details within your application._ Learn more about Stripe tokens [here](https://stripe.com/docs/api/tokens).

* We create a Stripe customer using the `stripe.customers.create()` method. The `source` property is the ID of the Stripe payment token that was created in the previous code snippet. <br>
_Stripe customer objects simplifies the process of handling payments, enables recurring billing scenarios, and allows you to provide a better customer experience by storing and managing customer-specific data._ Learn more about Stripe customers [here](https://stripe.com/docs/api/customers).

* We create a Stripe charge using the `stripe.charges.create()` method. Stripe charges are used to process one-time payments or initiate the collection of funds for products or services. <br>
_Once a charge is created using the Stripe API, Stripe handles the processing of the payment, including securely collecting funds from the customer's payment method and transferring them to your Stripe account._ Learn more about Stripe charges [here](https://stripe.com/docs/api/charges).

    - *You will notice that the amount is multiplied by 100. This is because Stripe processes payments in the smallest currency unit. For example, if you are processing a payment in USD, the amount should be multiplied by 100 to convert it to cents.*

* Finally, we send a response to the client with a success message and the charge object. If an error occurs, we `catch` it and send a response with the error message.

## Test payment gateway <a name="test-our-payment-endpoint"></a>

To test our application, we will open Postman and enter the following details:

* **Request URL:** `http://localhost:3000/api/checkout`

* **Request Method:** `POST`

* **Request Body:**

```json
{
    "product": {
        "name": "Brand New Jordan Air Force 1", // Product name >> String
        "price": 237.78 // Product price >> Intenger
    },
    "card": {
    "number": "4242424242424242", // This is a VISA card number
    "exp_month": 2, // Choose any valid month of the year
    "exp_year": 2025, // Choose any year in the future
    "cvc": "314" // Any 3 digit number
}
}
```

* **Response:**

### We should get a response with a success message and the charge object.

![Stripe payment API response](https://res.cloudinary.com/nishimweprince/image/upload/v1683493107/discover-with-nishimwe/stripe-payment/payment-response_icvaqh.png)

### A receipt email is sent to the customer's email address. The receipt contains the product name, price, and the customer's shipping address.

![Stripe payment receipt](https://res.cloudinary.com/nishimweprince/image/upload/v1683493324/discover-with-nishimwe/stripe-payment/receipt-url_sw2vwf.png)

### The payment is reflected in the Stripe dashboard.

![Stripe dashboard](https://res.cloudinary.com/nishimweprince/image/upload/v1683493479/discover-with-nishimwe/stripe-payment/stripe-payment-dashboard_vmrhwu.png)

## Conclusion <a name="conclusion"></a>

In this tutorial, we have learned how you can add a payment collection feature to your application using the Stripe Charges API. We created a Node.js server and used the Stripe Charges API to create a payment gateway. We also learned how to test our payment gateway using Postman. <br>
Of course this a simple implementation, but you can extend it to create more robust payment system that would also take care of things like error handling and avoiding duplicate charges if a user accidentally tries to process the charge twice in a row. <br><br>
You can find the source code for this tutorial on this [GitHub repo](https://github.com/nishimweprince/brushup-with-nishimwe)
<br><br>
Thank you for reading! I hope you found this tutorial helpful. If you have any questions or comments, please feel free to reach out to me on [LinkedIn](https://linkedin.com/in/nishimweprince). I would love to connect with you. See you next week!!<br><br>