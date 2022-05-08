import { getSession, GetSessionParams, signIn } from 'next-auth/react';
import Image from 'next/image';
import Head from 'next/head';

import logoImage from '/public/logo.png';

import styles from '../styles/Home.module.css';

import { prisma } from '../shared/db';

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
        <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-md w-full'>
            <div className='flex justify-center'>
              <Image
                className='mx-auto h-12 w-auto'
                src={logoImage}
                width={300}
                height={300}
                alt='Лого неравнодушные'
              />
            </div>
            <h2 className='text-center text-xl font-extrabold text-gray-900'>
              Войдите в сообщество через Telegram
            </h2>
            <div className='mt-5 flex justify-center'>
              <TLoginButton
                botName='RefugeesHelpBot'
                buttonSize={TLoginButtonSize.Large}
                lang='ru'
                usePic={false}
                cornerRadius={6}
                onAuthCallback={async (user) => {
                  const isHash = true;
                  if (isHash) {
                    await signIn('credentials', {
                      callbackUrl: '/',
                      ...user,
                    });
                  }
                }}
                requestAccess={'write'}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
