const fs = require('fs');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const express = require('express');

const app = express();
app.use(express.json());

var conversationFilePath = "./conversation.txt";

// Default prompt
var defaultPrompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n"
// Conversation max lines
var conversationMaxLines = 1000;


// Check is a file exists
if (!fs.existsSync(conversationFilePath)) {
  //If the file does not exist, create it
  fs.writeFileSync(conversationFilePath, defaultPrompt);
}

// Read the contents of the file
var conversation = fs.readFileSync(conversationFilePath, 'utf8');

// Check for OpenAI API key
if (process.env.OPENAI_API_KEY === "") {
  console.log("Please set the OPENAI_API_KEY environment variable.");
  process.exit(1);
}

// Check for internal API key
if (process.env.INTERNAL_API_KEY === "") {
  console.log("Please set the INTERNAL_API_KEY environment variable.");
  process.exit(1);
}

// Check for port
process.env.PORT = Number(process.env.PORT);
if (process.env.PORT === undefined || process.env.PORT <= 0 || process.env.PORT > 65536) {
  console.log("Please set the PORT environment variable.");
  process.exit(1);
}

async function getResponse(message) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,

  });
  return response;
}

app.post('/', async (req, res) => {
  let { prompt } = req.body;

  //Trim the prompt
  prompt = prompt.trim();

  // Add the prompt to the conversation
  conversation += prompt + "\n";

  try {
    // Get Auth header from request
    const authHeader = req.headers.authorization;
    // Check if Auth header is valid
    if (authHeader === undefined || authHeader !== "Bearer " + process.env.INTERNAL_API_KEY) {
      console.log("Unauthorized request");
      res.status(401).send("Unauthorized");
      return;
    }

    const result = await getResponse(conversation);
    
    var response = result.data.choices[0].text;
    // Trim the response
    response = response.trim();

    // Add the response to the conversation
    conversation += response + "\n";

    console.log("Conversation: " + conversation + "\n\n")
    res.send(result.data.choices[0].text);

    // Check if the conversation is too long
    if (conversation.split("\n").length > conversationMaxLines) {
      // If the conversation is too long, remove the second and third line but keeping the first line
      var lines = conversation.split("\n");
      conversation = lines[0] + "\n";
      conversation += lines.slice(3).join("\n");
    }

    // Write the conversation to the file
    fs.writeFileSync(conversationFilePath, conversation);
  } catch (error) {
    console.log("Error: " + error)
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});