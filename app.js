import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
import client from "@mailchimp/mailchimp_marketing";
import API from "./API.js";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

client.setConfig({
  apiKey: API,
  server: "us9",
});
const listId = "c92033f280";
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  let userName = req.body.uName;
  let userEmail = req.body.uEmail;
  const subscribingUser = {
    Name: userName,
    email: userEmail,
  };

  const run = async () => {
    const response = await client.lists.batchListMembers(listId, {
      members: [
        {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            NAME: subscribingUser.Name,
          },
        },
      ],
    });
    if (response.error_count == 0) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  };

  run();
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is up and Running on port 3000");
});
