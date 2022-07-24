import { getSession, GetSessionParams } from 'next-auth/react';
import Head from 'next/head';

import { AddShift } from '../components/AddShift';
import { Nav } from '../components/Nav';
import { prisma } from '../shared/db';
import { prepareServerDates } from '../shared/prepareDates';
import styles from '../styles/Home.module.css';
import { ExtendedUser } from '../types/extendedUser';

import type { NextPage } from 'next';
import {
  dateNight,
  dateMorning,
  dateEvening,
  dateNightNext,
} from '../shared/shiftTimes';
import { Counts } from '../types/counts';
import { TimesOfDay } from '@prisma/client';
const Home: NextPage<{
  user: ExtendedUser;
  counts: Counts;
}> = ({ user, counts }) => {
  return (
    <>
      <Nav user={user} />
      <div className={styles.container}>
        <Head>
          <title>Записаться на смену</title>
          <meta name='description' content='Записаться на смену' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={styles.main}>
          <AddShift user={user} counts={counts} />
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx);
  let user;

  if (session?.user?.telegramId) {
    user = await prisma.user.findUnique({
      where: { telegramId: session?.user?.telegramId },
    });
  }

  if (!user) {
    return {
      redirect: {
        destination: '/telegramAuth',
        permanent: false,
      },
    };
  } else if (!user.city || !user.telegramName || !user.name || !user.phone) {
    return {
      redirect: {
        destination: '/editUser',
        permanent: false,
      },
    };
  }

  const isSupervisor = !!(await prisma.supervisor.findUnique({
    where: { phone: user.phone },
  }));

  const isChief = !!(await prisma.chief.findUnique({
    where: { phone: user.phone },
  }));

  const getDatesByType = (type: TimesOfDay) => {
    switch (type) {
      case TimesOfDay.NIGHT:
        return { dateStart: { gte: dateNight }, dateEnd: { lte: dateMorning } };
      case TimesOfDay.DAY:
        return {
          dateStart: { gte: dateMorning },
          dateEnd: { lte: dateEvening },
        };
      case TimesOfDay.EVENING:
        return {
          dateStart: { gte: dateEvening },
          dateEnd: { lte: dateNightNext },
        };
    }
  };

  const getCurrentCounts = (type: TimesOfDay) => {
    return prisma.shifts.count({
      where: getDatesByType(type),
    });
  };

  const getCount = async (type: TimesOfDay) => ({
    current: await getCurrentCounts(type),
    max:
      (await prisma.maxCount.findMany()).find((c) => c.type === type)?.count ||
      0,
  });

  const counts: Counts = {
    [TimesOfDay.NIGHT]: await getCount(TimesOfDay.NIGHT),
    [TimesOfDay.DAY]: await getCount(TimesOfDay.DAY),
    [TimesOfDay.EVENING]: await getCount(TimesOfDay.EVENING),
  };

  counts[TimesOfDay.NIGHT].current = await prisma.shifts.count({
    where: {
      dateStart: { gte: dateNight },
      dateEnd: { lte: dateMorning },
    },
  });
  counts[TimesOfDay.DAY].current = await prisma.shifts.count({
    where: {
      dateStart: { gte: dateMorning },
      dateEnd: { lte: dateEvening },
    },
  });
  counts[TimesOfDay.EVENING].current = await prisma.shifts.count({
    where: {
      dateStart: { gte: dateEvening },
      dateEnd: { lte: dateNightNext },
    },
  });

  return {
    props: {
      user: { ...prepareServerDates(user), isSupervisor, isChief },
      counts,
    },
  };
}

export default Home;
