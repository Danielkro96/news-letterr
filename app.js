//Requiring mailchimp's module
const mailchimp = require("@mailchimp/mailchimp_marketing");
//Requiring express and body parser and initializing the constant "app"
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//Using bod-parser
app.use(bodyParser.urlencoded({extended:true}));
//The public folder that hold CSS
app.use(express.static("public"));
//Listening on port 3000 and if it goes well then logging a message saying that the server is running
app.listen(process.env.PORT||3000,function () {
 console.log("Server is running at port 3000");
});
//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
 res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
//***************************** API KEY ******************************
 apiKey: "07bec897449675102ab2b15e0fc36de7-us6",
//***************************** API KEY PREFIX (THE SERVER) ******************************
 server: "us6"
});

//As the sign in button is pressed execute this
app.post("/", function (req,res) {
const firstName = req.body.firstName;
const secondName = req.body.lastName;
const email = req.body.email;
//***************************** LIST ID HERE ******************************
const listId = "24be80779a";
//Creating an object with the user info
const subscribingUser = {
 firstName: firstName,
 lastName: secondName,
 email: email
};
 
//Uploading the data to the server
async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
   email_address: subscribingUser.email,
   status: "subscribed",
   merge_fields: {
   FNAME: subscribingUser.firstName,
   LNAME: subscribingUser.lastName
  }
  });
  //If all goes well logging the contact's id
   res.sendFile(__dirname + "/succes.html")
   console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
 }
//Running the function and catching the errors (if any)
//So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
 run().catch(e => res.sendFile(__dirname + "/failure.html"));
});
