import {
  Choice,
  Direction,
  DriverChoice,
  Prisma,
  Shifts,
  User,
} from '@prisma/client';
import { format } from 'date-fns';
import TelegramBot from 'node-telegram-bot-api';
import { prisma } from './db';
import { ShiftStatus } from '@prisma/client';

const preparePhone = (phone: string | null) =>
  phone ? phone.match(/[\d|\+]/g)?.join('') : '';

const sendStatus = ({ shift, bot, chatId }: BotMessagesArgs) => {
  // TODO: статус обновления
  let message = 'Информация по заявке:\r\n';

  if (shift.status === ShiftStatus.CANCELED) {
    message += 'Заявка отменена';
  } else {
    if (
      shift.isDriver === DriverChoice.YES &&
      shift.getVolunteers === Choice.YES &&
      Number(shift.countOfPassenger) > 0
    ) {
      message += 'Вам придёт уведомление о назначении пеших волонтёров';
    }

    if (shift.isDriver === DriverChoice.NO) {
      message += 'Вам придёт уведомление о назначении волонтёра-водителя';
    }
  }

  message += `\r\nНачало смены: ${format(shift.dateStart, 'dd.MM.yyyy HH:mm')}`;

  message += `\r\nОкончание смены: ${format(
    shift.dateEnd,
    'dd.MM.yyyy HH:mm'
  )}`;

  bot.sendMessage(chatId, message);
};

export type BotMessagesArgs = {
  shift: Shifts & { user: User };
  bot: TelegramBot;
  chatId: string;
};

export const sendDriver = async ({ shift, bot, chatId }: BotMessagesArgs) => {
  if (shift.status === ShiftStatus.CANCELED) {
    // relink passengers
    const passengerShifts = await prisma.shifts.findMany({
      where: {
        dateStart: shift.dateStart,
        dateEnd: shift.dateEnd,
        isDriver: DriverChoice.NO,
        telegramNameDriver: shift.telegram,
        status: ShiftStatus.ACTIVE,
      },
      include: {
        user: true,
      },
    });
    if (passengerShifts && passengerShifts.length > 0) {
      passengerShifts.forEach((passengerShift) => {
        sendPassenger({ shift: passengerShift, bot, chatId });
      });
    }
  } else {
    // link passengers
    if (shift?.countOfPassenger && shift.countOfPassenger > 0) {
      const sameShifts = await prisma.shifts.findMany({
        take: shift.countOfPassenger,
        where: {
          dateStart: shift.dateStart,
          dateEnd: shift.dateEnd,
          isDriver: DriverChoice.NO,
          telegramNameDriver: null,
          status: ShiftStatus.ACTIVE,
          // TODO: могут быть разные водители
        },
        include: {
          user: true,
        },
      });
      if (sameShifts) {
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
          const message = `Вам назначен пассажир:\r\nИмя: ${
            same.user.name
          }\r\nТелефон: ${preparePhone(same.user.phone)}\r\nTelegram: @${
            same.user.telegramName
          }          `;

          bot.sendMessage(chatId, message);
        });
      }
    }
  }
};

export const sendPassenger = async ({
  shift,
  bot,
  chatId,
}: BotMessagesArgs) => {
  if (shift.status === ShiftStatus.CANCELED) {
    const driver = await prisma.shifts.findFirst({
      where: {
        dateStart: shift.dateStart,
        dateEnd: shift.dateEnd,
        isDriver: DriverChoice.YES,
        telegram: shift.telegramNameDriver,
      },
    });

    if (driver) {
      const countOfPassenger = +driver.countOfPassenger! + 1;
      const driverShift = await prisma.shifts.update({
        where: {
          id: driver.id,
        },
        data: {
          ...driver,
          countOfPassenger,
        },
        include: {
          user: true,
        },
      });
      sendDriver({ shift: driverShift, bot, chatId });
    }
  } else {
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

        let message = `Вам назначен пассажир:\r\nИмя: ${
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
  }
};
export const sendWithDriver = async ({
  shift,
  bot,
  chatId,
}: BotMessagesArgs) => {
  if (shift.status === ShiftStatus.CANCELED) {
    // TODO: написать логику отмены
  } else {
    if (
      shift?.isDriver === DriverChoice.WITH_DRIVER &&
      shift.direction.length < 2
    ) {
      const where: Prisma.ShiftsFindFirstArgs['where'] = {
        isDriver: DriverChoice.YES,
        status: ShiftStatus.ACTIVE,
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

        let message = `Вам назначен пассажир:\r\nИмя: ${
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
  }
};

export const botMessages = async ({ shift, bot, chatId }: BotMessagesArgs) => {
  sendStatus({ shift, bot, chatId });
  sendDriver({ shift, bot, chatId });
  sendPassenger({ shift, bot, chatId });
  sendWithDriver({ shift, bot, chatId });
};
