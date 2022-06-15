import { Supervisor, User, Chief } from '@prisma/client';
import { getSession, GetSessionParams } from 'next-auth/react';
import Head from 'next/head';

import { EditSupervisors } from '../components/EditSupervisors/EditSupervisors';
import { Nav } from '../components/Nav';
import { prisma } from '../shared/db';
import { prepareServerDates } from '../shared/prepareDates';
import styles from '../styles/Home.module.css';

import type { NextPage } from 'next';

const Supervisors: NextPage<{
  user: User;
  supervisors: Supervisor[];
  chiefs: Chief[];
}> = ({ user, supervisors, chiefs }) => {
  return (
    <>
      <Nav user={user} />
      <div className={styles.container}>
        <Head>
          <title>Таблица редактирования старших</title>
          <meta name='description' content='Таблица редактирования старших' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={`${styles.wide} ${styles.mainWide}`}>
          <EditSupervisors
            user={user}
            chiefs={chiefs}
            supervisors={supervisors}
          />
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx);
  let user, supervisors, chiefs;

  if (session?.user?.telegramId) {
    user = await prisma.user.findUnique({
      where: { telegramId: session?.user?.telegramId },
    });
    supervisors = await prisma.supervisor.findMany();
    chiefs = await prisma.chief.findMany();
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
    props: {
      supervisors: supervisors?.map(prepareServerDates),
      chiefs: chiefs?.map(prepareServerDates),
      user: prepareServerDates(user),
    },
  };
}

export default Supervisors;
