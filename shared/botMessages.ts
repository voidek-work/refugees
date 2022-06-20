import {
  Choice,
  Direction,
  DriverChoice,
  Prisma,
  Shifts,
  User,
  ShiftStatus,
} from '@prisma/client';
import { format } from 'date-fns';
import TelegramBot from 'node-telegram-bot-api';
import { prisma } from './db';

const preparePhone = (phone: string | null) =>
  phone ? phone.match(/[\d|\+]/g)?.join('') : '';

const sendStatus = ({ shift, bot, chatId }: BotMessagesArgs) => {
  // TODO: статус обновления
  let message = 'Информация по заявке:\r\n';

  if (shift.status === ShiftStatus.CANCELLED) {
    message += 'Заявка отменена';
  } else {
    if (
      (shift.isDriver === DriverChoice.YES &&
        shift.getVolunteers === Choice.YES &&
        Number(shift.countOfPassengerTo) > 0) ||
      Number(shift.countOfPassengerBack) > 0
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

const cancelPassenger = async ({
  direction,
  shift,
  bot,
  chatId,
}: BotMessagesArgs & { direction: Direction }) => {
  const isTo = direction === Direction.TO;
  const where: Prisma.ShiftsFindFirstArgs['where'] = {
    isDriver: DriverChoice.NO,
    status: ShiftStatus.ACTIVE,
  };

  if (isTo) {
    where.dateStart = shift.dateStart;
    where.telegramNameDriverTo = shift.telegram;
  } else {
    where.dateEnd = shift.dateEnd;
    where.telegramNameDriverBack = shift.telegram;
  }

  // relink passengers
  const passengerShifts = await prisma.shifts.findMany({
    where,
    include: {
      user: true,
    },
  });
  if (passengerShifts && passengerShifts.length > 0) {
    passengerShifts.forEach((passengerShift) => {
      sendPassenger({ shift: passengerShift, bot, chatId });
    });
  }
};

const sendMessageToPassenger = ({
  isTo,
  shift: driverShift,
  bot,
  chatId,
}: BotMessagesArgs & { isTo: boolean }) => {
  const message = `Вам назначен водитель (${
    isTo ? 'туда' : 'обратно'
  }):\r\nИмя: ${driverShift.user.name}\r\nТелефон: ${preparePhone(
    driverShift.user.phone
  )}\r\nTelegram: @${
    driverShift.user.telegramName
  }\r\nОбязательно свяжитесь с ним для уточнения деталей`;

  bot.sendMessage(chatId, message);
};

const sendMessageToDriver = ({
  isTo,
  shift: passengerShift,
  bot,
  chatId,
}: BotMessagesArgs & { isTo: boolean }) => {
  const message = `Вам назначен пассажир (${
    isTo ? 'туда' : 'обратно'
  }):\r\nИмя: ${passengerShift.user.name}\r\nТелефон: ${preparePhone(
    passengerShift.user.phone
  )}\r\nTelegram: @${passengerShift.user.telegramName}`;

  bot.sendMessage(chatId, message);
};

const linkPassengers = async ({
  direction,
  shift,
  bot,
  chatId,
}: BotMessagesArgs & { direction: Direction }) => {
  const isTo = direction === Direction.TO;
  const where: Prisma.ShiftsFindFirstArgs['where'] = {
    isDriver: DriverChoice.NO,
    status: ShiftStatus.ACTIVE,
  };

  if (isTo) {
    where.dateStart = shift.dateStart;
    where.telegramNameDriverTo = null;
  } else {
    where.dateEnd = shift.dateEnd;
    where.telegramNameDriverBack = null;
  }

  if (
    (isTo && shift?.countOfPassengerTo && shift.countOfPassengerTo > 0) ||
    (!isTo && shift?.countOfPassengerBack && shift.countOfPassengerBack > 0)
  ) {
    const sameShifts = await prisma.shifts.findMany({
      take: isTo ? shift.countOfPassengerTo! : shift.countOfPassengerBack!,
      where,
      include: {
        user: true,
      },
    });

    if (sameShifts) {
      const data: Partial<Shifts> = {};
      if (isTo) {
        data.telegramNameDriverTo = shift.user.telegramName;
      } else {
        data.telegramNameDriverBack = shift.user.telegramName;
      }

      const updatedPassengers = await prisma.shifts.updateMany({
        where: {
          id: {
            in: sameShifts.map((same) => {
              return same.id;
            }),
          },
        },
        data,
      });

      const dataCount: Partial<Shifts> = {};
      if (isTo) {
        data.countOfPassengerTo =
          shift.countOfPassengerTo! - updatedPassengers.count;
      } else {
        data.countOfPassengerBack =
          shift.countOfPassengerBack! - updatedPassengers.count;
      }

      const driver = await prisma.shifts.update({
        where: {
          id: shift.id,
        },
        include: {
          user: true,
        },
        data: dataCount,
      });

      sendMessageToPassenger({ shift: driver, bot, chatId, isTo });

      sameShifts.forEach((same) => {
        sendMessageToDriver({
          shift: same,
          chatId,
          bot,
          isTo,
        });
      });
    }
  }
};

export const sendDriver = async ({ shift, bot, chatId }: BotMessagesArgs) => {
  if (shift.status === ShiftStatus.CANCELLED) {
    cancelPassenger({ shift, bot, chatId, direction: Direction.TO });
    cancelPassenger({ shift, bot, chatId, direction: Direction.BACK });
  } else {
    linkPassengers({ shift, bot, chatId, direction: Direction.TO });
    linkPassengers({ shift, bot, chatId, direction: Direction.BACK });
  }
};

const cancelDriver = async ({
  direction,
  shift,
  bot,
  chatId,
}: BotMessagesArgs & { direction: Direction }) => {
  const isTo = direction === Direction.TO;
  const where: Prisma.ShiftsFindFirstArgs['where'] = {
    isDriver: DriverChoice.YES,
    telegram: isTo ? shift.telegramNameDriverTo : shift.telegramNameDriverBack,
  };

  if (isTo) {
    where.dateStart = shift.dateStart;
  } else {
    where.dateEnd = shift.dateEnd;
  }

  const driver = await prisma.shifts.findFirst({
    where,
  });

  if (driver) {
    const data = { ...driver };
    if (isTo) {
      data.countOfPassengerTo = +driver.countOfPassengerTo! + 1;
    } else {
      data.countOfPassengerBack = +driver.countOfPassengerBack! + 1;
    }
    const driverShift = await prisma.shifts.update({
      where: {
        id: driver.id,
      },
      data,
      include: {
        user: true,
      },
    });
    sendDriver({ shift: driverShift, bot, chatId });
  }
};

const linkDrivers = async ({
  direction,
  shift,
  bot,
  chatId,
}: BotMessagesArgs & { direction: Direction }) => {
  const isTo = direction === Direction.TO;
  const where: Prisma.ShiftsFindFirstArgs['where'] = {
    status: ShiftStatus.ACTIVE,
    isDriver: DriverChoice.YES,
  };

  if (isTo) {
    where.dateStart = shift.dateStart;
    where.countOfPassengerTo = {
      gt: 0,
    };
  } else {
    where.dateEnd = shift.dateEnd;
    where.countOfPassengerBack = {
      gt: 0,
    };
  }

  const driverShift = await prisma.shifts.findFirst({
    where,
    include: {
      user: true,
    },
  });
  if (driverShift) {
    const data: Partial<Shifts> = {};
    if (isTo) {
      data.telegramNameDriverTo = driverShift.user.telegramName;
    } else {
      data.telegramNameDriverBack = driverShift.user.telegramName;
    }
    await prisma.shifts.update({
      where: {
        id: shift.id,
      },
      data,
    });

    const driverData: Partial<Shifts> = {};

    if (isTo) {
      driverData.countOfPassengerTo = driverShift.countOfPassengerTo
        ? driverShift.countOfPassengerTo - 1
        : driverShift.countOfPassengerTo;
    } else {
      driverData.countOfPassengerBack = driverShift.countOfPassengerBack
        ? driverShift.countOfPassengerBack - 1
        : driverShift.countOfPassengerBack;
    }
    await prisma.shifts.update({
      where: {
        id: driverShift.id,
      },
      data: driverData,
    });

    sendMessageToDriver({
      shift,
      chatId: driverShift.user.telegramId!,
      bot,
      isTo,
    });

    sendMessageToPassenger({ shift: driverShift, bot, chatId, isTo });
  }
};

export const sendPassenger = async ({
  shift,
  bot,
  chatId,
}: BotMessagesArgs) => {
  if (shift.status === ShiftStatus.CANCELLED) {
    cancelDriver({
      shift,
      bot,
      chatId,
      direction: Direction.TO,
    });
    cancelDriver({
      shift,
      bot,
      chatId,
      direction: Direction.BACK,
    });
  } else {
    if (shift?.isDriver === DriverChoice.NO) {
      linkDrivers({
        shift,
        bot,
        chatId,
        direction: Direction.TO,
      });
      linkDrivers({
        shift,
        bot,
        chatId,
        direction: Direction.BACK,
      });
    }
  }
};

const linkPassengersWithDriver = async ({
  direction,
  shift,
  bot,
  chatId,
}: BotMessagesArgs & { direction: Direction }) => {
  const isTo = direction === Direction.TO;

  const where: Prisma.ShiftsFindFirstArgs['where'] = {
    isDriver: DriverChoice.YES,
    status: ShiftStatus.ACTIVE,
  };

  if (isTo) {
    where.dateStart = shift.dateStart;
    where.countOfPassengerTo = {
      gt: 0,
    };
  } else {
    where.dateEnd = shift.dateEnd;
    where.countOfPassengerBack = {
      gt: 0,
    };
  }

  const driverShift = await prisma.shifts.findFirst({
    where,
    include: {
      user: true,
    },
  });
  if (driverShift) {
    const data: Partial<Shifts> = {};
    if (isTo) {
      data.telegramNameDriverTo = driverShift.user.telegramName;
    } else {
      data.telegramNameDriverBack = driverShift.user.telegramName;
    }

    await prisma.shifts.update({
      where: {
        id: shift.id,
      },
      data,
    });

    const driverData: Partial<Shifts> = {};
    if (isTo) {
      driverData.countOfPassengerTo = driverShift.countOfPassengerTo
        ? driverShift.countOfPassengerTo - 1
        : driverShift.countOfPassengerTo;
    } else {
      driverData.countOfPassengerBack = driverShift.countOfPassengerBack
        ? driverShift.countOfPassengerBack - 1
        : driverShift.countOfPassengerBack;
    }

    await prisma.shifts.update({
      where: {
        id: driverShift.id,
      },
      data: driverData,
    });

    sendMessageToDriver({
      shift,
      chatId: driverShift.user.telegramId!,
      bot,
      isTo,
    });

    sendMessageToPassenger({ shift: driverShift, chatId, bot, isTo });
  }
};

export const sendWithDriver = async ({
  shift,
  bot,
  chatId,
}: BotMessagesArgs) => {
  if (shift.status === ShiftStatus.CANCELLED) {
    shift.direction.forEach((direction) =>
      cancelDriver({
        shift,
        bot,
        chatId,
        direction,
      })
    );
  } else {
    if (
      shift?.isDriver === DriverChoice.WITH_DRIVER &&
      shift.direction.length > 0
    ) {
      shift.direction.forEach((direction) =>
        linkPassengersWithDriver({
          shift,
          bot,
          chatId,
          direction,
        })
      );
    }
  }
};

export const botMessages = async ({ shift, bot, chatId }: BotMessagesArgs) => {
  sendStatus({ shift, bot, chatId });
  sendDriver({ shift, bot, chatId });
  sendPassenger({ shift, bot, chatId });
  sendWithDriver({ shift, bot, chatId });
};
