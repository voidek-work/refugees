This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

в hosts нужно будет указать

```
127.0.0.1       refugees.test
```

Бот называется @RefugeesHelpBot

Сейчас есть проблема с тем, что адрес с которого можно слать запросы только один, прописать адрес приложения в хостс у меня не получилось, поэтому приходится переключать в боте http://refugees.test/ и https://refugees-help.vercel.app/ это можно решить сделав отдельного dev бота, но это не реализвано

Используется ORM [https://www.prisma.io/](https://www.prisma.io/)

При обновлении схемы:

Всё дропаем (дев режим не работает с хероку), скорее всего нужно будет купить где-то в России базу и переехать
```
npx prisma migrate reset
```
```
npx prisma db push
```

Ещё не нашёл способ читать env.local, в случае ошибок скопировать env.local в .env, но не коммитить .env

Open [http://refugees.test](http://refugees.test) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction)

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
