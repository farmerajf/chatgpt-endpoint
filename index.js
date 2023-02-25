const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const app = express();

app.use(express.json());

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
  const { message } = req.body;
  const result = await getResponse(message);
  res.send(result.data.choices[0].text);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});