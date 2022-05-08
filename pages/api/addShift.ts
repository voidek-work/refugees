// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Choice,
  Direction,
  DriverChoice,
  Shifts,
  Prisma,
} from '@prisma/client';
import { getSession } from 'next-auth/react';

import { prisma } from '../../shared/db';

import type { NextApiRequest, NextApiResponse } from 'next';

import TelegramBot from 'node-telegram-bot-api';
import format from 'date-fns/format';

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN || '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });

const preparePhone = (phone: string | null) =>
  phone ? phone.match(/[\d|\+]/g)?.join('') : '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Shifts>
) {
  console.log(req.body);
  const session = await getSession({ req });

  const chatId = session?.user?.telegramId;
  if (chatId) {
    // const user = await prisma.user.findUnique({
    //   where: { telegramId: chatId },
    // });
    const shift = await prisma.shifts.create({
      data: {
        ...req.body,
        user: { connect: { telegramId: session.user.telegramId } },
      },
      include: {
        user: true,
      },
    });

    let message = 'Ваша заявка подтверждена';
    if (
      shift.isDriver === DriverChoice.YES &&
      shift.getVolunteers === Choice.YES &&
      Number(shift.countOfPassenger) > 0
    ) {
      message += ', вам придёт уведомление о назначении пеших волонтёров';
    }

    if (shift.isDriver === DriverChoice.NO) {
      message += ', вам придёт уведомление о назначении волонтёра-водителя';
    }

    message += `\r\nНачало смены: ${format(
      shift.dateStart,
      'dd.MM.yyyy HH:mm'
    )}`;

    message += `\r\nОкончание смены: ${format(
      shift.dateEnd,
      'dd.MM.yyyy HH:mm'
    )}`;

    bot.sendMessage(chatId, message);

    if (shift?.countOfPassenger && shift.countOfPassenger > 0) {
      const sameShifts = await prisma.shifts.findMany({
        take: shift.countOfPassenger,
        where: {
          dateStart: shift.dateStart,
          dateEnd: shift.dateEnd,
          isDriver: DriverChoice.NO,
          telegramNameDriver: null,
          // TODO: могут быть разные водители
        },
        include: {
          user: true,
        },
      });
      if (sameShifts) {
        console.log('shift.user.telegramName', shift.user.telegramName);
        console.log(
          'sameShifts',
          sameShifts.map((same) => {
            return same.id;
          })
        );

        const updated = await prisma.shifts.updateMany({
          where: {
            id: {
              in: sameShifts.map((same) => {
                return same.id;
              }),
            },
          },
          data: {
            telegramNameDriver: shift.user.telegramName,
          },
        });

        const current = await prisma.shifts.update({
          where: {
            id: shift.id,
          },
          data: {
            countOfPassenger: shift.countOfPassenger - updated.count,
          },
        });

        sameShifts.forEach((same) => {
          message = `Вам назначен пассажир:\r\nИмя: ${
            same.user.name
          }\r\nТелефон: ${preparePhone(same.user.phone)}\r\nTelegram: @${
            same.user.telegramName
          }          `;

          bot.sendMessage(chatId, message);
        });
      }
    }

    if (shift?.isDriver === DriverChoice.NO) {
      const sameShift = await prisma.shifts.findFirst({
        where: {
          dateStart: shift.dateStart,
          dateEnd: shift.dateEnd,
          isDriver: DriverChoice.YES,
          countOfPassenger: {
            gt: 0,
          },
          // TODO: могут быть разные водители
        },
        include: {
          user: true,
        },
      });
      if (sameShift) {
        const updatedCurrent = await prisma.shifts.update({
          where: {
            id: shift.id,
          },
          data: {
            telegramNameDriver: sameShift.user.telegramName,
          },
        });

        console.log('sameShift', sameShift);

        const updatedDriver = await prisma.shifts.update({
          where: {
            id: sameShift.id,
          },
          data: {
            countOfPassenger: sameShift.countOfPassenger
              ? sameShift.countOfPassenger - 1
              : sameShift.countOfPassenger,
          },
        });

        message = `Вам назначен пассажир:\r\nИмя: ${
          shift.user.name
        }\r\nТелефон: ${preparePhone(shift.user.phone)}\r\nTelegram: @${
          shift.user.telegramName
        }`;

        bot.sendMessage(sameShift.user.telegramId!, message);

        message = `Вам назначен водитель:\r\nИмя: ${
          sameShift.user.name
        }\r\nТелефон: ${preparePhone(sameShift.user.phone)}\r\nTelegram: @${
          sameShift.user.telegramName
        }\r\nОбязательно свяжитесь с ним для уточнения деталей`;

        bot.sendMessage(chatId, message);
      }
    }

    if (
      shift?.isDriver === DriverChoice.WITH_DRIVER &&
      shift.direction.length < 2
    ) {
      const where: Prisma.ShiftsFindFirstArgs['where'] = {
        isDriver: DriverChoice.YES,
        countOfPassenger: {
          gt: 0,
        },
      };
      if (shift.direction[0] === Direction.THERE) {
        where.dateEnd = shift.dateEnd;
      }
      if (shift.direction[0] === Direction.BACK) {
        where.dateStart = shift.dateStart;
      }
      const sameShift = await prisma.shifts.findFirst({
        where,
        include: {
          user: true,
        },
      });
      if (sameShift) {
        const updatedCurrent = await prisma.shifts.update({
          where: {
            id: shift.id,
          },
          data: {
            telegramNameDriver: sameShift.user.telegramName,
          },
        });

        console.log('sameShift', sameShift);

        const updatedDriver = await prisma.shifts.update({
          where: {
            id: sameShift.id,
          },
          data: {
            countOfPassenger: sameShift.countOfPassenger
              ? sameShift.countOfPassenger - 1
              : sameShift.countOfPassenger,
          },
        });

        message = `Вам назначен пассажир:\r\nИмя: ${
          shift.user.name
        }\r\nТелефон: ${preparePhone(shift.user.phone)}\r\nTelegram: @${
          shift.user.telegramName
        }\r\n${
          shift.direction[0] === Direction.THERE
            ? 'На точку пассажир доберётся сам, с вами поедет обратно в город'
            : 'Пассажира нужно будет привести на точку, обратно он доберется сам'
        }`;

        bot.sendMessage(sameShift.user.telegramId!, message);

        message = `Вам назначен водитель:\r\nИмя: ${
          sameShift.user.name
        }\r\nТелефон: ${preparePhone(sameShift.user.phone)}\r\nTelegram: @${
          sameShift.user.telegramName
        }\r\nОбязательно свяжитесь с ним для уточнения деталей`;

        bot.sendMessage(chatId, message);
      }
    }

    res.status(200).json(shift);
  }
  res.end();
}
