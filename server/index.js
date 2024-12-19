import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"
import morgan from "morgan";
import clientRoutes from "./routes/client.js"
import generalRoutes from "./routes/general.js"
import managementRoutes from "./routes/management.js"
import salesRoutes from "./routes/sales.js"
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";




//data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js"


import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";


// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());



// ROUTES 

app.use("/client",clientRoutes);
app.use("/general",generalRoutes);
app.use("/management",managementRoutes);
app.use("/sales",salesRoutes);




// MONGOOSE SETUP 
const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    
    // Insert/Update User Data
    const userOps = dataUser.map((user) => ({
      updateOne: {
        filter: { _id: user._id }, // Match by _id
        update: { $set: user }, // Update the document
        upsert: true, // Insert if not found
      },
    }));
    await User.bulkWrite(userOps);
    console.log("User data inserted/updated successfully.");



    // Insert/Update Product Data
    const productOps = dataProduct.map((product) => ({
      updateOne: {
        filter: { _id: product._id }, // Match by _id
        update: { $set: product },
        upsert: true,
      },
    }));
    await Product.bulkWrite(productOps);
    console.log("Product data inserted/updated successfully.");



    // Insert/Update ProductStat Data
    const productStatOps = dataProductStat.map((stat) => ({
      updateOne: {
        filter: { _id: stat._id }, // Match by _id
        update: { $set: stat },
        upsert: true,
      },
    }));
    await ProductStat.bulkWrite(productStatOps);
    console.log("ProductStat data inserted/updated successfully.");




    // Insert/Update Transaction Data
    const transactionOps = dataTransaction.map((transaction) => ({
      updateOne: {
        filter: { _id: transaction._id }, // Match by _id
        update: { $set: transaction }, // Update the document
        upsert: true, // Insert if not found
      },
    }));
    await Transaction.bulkWrite(transactionOps);
    console.log("Transaction data inserted/updated successfully.");




    // Insert/Update OverallStat Data
    const overallstatOps = dataOverallStat.map((overallstat) => ({
      updateOne: {
        filter: { _id: overallstat._id },
        update: { $set: overallstat },
        upsert: true,
      },
    }));
    await OverallStat.bulkWrite(overallstatOps);
    console.log("OverallStat data inserted/updated successfully.");
  






  // affiliatestat data
  const affiliatestatOps = dataAffiliateStat.map((affiliatestat) => ({
    updateOne: {
      filter: { _id: affiliatestat._id },
      update: { $set: affiliatestat },
      upsert: true,
    },
  }));
  await AffiliateStat.bulkWrite(affiliatestatOps);
  console.log("AffiliateStat data inserted/updated successfully.");






})
  .catch((error) => console.log(`${error} did not connect`));


