# Amazon Cognito Sample

[https://stealth-store.vercel.app](https://stealth-store.vercel.app)

## Pre-requisites

- AWS Cognito User Pool: [Getting started with user pools](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-user-pools.html)
- An App Client within your Cognito user pool: [Create a new application in Amazon Cognito console](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-user-pools-application.html)

## Run Locally

Create `.env.local` file with the following.

```bash
VITE_COGNITO_URI=[Amazon Cognito User Pool URI]
VITE_CLIENT_ID=[User Pool App Client ID]
VITE_REDIRECT_URI=http://localhost:5173/redirect
VITE_LOGOUT_URI=http://localhost:5173
VITE_SERVICES_URI=[Services URL from aws-lambda-sample repo]
VITE_RESERVATIONS_URI=[Reservations URL from aws-lambda-sample repo]
```

Install dependencies.

```bash
npm install -g pnpm
pnpm install
```

Run locally.

```bash
pnpm dev
```
