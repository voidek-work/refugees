import Head from 'next/head';

import { EditUser } from '../components/EditUser';
import styles from '../styles/Home.module.css';
import { prisma } from '../shared/db';

import type { NextPage } from 'next';
import { getSession, GetSessionParams } from 'next-auth/react';
import { User } from '@prisma/client';
import { Nav } from '../components/Nav';
import { prepareServerDates } from '../shared/prepareDates';

const EditUserPage: NextPage<{ user: User }> = ({ user }) => {
  return (
    <>
      <Nav user={user} />
      <div className={styles.container}>
        <Head>
          <title>Регистрация</title>
          <meta name='description' content='Регистрация' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={styles.main}>
          <EditUser user={user} />
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
  }

  return {
    props: { user: prepareServerDates(user) },
  };
}

export default EditUserPage;
