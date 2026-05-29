# Broadway Beer Wine & Spirits — Website

Custom marketing and discovery site for [Broadway Beer Wine & Spirits](https://www.broadwaybeerwine.ca), Kitsilano, Vancouver.

Built with [Eleventy](https://www.11ty.dev/), Vercel serverless functions, and the Anthropic API.

## Features

- "Ask Chris" AI chat — Claude-powered sommelier
- Party planner with quantity calculator and product picks
- Live inventory from Barnet POS
- Gift wizard
- Food pairing guide
- Whisky guide

## Setup

```bash
npm install
cp .env.example .env
# fill in your API keys
npm run dev
```

## Deploy

Deployed to Vercel. Connect the repo in the Vercel dashboard and set the environment variables from `.env.example`.

## Environment variables

See `.env.example`.

## Stack

- **Generator:** Eleventy 3.x
- **Templates:** Nunjucks
- **Serverless:** Vercel (Node 20)
- **AI:** Anthropic Claude
- **POS:** Barnet Network API
