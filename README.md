# Screenshot Comparison

The tool uses [Playwright](https://playwright.dev/) to take screenshots of a website and [pixelmatch](https://github.com/mapbox/pixelmatch) to compare them to a reference image.

It is intended to be used in a CI/CD pipeline to detect visual regressions in a specific project, but I think it could be a starting point in case we need anything similiar in the future.

## Setup

You need to provide some configuration values through [dotenv](https://github.com/motdotla/dotenv), please see the [example .env file](./.env.example). Copy as `.env`, then modify its content.

```bash
npm install
npx playwright install
```

## Usage

```bash
npm start
```
