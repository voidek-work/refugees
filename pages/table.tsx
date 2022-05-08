import Head from 'next/head';

import { EditUser } from '../components/EditUser';
import styles from '../styles/Home.module.css';
import { prisma } from '../shared/db';

import type { NextPage } from 'next';
import { getSession, GetSessionParams } from 'next-auth/react';
import { Shifts, User } from '@prisma/client';
import { Nav } from '../components/Nav';
import { EditShifts } from '../components/EditShifts';

const Table: NextPage<{ user: User; shifts: Shifts[] }> = ({
  user,
  shifts,
}) => {
  return (
    <>
      <Nav user={user} />
      <div className={styles.container}>
        <Head>
          <title>Таблица редактирования записей</title>
          <meta name='description' content='Таблица редактирования записей' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={`${styles.wide} ${styles.mainWide}`}>
          <EditShifts user={user} shifts={shifts} />
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx);
  let user, shifts;
  console.log(session?.user);

  if (session?.user?.telegramId) {
    user = await prisma.user.findUnique({
      where: { telegramId: session?.user?.telegramId },
    });
    shifts = await prisma.shifts.findMany({
      // where: { telegramId: session?.user?.telegramId },
      include: { user: true },
    });
  }

  if (!user) {
    return {
      redirect: {
        destination: '/telegramAuth',
        permanent: false,
      },
    };
  }

  const { createdAt, ...otherUserData } = user;

  console.log('userEd', user);

  return {
    props: {
      shifts: shifts?.map((s) => {
        const {
          createdAt,
          updatedAt,
          dateStart,
          dateEnd,
          user,
          ...otherShiftData
        } = s;

        return {
          ...otherShiftData,
          ...user,
          createdAt: createdAt.getTime(),
          updatedAt: updatedAt.getTime(),
          dateStart: dateStart.getTime(),
          dateEnd: dateEnd.getTime(),
        };
      }),
      user: { ...otherUserData, createdAt: createdAt.toISOString() },
    },
  };
}

export default Table;
