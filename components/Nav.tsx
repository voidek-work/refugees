import Image from 'next/image';
import React, { FC } from 'react';

import logoImage from '/public/logo.png';
import personImage from '/public/person.svg';
import { useRouter } from 'next/router';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export const Nav: FC<{ user?: User }> = ({ user }) => {
  const menuItems = [
    { title: 'Редактировать профиль', link: '/editUser' },
    { title: 'Запись на смену', link: '/' },
    { title: 'Информация', link: '/info' },
    { title: 'Графики', link: '/schedule' },
  ];

  if (user?.isAdmin) {
    menuItems.push(
      { title: 'Таблица записей', link: '/table' },
      { title: 'Таблица старших', link: '/supervisors' }
    );
  }

  const router = useRouter();

  const activeUrl = router.asPath;

  return (
    <nav className='bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800'>
      <div className='container flex flex-wrap justify-between items-center mx-auto'>
        <Link href='/'>
          <a className='flex items-center'>
            <Image
              className='mr-3 h-6 sm:h-9'
              src={logoImage}
              width='36'
              height='36'
              alt='Неравнодушные логотип'
            />
            <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
              Неравнодушные
            </span>
          </a>
        </Link>

        <div className='flex gap-2 items-center md:order-2'>
          {user && (
            <>
              <div className='flex flex-col items-end order-1 md:order-0'>
                <span className='md:block hidden text-sm text-gray-700 dark:text-gray-200 dark:hover:text-white'>
                  {user?.name}
                </span>
                <button
                  type='button'
                  className='block text-sm text-indigo-500 dark:text-gray-200 dark:hover:text-white'
                  onClick={() => signOut()}
                >
                  Выйти
                </button>
              </div>
              <div className='flex order-0 md:order-1 mr-3 text-sm bg-gray-400 rounded-full md:mr-0'>
                <span className='sr-only'>Открыть меню пользователя</span>
                <Image
                  className='w-8 h-8 rounded-full'
                  src={user?.image || personImage}
                  width={32}
                  height={32}
                  alt='Фото пользователя'
                />
              </div>
            </>
          )}

          <button
            data-collapse-toggle='mobile-menu-2'
            type='button'
            className='order-2 inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='mobile-menu-2'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
            <svg
              className='hidden w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              ></path>
            </svg>
          </button>
        </div>
        <div
          className='hidden justify-between items-center w-full md:flex md:w-auto md:order-1'
          id='mobile-menu-2'
        >
          <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
            {menuItems.map((item) => (
              <li key={item.link}>
                <Link href={item.link}>
                  <a
                    className={
                      activeUrl === item.link
                        ? `block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white`
                        : 'block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"'
                    }
                    aria-current={activeUrl === item.link ? 'page' : 'false'}
                  >
                    {item.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
