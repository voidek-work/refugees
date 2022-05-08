import Head from 'next/head';
import { NextPage } from 'next/types';
import React from 'react';
import styles from '../styles/Home.module.css';
import { Nav } from '../components/Nav';
import { User } from '@prisma/client';
import { GetSessionParams, getSession } from 'next-auth/react';
import { prisma } from './db';

export const Info: NextPage<{ user: User }> = ({ user }) => {
  return (
    <>
      <Nav user={user} />
      <Head>
        <title>Важная информация!</title>
        <meta name='description' content='Информация' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1>ВАЖНАЯ ИНФОРМАЦИЯ! ВСЕМ ПРОЧЕСТЬ</h1>
        {/* <ul className="list-disc"> */}
        <h2 className='mb-3'>
          Это единственный портал по волонтёрской помощи на КПП
          Весёло-Вознесенке (на границе)
        </h2>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Координаторы:{' '}
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            Софико Метревели,{' '}
            <a className='link text-indigo-500' href='tel:+79188946434'>
              +7(918)894-64-34
            </a>
            ,{' '}
            <a className='link text-indigo-500' href='https://t.me/s_metreveli'>
              https://t.me/s_metreveli
            </a>
          </p>
          <p>
            Олег Подгорный,{' '}
            <a className='link text-indigo-500' href='tel:+79185562553'>
              +7(918)556-25-53
            </a>
            ,{' '}
            <a className='link text-indigo-500' href='https://t.me/zigtag'>
              https://t.me/zigtag
            </a>
          </p>
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Финподдержка только по этим номерам телефонов:
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            <a className='link text-indigo-500' href='tel:+79281045905'>
              +7(928)104-59-05
            </a>
            ,{' '}
            <a className='link text-indigo-500' href='https://t.me/Daria_Lanko'>
              https://t.me/Daria_Lanko
            </a>
            , Сбербанк (Дарья Игоревна Л.)
          </p>
          <p>
            <a className='link text-indigo-500' href='tel:+79054511120'>
              +7(905)451-11-20
            </a>
            ,{' '}
            <a className='link text-indigo-500' href='https://t.me/yana1988'>
              https://t.me/yana1988
            </a>
            , Сбербанк (Яна Владимировна К.)
          </p>
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Записаться на смену (резервная форма):
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            <a
              className='link text-indigo-500'
              href='https://forms.gle/BgdJdE6wjV2V1fao7'
            >
              https://forms.gle/BgdJdE6wjV2V1fao7
            </a>
          </p>
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Номера горячих линий, куда могут обратиться беженцы и задать вопросы:
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            <a className='link text-indigo-500' href='tel:+78632439999'>
              +7(863)243-99-99
            </a>{' '}
            — Штаб Управления ГО и ЧС г.Ростова-на-Дону
          </p>
          <p>
            <a className='link text-indigo-500' href='tel:+78632399999'>
              +7(863)239-99-99
            </a>{' '}
            — Горячая линия ГУ МЧС по Ростовской области
          </p>
          <p>
            <a className='link text-indigo-500' href='tel:122'>
              122
            </a>{' '}
            — Единая горячая линия
          </p>

          <p>
            <a className='link text-indigo-500' href='tel:+78632105542'>
              +7(863)210-55-42
            </a>{' '}
            — Оперативный штаб Ростовской области
          </p>
          <p>
            <a className='link text-indigo-500' href='tel:+78632340099'>
              +7(863)234-00-99
            </a>{' '}
            — Министерство труда по выплатам
          </p>
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Тем, кто ищет родственников из Мариуполя и Волновахи:
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            «Феникс»:{' '}
            <a className='link text-indigo-500' href='tel:+380713426999'>
              +38 (071) 342-69-99
            </a>
          </p>
          <p>
            городской:{' '}
            <a className='link text-indigo-500' href='tel:+380623426999'>
              +38 (062) 342-69-99
            </a>
          </p>
          <p>
            звонки из РФ:{' '}
            <a className='link text-indigo-500' href='tel:+78633182999'>
              +7 (863) 318-29-99
            </a>
          </p>
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Ответы на распространённые вопросы беженцев (обязательно к прочтению
          всем):
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            <a
              className='link text-indigo-500'
              href='https://docs.google.com/document/d/1tsTD2WtdqfJfhOZU6_Vu34m8SsxKDdtUvm4K27lTkyI/edit?usp=sharing'
            >
              https://docs.google.com/document/d/1tsTD2WtdqfJfhOZU6_Vu34m8SsxKDdtUvm4K27lTkyI/edit?usp=sharing
            </a>
          </p>
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Таблица дежурств:
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            <a
              className='link text-indigo-500'
              href='https://docs.google.com/spreadsheets/d/1O_2YCt7O0GQMHKNGxbRBvbLm0XbDjFAWZ9XCTp63Cc8/edit#gid=0'
            >
              https://docs.google.com/spreadsheets/d/1O_2YCt7O0GQMHKNGxbRBvbLm0XbDjFAWZ9XCTp63Cc8/edit#gid=0
            </a>
          </p>
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 mt-5'>
          Точка на карте, куда ехать:
        </h3>
        <div className='prose prose-sm leading-5'>
          <p>
            КПП Весело-Вознесенка
            <a
              className='link text-indigo-500'
              href='https://yandex.ru/maps/org/avtomobilny_punkt_propuska_veselo_voznesenka/23054015073'
            >
              https://yandex.ru/maps/org/avtomobilny_punkt_propuska_veselo_voznesenka/23054015073
            </a>
            ,
            <a
              className='link text-indigo-500'
              href='https://maps.app.goo.gl/SkfDLeSW8GEh9roN7'
            >
              https://maps.app.goo.gl/SkfDLeSW8GEh9roN7
            </a>
          </p>
        </div>
        {/* 

<li>Общепринятый список продуктов. Списки каждый раз разные - обсуждаются в чате. Более необходимое пишут в чате, ещё можно уточнить у заведующего складом (контакты ниже). 
Если хотите закупиться заранее, то только по этому списку можно покупать необходимое
https://docs.google.com/document/d/1628FTvi3QT9nnwvee6EFV5QqMVZ8CW_nav17d50lPoU/edit?usp=sharing</li>
<li>Заведующий складом
Евгений Чекрыгин +7(928)171-59-15 
Старшим смены необходимо ему по окончанию написать список с остатками склада.</li>
<li>Прислать новость/историю/фото/видео со смены
Виктория Хотлубей (+7(978)060-42-35) https://t.me/vikun5</li>
<li>Круглосуточная помощь психологов
+7(919)070-27-06</li>
    </ul>        

<h1>❓ Ответы на частые вопросы ⬇️</h1>
<ol>
    <li></li>
</ol>
1. Что нужно делать?
В основном мы кормим людей, раздаём средства гигиены (прокладки, памперсы, влажные салфетки), детские наборы (сок, яблоко, какие-то сладости и детское пюре), сигареты и корм для животных. Стараемся узнавать про самочувствие, вызываем врача для оказания мед.помощи. Основная задача накормить, обогреть, успокоить и ответить на вопросы.

2. Как записаться на смену?
Вся логистика смен СТРОГО через  форму. Вы заполняете эту форму, Софико исходя из заполненных данных формирует таблицу с графиками. Если Вы без машины, то Софико свяжется с Вами сама и передаст контакты волонтёра-водителя. 
Форма для записи:
https://forms.gle/BgdJdE6wjV2V1fao7

3. Какие смены по времени?
- утренняя (8.30-19.00)
- вечерняя (19.00-00.00) 
- ночная (00.00-8.30). 
Можно приезжать/уезжать пораньше и попозже, главное приезжайте.

4. У меня есть машина, что делать?
Запишитесь на смену в форме и отметьте в 3 вопросе "да" и в поле "другое" укажите сколько человек готовы взять. Софико передаст Ваш номер пешему волонтёру и он свяжется сам.

5. У меня нет машины, как добраться?
Алгоритм аналогичный, как в четвёртом вопросе. Записывайтесь на смену в форме, ожидайте пока Софико свяжется с Вами и передаст контакты водителя-волонтёра.

6. Откуда еда?
На месте есть повар, он же готовит из привезённой нами провизии и накладывает её. Мы только раздаём.

7. Откуда деньги?
Неравнодушные люди перечисляют пожертвования, подключились предприниматели, депутаты, организации и предприятия, которые тоже помогают.

8. Кормят ли волонтёров?
Кормят тем, чем и всех (гречневая каша с тушёнкой или куриный суп, чай, какие-то сладости). Вы можете поесть, когда хотите и когда удобно.

9. Есть ли туалеты?
Есть био-туалеты, расположенные на улице.

12. Куда везут беженцев?
Изначально отвозят на вокзал Таганрог-1 (Новый вокзал), дальше на поезде в город, который готов принять людей. Редко кого-то оставляют в ПВР именно в Таганроге.

13. Куда едут поезда?
Направление */}
      </main>
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

export default Info;
