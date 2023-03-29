# ChatGPT Proxy
A private endpoint that allows me to easy integrate other projects with ChatGPT

## Setup
Create a default .env file with the following
```
OPENAI_API_KEY=
INTERNAL_API_KEY=
PORT=
```

## Usage
```
curl --data 'Hello How are you doing?' -H 'Content-Type: text/plain' localhost:3000/
```