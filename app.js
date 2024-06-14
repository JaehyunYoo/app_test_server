import express from "express";
import axios from "axios";
import { google } from "googleapis";
import fs from "fs";


// 


const app = express();

app.use(express.json());

app.post("/subscribe", async (req, res) => {
    console.log("성공");
    console.log(req.body);
    res.json(200);
    axios.post("https://api.revenuecat.com/v1/incoming-webhooks/apple-server-to-server-notification/WxNCrPrPjrmaINEwiuPMoHEQSuOYUcyC", req.body)
    .then(response => {
      // - Successfully forwarded to RevenueCat
      console.log("Successfully forwarded to RevenueCat", response);
    })
    .catch(error => {
      // - Consider a retry to RevenueCat if there's a network error or status code is 5xx
      // - This is optional as RevenueCat should recheck the receipt within a few hours
      console.error("Failed to send notification to RevenueCat", error);
    });
});


app.listen(8080, () => console.log("서버 온"));



