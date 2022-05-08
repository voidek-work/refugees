import { PrismaClient, User } from '@prisma/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { AddShift } from '../components/AddShift';
import { prisma } from '../shared/db';
import { getSession, GetSessionParams } from 'next-auth/react';
import { Nav } from '../components/Nav';

const Home: NextPage<{
  user: User;
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

  const { createdAt, ...otherUserData } = user;

  return {
    props: { user: { ...otherUserData, createdAt: createdAt.toISOString() } },
  };
}

export default Home;
