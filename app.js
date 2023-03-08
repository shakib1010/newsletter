const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mailchimp.setConfig({
  apiKey: "8b7e203504a6ee02e820af6591dbc54b-us18",
  server: "us18",
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const listId = "3a5e403a4c";
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
  };

  async function subscribe() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
    } catch (error) {
      res.sendFile(__dirname + "/failure.html");
    }
  }

  subscribe();

  res.sendFile(__dirname + "/success.html");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// API KEY
// 8b7e203504a6ee02e820af6591dbc54b-us18
// AUDIENCE ID
// 3a5e403a4c
