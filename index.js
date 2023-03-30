require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const express = require('express');

const app = express();
app.use(express.text());

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
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  return response;
}

app.post('/', async (req, res) => {
  console.log("Got: " + req.body)
  try {
    // Get Auth header from request
    const authHeader = req.headers.authorization;
    // Check if Auth header is valid
    if (authHeader === undefined || authHeader !== "Bearer " + process.env.INTERNAL_API_KEY) {
      console.log("Unauthorized request");
      res.status(401).send("Unauthorized");
      return;
    }

    const result = await getResponse(req.body);
    console.log("Response: " + result.data.choices[0].text)
    res.send(result.data.choices[0].text);
  } catch (error) {
    console.log("Error: " + error)
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});