import { Shifts } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import TelegramBot from 'node-telegram-bot-api';

// replace the value below with the Telegram token you receive from @BotFather
const token = '5232112185:AAGIWqIHz7zoi6FQAsFd-d3P1hxus1H0LcM';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Shifts>
) {
  console.log(req.body);
  const { message, chatId } = req.body;
  const session = await getSession({ req });
  if (session?.user?.email) {
    bot.sendMessage(chatId, message);
  }
  res.end();
}
