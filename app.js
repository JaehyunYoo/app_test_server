import express from "express";
import axios from "axios";
import { google } from "googleapis";
import fs from "fs";


// 


const app = express();

const serviceAccount = JSON.parse(
  await fs.promises.readFile("./service_account.json", "utf-8")
);
const scopes = ["https://www.googleapis.com/auth/androidpublisher"];
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: scopes,
});

app.use(express.json());

app.get("/hello", (req, res) => {
  res.status(200).json({
    state: "성공",
  });
});

app.get("/verify-purchase", async (req, res) => {
  const packageName = "com.vespexx.signal";
  const subscriptionId = "product_coin"; // 구독 상품 ID
  const purchaseToken =
    "kamiglpmbnmdikgooegoadnk.AO-J1OymwztVS2a_nBVQtaTYXQgHPTJVkJ771caDyGAH6_UsUfBSQPNd2sL-4oh8HK5kZhOIYw19dbAVhQIgMd68tHDJz_47Tg";

  try {
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${subscriptionId}/tokens/${purchaseToken}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });
    
    console.log(response.data);
    const purchaseData = response.data;
    if (purchaseData.purchaseState === 0) {
      res.status(200).send("Purchase token is valid");
    } else {
      res.status(400).send("Invalid purchase token");
    }
  } catch (error) {
    console.error(
      "Error verifying purchase token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Failed to verify purchase token");
  }
});

app.listen(8080, () => console.log("서버 온"));



