// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Shifts, User } from '@prisma/client';
import { getSession } from 'next-auth/react';
import TelegramBot from 'node-telegram-bot-api';

import { botMessages } from '../../../shared/botMessages';
import { prisma } from '../../../shared/db';

import type { NextApiRequest, NextApiResponse } from 'next';

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN || '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Shifts>
) {
  const session = await getSession({ req });

  const chatId = session?.user?.telegramId;

  if (chatId) {
    if (req.body.user) {
      const {
        city,
        name,
        phone,
        telegramName,
        dateOfBirthday,
        passport,
        passportAddress,
      } = req.body.user as User;

      await prisma.user.update({
        where: {
          id: req.body.user.id as string,
        },
        data: {
          city,
          name,
          phone,
          telegramName,
          dateOfBirthday,
          passport,
          passportAddress,
        },
      });

      delete req.body.user;
    }

    let shift;

    if (req.query.id === 'new') {
      shift = await prisma.shifts.create({
        data: {
          ...req.body,
          user: { connect: { telegramId: session.user.telegramId } },
        },
        include: {
          user: true,
        },
      });
    } else {
      shift = await prisma.shifts.update({
        where: {
          id: req.query.id as string,
        },
        data: {
          ...req.body,
          // user: { connect: { telegramId: session.user.telegramId } },
        },
        include: {
          user: true,
        },
      });
    }

    console.log('shift:', shift);

    botMessages({ shift, bot, chatId });

    res.status(200).json(shift);
  }
  res.end();
}
