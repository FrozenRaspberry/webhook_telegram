const express = require("express")
const bodyParser = require("body-parser")// Initialize express and define a port
const ethers = require('ethers')
const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config()

chatId = process.env.CHAT_ID
const token = process.env.TOKEN

console.log(chatId)
console.log(token)

const bot = new TelegramBot(token, {polling: true});
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  console.log(msg)
  bot.sendMessage(chatId, chatId + '\n' + msg.text);
});


// start express
const app = express()
const PORT = 3000// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.post("/hook", (req, res) => {
  console.log("POST Request")
  console.log(req.body) // Call your action on the request here
  bot.sendMessage(chatId, 'Receive post msg');
  bot.sendMessage(chatId, req.body.from + '\n' + 'https://etherscan.io/tx/' + req.body.hash);
  res.status(200).end() // Responding is important
})
app.get("/hook", (req, res) => {
  console.log("GET Request")
  console.log(req) // Call your action on the request here
  bot.sendMessage(chatId, 'Receive get msg');
  // bot.sendMessage(chatId, req.headers);
  res.status(200).end() // Responding is important
})

bot.sendMessage(chatId, "start hook");
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))