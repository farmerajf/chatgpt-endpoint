# ChatGPT Proxy
A private endpoint that allows me to easy integrate other projects with ChatGPT by simplifying the API.

## Setup
Create a default .env file with the following
```
OPENAI_API_KEY=
INTERNAL_API_KEY=
PORT=
```

## Usage
```
curl --data '{ "prompt": "Hello How are you doing?" }' -H 'Content-Type: application/json' -H 'Authorization: Bearer <INTERNAL_API_KEY>' localhost:<PORT>/
```