import { getSession, GetSessionParams, signIn } from 'next-auth/react';
import Head from 'next/head';

import styles from '../styles/Home.module.css';

import { prisma } from './db';

import type { NextPage } from 'next';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';
const Auth: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Войти через Telegram</title>
        <meta name='description' content='Войти через Telegram' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <TLoginButton
          botName='RefugeesHelpBot'
          buttonSize={TLoginButtonSize.Large}
          lang='ru'
          usePic={false}
          cornerRadius={20}
          onAuthCallback={async (user) => {
            const isHash = true;
            if (isHash) {
              const auth = await signIn('credentials', {
                callbackUrl: '/',
                ...user,
              });
              console.log(auth);
            }
            console.log('Hello, user!', user);
          }}
          requestAccess={'write'}
        />
      </main>
    </div>
  );
};

// export async function getServerSideProps(ctx: GetSessionParams) {
//   const session = await getSession(ctx);
//   let user;
//   console.log(session?.user);
//   // TODO: check from session
//   if (session?.user?.telegramId) {
//     user = await prisma.user.findUnique({
//       where: { telegramId: session?.user?.telegramId },
//     });
//   }

//   console.log('user', user);

//   if (user) {
//     console.log('redirect');
    
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }
//   return { props: {} };
// }

export default Auth;
