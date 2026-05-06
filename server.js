const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"));
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sayeedmomin09@gmail.com",
    pass:"fneenmhfdvuhyywv"
  }
});


mongoose.connect("mongodb://portfolioUser:Portfolio123@ac-ni5bh2h-shard-00-00.1rvb4fe.mongodb.net:27017,ac-ni5bh2h-shard-00-01.1rvb4fe.mongodb.net:27017,ac-ni5bh2h-shard-00-02.1rvb4fe.mongodb.net:27017/?ssl=true&replicaSet=atlas-nd2q4l-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("ERROR:", err));


const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

const Message = mongoose.model("Message", MessageSchema);


app.post("/contact", async (req, res) => {
  try {

    const msg = new Message(req.body);
    await msg.save();

    const mailOptions = {
      from: req.body.email,
      to: "sayeedmomin@09gamil.com",
      subject: req.body.subject,
      text: `
Name: ${req.body.name}

Email: ${req.body.email}

Message:
${req.body.message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Saved and Email Sent Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving or sending email" });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
