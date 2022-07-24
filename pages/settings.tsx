import { Supervisor, User, Chief, MaxCount } from '@prisma/client';
import { getSession, GetSessionParams } from 'next-auth/react';
import Head from 'next/head';

import { EditSupervisors } from '../components/EditSupervisors/EditSupervisors';
import { Nav } from '../components/Nav';
import { prisma } from '../shared/db';
import { prepareServerDates } from '../shared/prepareDates';
import styles from '../styles/Home.module.css';

import type { NextPage } from 'next';
import { EditMaxCounts } from '../components/EditMaxCounts/EditMaxCounts';

const Settings: NextPage<{
  user: User;
  supervisors: Supervisor[];
  chiefs: Chief[];
  counts: MaxCount[];
}> = ({ user, supervisors, chiefs, counts }) => {
  return (
    <>
      <Nav user={user} />
      <div className={styles.container}>
        <Head>
          <title>Настройки</title>
          <meta name='description' content='Настройки' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={`${styles.wide} ${styles.mainWide}`}>
          <EditSupervisors
            user={user}
            chiefs={chiefs}
            supervisors={supervisors}
          />
          <EditMaxCounts counts={counts} />
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx);
  let user, supervisors, chiefs, counts;

  if (session?.user?.telegramId) {
    user = await prisma.user.findUnique({
      where: { telegramId: session?.user?.telegramId },
    });
    supervisors = await prisma.supervisor.findMany({});
    chiefs = await prisma.chief.findMany();
    counts = await prisma.maxCount.findMany();
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
      supervisors: supervisors?.map(prepareServerDates),
      chiefs: chiefs?.map(prepareServerDates),
      counts: counts?.map(prepareServerDates),
      user: prepareServerDates(user),
    },
  };
}

export default Settings;
