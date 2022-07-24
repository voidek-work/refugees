import { ChiefShift, Choice, DriverChoice, Shifts, User } from '@prisma/client';
import add from 'date-fns/add';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import set from 'date-fns/set';
import { getSession, GetSessionParams } from 'next-auth/react';
import Head from 'next/head';

import { Nav } from '../components/Nav';
import { ScheduleShift } from '../components/ScheduleShift/ScheduleShift';
import { prisma } from '../shared/db';
import { prepareServerDates } from '../shared/prepareDates';
import { dateEvening, dateMorning, dateNight, dateNightNext } from '../shared/shiftTimes';
import styles from '../styles/Home.module.css';

import type { NextPage } from 'next';

type ExtendedShifts = (Shifts & { user: User })[];

const Schedule: NextPage<{
  user: User;
  schedule: JSX.Element;
}> = ({ schedule, user }) => {
  const date = format(new Date(), 'dd.MM.yyyy');
  return (
    <>
      <Nav user={user} />
      <div className={styles.container}>
        <Head>
          <title>График смен на {date}</title>
          <meta name='description' content={`График смен на ${date}`} />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={styles.main}>
          <ScheduleShift user={user} schedule={schedule} />
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx);
  const date = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const dateEnd = add(date, {
    days: 1,
  });
  const formatedDate = format(date, 'dd.MM');
  let user, schedule, shifts: ExtendedShifts;

  if (session?.user?.telegramId) {
    user = await prisma.user.findUnique({
      where: { telegramId: session?.user?.telegramId },
    });
    shifts = await prisma.shifts.findMany({
      where: {
        dateStart: {
          gte: date,
        },
        dateEnd: {
          lte: dateEnd,
        },
      },
      include: {
        user: true,
      },
    });

    const makeSupervisor = (shifts: ExtendedShifts) => {
      const supervisor = shifts.find(
        (shift) => shift.isSupervisor === Choice.YES
      );
      const driver = shifts.find(
        (shift) => shift.user.telegramName === supervisor?.telegramNameDriverTo
      );

      return supervisor
        ? `${supervisor?.user?.name?.toUpperCase()} (${
            supervisor?.isDriver === DriverChoice.YES
              ? 'на машине'
              : `с ${driver?.user?.name}`
          }) ${supervisor?.user?.phone} - СТАРШАЯ(ИЙ) смены ${
            supervisor?.chiefShift ? 'и начальник штаба' : ''
          }`
        : '';
    };

    const makeChief = (shifts: ExtendedShifts, chiefType: ChiefShift) => {
      const chief = shifts.find((shift) => shift.chiefShift === chiefType);
      const supervisor = shifts.find(
        (shift) => shift.isSupervisor === Choice.YES
      );
      if (chief === supervisor) {
        return '';
      }
      const driver = shifts.find(
        (shift) => shift.user.telegramName === chief?.telegramNameDriverTo
      );

      return chief
        ? `${chief?.user?.name?.toUpperCase()} (${
            chief?.isDriver === DriverChoice.YES
              ? 'на машине'
              : `с ${driver?.user?.name}`
          }) ${chief?.user?.phone} - начальник штаба`
        : '';
    };

    const makeSimpleShift = (shifts: ExtendedShifts) => {
      return shifts
        .map((shift) => {
          let message = '';
          const {
            user: { name, city, phone },
            isDriver,
            countOfPassengerTo,
            countOfPassengerBack,
          } = shift;

          message += name;

          const isPessanger =
            isDriver === DriverChoice.NO ||
            isDriver === DriverChoice.WITH_DRIVER;
          let driverMessage = '';
          if (isPessanger) {
            const driverTo = shifts.find(
              (s) => shift.user.telegramName === s.telegramNameDriverTo
            );
            const driverBack = shifts.find(
              (s) => shift.user.telegramName === s.telegramNameDriverBack
            );
            driverMessage = `(${
              driverTo?.user?.name ? `туда с ${driverTo?.user?.name}` : ''
            }${
              driverBack?.user?.name
                ? `, обратно с ${driverBack?.user?.name}`
                : ''
            })`;
          } else {
            const isDefaultCity = city?.toLowerCase() === 'таганрог';
            driverMessage = isDefaultCity
              ? `(на машине, ${countOfPassengerTo}, ${countOfPassengerBack})`
              : `(на машине, ${countOfPassengerTo}, ${countOfPassengerBack}, ${city})`;
          }

          message += `, ${driverMessage} ${phone}`;

          return message;
        })
        .join('\r\n');
    };

    const makeShift =
      (dateStart: Date, dateEnd: Date, chiefType: ChiefShift) => () => {
        const filteredShifts = shifts.filter((shift) => {
          return (
            (isAfter(shift.dateStart, dateStart) &&
              isBefore(shift.dateEnd, dateEnd)) ||
            (isEqual(shift.dateStart, dateStart) &&
              isEqual(shift.dateEnd, dateEnd))
          );
        });

        return `${format(dateStart, 'HH:mm')}-${format(
          dateEnd,
          'HH:mm'
        )}\r\n${makeSupervisor(filteredShifts)}${makeChief(
          filteredShifts,
          chiefType
        )}\r\n${makeSimpleShift(filteredShifts)}`;
      };

    const makeNightShift = makeShift(
      dateNight,
      dateMorning,
      ChiefShift.MORNING
    );
    const makeDayShift = makeShift(
      dateMorning,
      dateEvening,
      ChiefShift.MORNING
    );
    const makeEveningShift = makeShift(
      dateEvening,
      dateNightNext,
      ChiefShift.MORNING
    );

    schedule = `
Приветстую!\r\n
${formatedDate} актуальный список на сегодня:\r\n
${makeNightShift().trim()}\r\n
${makeDayShift().trim()}\r\n
${makeEveningShift().trim()}\r\n
Подключайтесь! Вы все очень нужны и важны💜`;
  }

  if (!user) {
    return {
      redirect: {
        destination: '/telegramAuth',
        permanent: false,
      },
    };
  }

  if (!user.isAdmin) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      schedule,
      user: prepareServerDates(user),
    },
  };
}

export default Schedule;
