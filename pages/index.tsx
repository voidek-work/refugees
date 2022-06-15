import { getSession, GetSessionParams } from 'next-auth/react';
import Head from 'next/head';

import { AddShift } from '../components/AddShift';
import { Nav } from '../components/Nav';
import { prisma } from '../shared/db';
import { prepareServerDates } from '../shared/prepareDates';
import styles from '../styles/Home.module.css';
import { ExtendedUser } from '../types/extendedUser';

import type { NextPage } from 'next';
const Home: NextPage<{
  user: ExtendedUser;
}> = ({ user }) => {
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
          <AddShift user={user} />
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx);
  let user;
  console.log(session?.user);

  if (session?.user?.telegramId) {
    user = await prisma.user.findUnique({
      where: { telegramId: session?.user?.telegramId },
    });
  }

  console.log('user', user);

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

  const isSupervisor = !!prisma.supervisor.findUnique({
    where: { phone: user.phone },
  });

  const isChief = !!prisma.chief.findUnique({
    where: { phone: user.phone },
  });

  return {
    props: { user: { ...prepareServerDates(user), isSupervisor, isChief } },
  };
}

export default Home;
