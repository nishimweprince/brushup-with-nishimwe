# Handle image uploads in Node.js/Express applications using Cloudinary

In this article, we are going to learn how to upload images on the server using Node.js/Express and [Cloudinary](https://cloudinary.com/).

## What is Cloudinary?

Cloudinary is a cloud-based image and video management Software-as-a-Service (SaaS). Cloudinary provides an API for uploading, storing, managing, transforming, and delivering images and videos using a Content Delivery Network (CDN). Cloudinary offers a variety of SDKs for different languages and platforms. For more information on their developer solutions, visit [https://cloudinary.com/developers](https://cloudinary.com/developers).

## What are we building?

We are going to build a simple Node.js/Express application that will allow us to upload images to the server using Cloudinary. We will also be able to view the uploaded images in the Cloudinary dashboard.

## Assumptions

* While we will cover everything from scratch and in detail, we will assume that you have a basic understanding of Node.js and Express. If you need a hand with that, you may refer to my previous [article](https://linktr.ee/nishimweprince) where I have elaborated more on these tools.

## Prerequisites

To follow along with this article, you need to have the following installed on your machine:

+ [Node.js](https://nodejs.org/en/download/)
+ A text editor of your choice. I recommend [VS Code](https://code.visualstudio.com/download)
+ [Postman](https://www.postman.com/downloads/): is a very simple and intuitive API testing tool or application. We will use it to test our API endpoints/routes. You can also use [Insomnia](https://insomnia.rest/download) or any other API testing tool of your choice.

+ A Cloudinary account. You can create one [here](https://cloudinary.com/users/registe_free). We will also cover how to create one in the next section.

## Table of contents

1. [Setup Cloudinary account](#setup-cloudinary-account)
2. [Setup our Node.js/Express application](#create-a-nodejsexpress-application)
3. [Upload images to Cloudinary](#upload-images-to-cloudinary)
4. [Test our application using Postman](#test-our-application-using-postman)
5. [Conclusion](#conclusion)

# Let's code

## Setup Cloudinary account <a name="setup-cloudinary-account"></a>

1. Go to [https://cloudinary.com/users/registe_free](https://cloudinary.com/users/registe_free) and create a free account. You can also sign in if you already have an account.

2. After signing into your account, you will be redirected to the console. Click on the **Programmable Media** tab in the left sidebar.

![Cloudinary programmable sidebar](https://res.cloudinary.com/nishimweprince/image/upload/v1684277134/discover-with-nishimwe/cloudinary-upload/cloudinary-programmable-media_bisqpo.png)

3. You will be redirected your Cloudinary Dashboard. Copy the `Cloud Name`, `API Key`, and `API Secret` and save them somewhere. We will use them to access the Cloudinary API in our application.

![Cloudinary dashboard](https://res.cloudinary.com/nishimweprince/image/upload/v1684277133/discover-with-nishimwe/cloudinary-upload/cloudinary-dashboard_gsz97a.png)

## Setting up our Node.js/Express application <a name="create-a-nodejsexpress-application"></a>

1. Create a new directory and name it `cloudinary-upload`. Open it in your favorite text editor. I will be using VS Code.

```bash
mkdir cloudinary-upload
cd cloudinary-upload
code .
```

2. Initialize a new Node.js application using the command below. This will create a `package.json` file in our project directory.

```bash
npm init -y
```

3. Install the following dependencies, I will explain how each of them helps below.

```bash
npm install express body-parser cors dotenv cloudinary
npm install --save-dev nodemon
```

### Understaning the dependencies

+ [Cloudinary](https://www.npmjs.com/package/cloudinary): The Cloudinary Node SDK allows you to quickly and easily integrate your application with Cloudinary.

+ [body-parser](https://www.npmjs.com/package/body-parser): Body parser is an npm library used to process data sent through an HTTP request body. The body-parser middleware converts text sent through an HTTP request to a target format using 4 different parsers: text, JSON, URL encoded, and raw. To learn more about body-parser, visit [https://www.npmjs.com/package/body-parser](https://www.npmjs.com/package/body-parser).

I had explained the rest of the dependencies in my previous [article](https://linktr.ee/nishimweprince).

4. Create a `.env` file in the root of our project directory (where `package.json` is located) and add the following environment variables. Replace the values with your own keys.

```bash
PORT = 3000 // Or any other port of your choice
CLOUDINARY_API_KEY = // Your Cloudinary API key
CLOUDINARY_API_SECRET = // Your Cloudinary API secret
CLOUDINARY_CLOUD_NAME = // Your Cloudinary cloud name
```

5. Create an `index.js` file in the root of our project directory and create a basic express server.

```js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENVIROMENT VARIABLES
const {
  PORT,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} = process.env;

// CONFIGURE CLOUDINARY
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// INITIALIZE EXPRESS
const app = express();

// CONFIGURE MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());

/**
 * @description - This is where we upload our image to cloudinary. We will come back to this later.
 */

// CREATE SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

6. Update your `package.json` file to add the start script and indicate to use ES6 modules.

```json
{
  "name": "cloudinary-upload",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module", // Add this line
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js" // Add this line
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cloudinary": "^1.37.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2"
  }
}

```
7. Run the following command to start our server.

```bash
npm run dev
```
If you see the message `Server is running on port 3000` in your terminal, then you have successfully created a basic express server.

## Upload images to Cloudinary <a name="upload-images-to-cloudinary"></a>

To upload an image to Cloudinary, we will use the `upload` method from the Cloudinary SDK. The `upload` method takes in an image file, uploads it to Cloudinary, and returns a promise containing details of the uploaded image.

The `upload` method in Node.js has the following signature:

```js
cloudinary.uploader.upload(file, options).then(callback);
```

The method takes in various parameters to customize the upload process. The parameters are categorized into two: required and optional. We will focus on the required parameters.

### Required parameters

+ `file`: This is the image file to upload. It can be a path to a local file (supported in SDKs only), the remote HTTP or HTTPS URL address of an existing file, a private storage bucket (S3 or Google Storage), the actual data (byte array buffer), the Data URI (Base64 encoded), or an FTP address of an existing file.

+ `options`: Here we add information that determines how our file is saved in the cloud. We pass in the following attributes:
  
  + `public_id (String)`: The identifier of how a file will be named in the cloud.
  + `folder (String)`: The name of the folder in which the file will be saved.
  + `unique_filename (Boolean)`: If set to true, Cloudinary will add random characters on the file name to ensure that the file name is unique.
  + `use_filename (Boolean)`: If set to true, Cloudinary will use the original file name of the uploaded file.

To read more about all options available, visit the documenation [here](https://cloudinary.com/documentation/image_upload_api_reference#upload_method).

### Uploading an image

We return into our code and add the following code to our `index.js` file.

```js
/**
 * @description - This is where we upload our image to cloudinary. We will come back to this later.
 */

// ADD THESE LINES OF CODE

app.post('/api/upload', async (req, res) => {
  // DESTRUCTURE IMAGE FROM REQ.BODY
  const { image } = req.body;

  try {
    // DEFINE UPLOAD OPTIONS
    const options = {
      public_id: 'sample_image',
      folder: 'sample',
      unique_filename: true,
      use_filename: true,
    };
    // UPLOAD IMAGE TO CLOUDINARY
    const response = await cloudinary.uploader.upload(image, options);
    // RETURN UPLOADED IMAGE DATA
    const uploadedImage = response.url; // You can then store the image url in your database
    // RETURN COMPLETE RESPONSE
    return res.status(200).json({ uploadedImage, response });
    // CATCH ERROR
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
```

### Understanding the code

+ We created a route `/api/upload` that accepts a `POST` request. The route takes in an image from the request body and uploads it to Cloudinary.

+ We created a `try/catch` block to handle errors that may occur during the upload process. Another way to handle errors is to use the `catch` method on the promise returned by the `upload` method.

```js
await cloudinary.uploader.upload(image, options)
.then(callback)
.catch(error => console.log(error));
```

+ We created an `options` object to customize the upload process.

+ We catch the response from the `upload` method and return the image url and the complete response to the client.

Let's test our code.

## Test the application using Postman <a name="test-our-application-using-postman"></a>

1. Open Postman and create a `POST` request to `http://localhost:3000/api/upload`.

2. Add the `image` key to the request body and set the value to the image you want to upload. We will use a link to an image on the internet.

```json
{
    "image": "https://images.unsplash.com/photo-1639020715359-f03b05835829?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
}
```

3. Click on the `Send` button to send the request.

4. You should see the following response:

![Cloudinary response in Postman](https://res.cloudinary.com/nishimweprince/image/upload/v1684334753/discover-with-nishimwe/cloudinary-upload/cloudinary-postman_qd2pai.png)

You will notice that the response contains the image url and other details about the uploaded image.

5. An image is uploaded to Cloudinary. You can check your Cloudinary dashboard to see the uploaded image in its specified folder.

![Image available in Cloudinary Console](https://res.cloudinary.com/nishimweprince/image/upload/v1684335528/discover-with-nishimwe/cloudinary-upload/cloudinary-image-console_oidmnq.png)

## Conclusion <a name="conclusion"></a>

In this tutorial, we learnt how to upload images on the server using the Cloudinary SDK with Node.js/Express. We created a Node.js server using Express and uploaded an image to Cloudinary using the `upload` method from the Cloudinary SDK. We also learnt how to customize the upload process by passing in options to the `upload` method.
<br><br>
Thank you for reading! I hope you found this tutorial helpful. If you have any questions or comments, please feel free to reach out to me on [LinkedIn](https://linkedin.com/in/nishimweprince). I would love to connect with you. See you next week!!<br><br> 