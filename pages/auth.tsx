import { signIn } from 'next-auth/react';
import Head from 'next/head';

import styles from '../styles/Home.module.css';

import type { NextPage } from 'next';
const Auth: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Регистрация</title>
        <meta name='description' content='Регистрация' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <button onClick={() => signIn('google')}>signIn</button>
      </main>
    </div>
  );
};

export default Auth;
