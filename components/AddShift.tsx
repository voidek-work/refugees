import { yupResolver } from '@hookform/resolvers/yup';
import { User, Shifts } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';

import { DatePicker } from './DatePicker';

export type Shift = Shifts & {
  // name: string;
  // telegram: string;
  // phone: string;
  dateOfShift: Date;
  timeOfStart: string;
  timeOfEnd: string;
  shifts: any[];
  // city: string;
  // isDriver: string;
};

export const AddShift = ({ user }: { user: User }) => {
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    // name: Yup.string().required('First Name is required'),
    // telegram: Yup.string().required('Last Name is required'),
    // phone: Yup.string().required('Last Name is required'),
    isDriver: Yup.bool().optional(),
    countOfPassenger: Yup.number().optional(),
    dateOfShift: Yup.string().optional(),
    comment: Yup.string().optional(),
    userId: Yup.string(),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    // defaultValues,
  };

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    setValue,
    formState,
    getValues,
    reset,
    watch,
  } = useForm<Shift>(formOptions);

  const { errors } = formState;

  const onSubmit: SubmitHandler<Shift> = async (data: Shift) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    try {
      return await fetch('/api/addShift', requestOptions);
    } catch (e) {
      return console.log(e);
    }
  };

  const shiftList = [
    {
      id: '1',
      timeOfStart: '00:00',
      timeOfEnd: '08:30',
      note: 'Ночная',
      canCombineWith: [],
    },
    {
      id: '2',
      timeOfStart: '08:30',
      timeOfEnd: '19:00',
      note: 'Дневная',
      canCombineWith: [],
    },
    {
      id: '3',
      timeOfStart: '19:00',
      timeOfEnd: '00:00',
      note: 'Вечерняя',
      canCombineWith: ['4'],
    },
    {
      id: '4',
      timeOfStart: '00:00',
      timeOfEnd: '08:30',
      note: 'Ночная (следующий день)',
      canCombineWith: ['3'],
    },
  ];

  const shiftsControls = register('shifts');

  const shiftsDisabled = (shift: any) => {
    console.log('shifts:', getValues('shifts'));
    const check = (id: string) => {
      console.log(
        shiftList.length,
        shiftList.find((item) => item.id === id),
        shiftList
          .find((item) => item.id === id)
          ?.canCombineWith.includes(shift.id)
      );

      return (
        shiftList.length > 0 &&
        !shiftList
          .find((item) => item.id === id)
          ?.canCombineWith.includes(shift.id)
      );
    };
    const shiftsValue = getValues('shifts');
    return (
      shiftsValue &&
      !(Array.isArray(shiftsValue)
        ? shiftsValue.every(check)
        : check(shiftsValue))
    );
  };

  // const [isAnother, setIsAnother] = useState(false);

  // useEffect(() => {
  //   if (isAnother) {
  //     reset();
  //     // bug
  //     setValue('phone', '');
  //     setValue('city', 'Таганрог');
  //   } else {
  //     let { name, telegramName: telegram, phone, city } = user;
  //     name ||= '';
  //     telegram ||= '';
  //     phone ||= '';
  //     city ||= 'Таганрог';

  //     setValue('name', name);
  //     setValue('telegram', telegram);
  //     setValue('phone', phone);
  //     setValue('city', city);
  //   }
  // }, [isAnother, user]);

  const isDriverControl = register('isDriver', {
    setValueAs: (v: string) => {
      console.log('v:', v);

      return v === 'true' || false;
    },
  });

  const isDriver = watch('isDriver');

  console.log('isDriver:', isDriver);

  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h1 className='text-lg mt-5 mb-2'>Запись на смену</h1>
        {/* <div className='flex justify-end items-center'>
          <button
            onClick={() => setIsAnother(!isAnother)}
            className='py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
          >
            {isAnother ? 'Записать себя' : 'Записать другого человека'}
          </button>
        </div> */}
      </div>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <div className='mt-5 md:mt-0 md:col-span-2'>
          <form
            onSubmit={handleSubmit<Shift>(onSubmit, (d, e) => {
              console.log(d, e);
            })}
          >
            <div className='shadow overflow-hidden sm:rounded-md'>
              <div className='px-4 py-5 bg-white sm:p-6'>
                {/* <div className='grid grid-cols-6 gap-6'>
                  <div className='col-span-6 sm:col-span-6'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Имя и фамилия
                    </label>
                    <input
                      type='text'
                      id='name'
                      autoComplete='given-name'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'is-invalid' : ''
                      }`}
                      placeholder='Иван Иванов'
                      {...register('name')}
                    />
                    <div className='invalid-feedback'>
                      {errors.name?.message}
                    </div>
                  </div>
                </div> */}

                <fieldset className='mt-5'>
                  <div>
                    <legend className='text-base font-medium text-gray-900'>
                      Вы на машине?
                    </legend>
                    <p className='text-sm text-gray-500'>
                      Если у Вас нет машины, то Софико свяжется с Вами позже и
                      передаст контакты волонтёра водителя.
                    </p>
                  </div>
                  <div className='mt-4 space-y-4'>
                    <div className='flex items-center'>
                      <input
                        id='isDriverYes'
                        value={'true'}
                        type='radio'
                        className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                        {...isDriverControl}
                      />
                      <label
                        htmlFor='isDriverYes'
                        className='ml-3 block text-sm font-medium text-gray-700'
                      >
                        Да
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='isDriverNo'
                        type='radio'
                        value={'false'}
                        className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                        {...isDriverControl}
                      />
                      <label
                        htmlFor='isDriverNo'
                        className='ml-3 block text-sm font-medium text-gray-700'
                      >
                        Нет
                      </label>
                    </div>
                  </div>
                </fieldset>
                {/* @ts-ignore */}
                {isDriver === 'true' && (
                  <fieldset className='mt-5'>
                    <div>
                      <legend className='text-base font-medium text-gray-900'>
                        Вопрос только для волонтёров-водителей.
                      </legend>
                      <p className='text-sm text-gray-500'>
                        Согласны ли взять пеших волонтёров? Укажите количество
                        человек.
                      </p>
                    </div>

                    <div className='md:grid md:grid-cols-2 md:gap-6 items-center'>
                      <div className='mt-4 space-y-4'>
                        <div className='flex items-center'>
                          <input
                            id='yesGet'
                            name='getVolunteers'
                            type='radio'
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                          />
                          <label
                            htmlFor='yesGet'
                            className='ml-3 block text-sm font-medium text-gray-700'
                          >
                            Да
                          </label>
                        </div>
                        <div className='flex items-center'>
                          <input
                            id='noGet'
                            name='getVolunteers'
                            type='radio'
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                          />
                          <label
                            htmlFor='noGet'
                            className='ml-3 block text-sm font-medium text-gray-700'
                          >
                            Нет
                          </label>
                        </div>
                        <div className='invalid-feedback'>
                          {errors.countOfPassenger?.message}
                        </div>
                      </div>
                      <div className='items-center'>
                        <label
                          htmlFor='countOfPassenger'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Количество человек
                        </label>
                        <input
                          type='number'
                          {...register('countOfPassenger', {
                            valueAsNumber: true,
                          })}
                          id='countOfPassenger'
                          autoComplete='given-name'
                          className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full block shadow-sm sm:text-sm border-gray-300 rounded-md ${
                            errors.countOfPassenger ? 'is-invalid' : ''
                          }`}
                        />
                        <div className='invalid-feedback'>
                          {errors.countOfPassenger?.message}
                        </div>
                      </div>
                    </div>
                  </fieldset>
                )}
                {/* <div className='grid grid-cols-6 gap-6 mt-5'>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Телефон
                    </label>
                    <InputMask
                      {...register('phone')}
                      type='text'
                      id='phone'
                      mask='+7 (999) 999-99-99'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.phone ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.phone?.message}
                    </div>
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='telegram'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Ссылка на телеграм
                    </label>
                    <input
                      type='text'
                      id='telegram'
                      autoComplete='given-name'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.telegram ? 'is-invalid' : ''
                      }`}
                      placeholder='https://t.me/username'
                      {...register('telegram')}
                    />
                    <div className='text-sm text-gray-500'>
                      Находится в настройках сверху, необходимо скопировать имя
                      пользователя и вставить его сюда.
                    </div>
                    <div className='invalid-feedback'>
                      {errors.telegram?.message}
                    </div>
                  </div>
                </div> */}
                <div className='grid grid-cols-4 gap-6 mt-5'>
                  <div className='col-span-4 sm:col-span-2'>
                    <label
                      htmlFor='dateOfShift'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Дата выхода на смену
                    </label>
                    <DatePicker
                      {...register('dateOfShift', { valueAsDate: true })}
                      id='dateOfShift'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.dateOfShift ? 'is-invalid' : ''
                      }`}
                      dateFormat='dd.MM.yyyy'
                    />
                    <div className='invalid-feedback'>
                      {errors.dateOfShift?.message}
                    </div>
                  </div>
                  <div className='col-span-2 sm:col-span-1'>
                    <label
                      htmlFor='timeOfStart'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Начало смены
                    </label>
                    <input
                      {...register('timeOfStart')}
                      id='timeOfStart'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.timeOfStart ? 'is-invalid' : ''
                      }`}
                      type='time'
                    />
                    <div className='invalid-feedback'>
                      {errors.timeOfStart?.message}
                    </div>
                  </div>
                  <div className='col-span-2 sm:col-span-1'>
                    <label
                      htmlFor='timeOfEnd'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Конец смены
                    </label>
                    <input
                      {...register('timeOfEnd')}
                      id='timeOfEnd'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.timeOfEnd ? 'is-invalid' : ''
                      }`}
                      type='time'
                    />
                    <div className='invalid-feedback'>
                      {errors.timeOfEnd?.message}
                    </div>
                  </div>
                </div>
                <div
                  className={`grid grid-cols-2 md:grid-cols-${shiftList.length} md:gap-6 mt-5`}
                >
                  {shiftList.map((shift) => (
                    <div key={shift.id} className='mt-5 md:mt-0 md:col-span-1'>
                      <div>
                        <div className='flex items-center'>
                          <input
                            {...shiftsControls}
                            value={shift.id}
                            disabled={shiftsDisabled(shift)}
                            id={shift.id}
                            name='shifts'
                            type='checkbox'
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            onChange={(e) => {
                              const {
                                target: { checked },
                              } = e;
                              console.log(getValues());
                              if (checked) {
                                if (shift.canCombineWith.length > 0) {
                                  const currentValueStart =
                                    getValues('timeOfStart');
                                  const currentValueEnd =
                                    getValues('timeOfEnd');
                                  // if (getValues('shifts'))
                                }
                                setValue('timeOfStart', shift.timeOfStart);
                                setValue('timeOfEnd', shift.timeOfEnd);
                              }
                              shiftsControls.onChange(e);
                              console.log(getValues());
                            }}
                          />
                          <label
                            htmlFor='push-everything'
                            className='ml-3 block text-sm font-medium text-gray-700'
                          >
                            {shift.timeOfStart} - {shift.timeOfEnd}
                          </label>
                        </div>
                        {shift.note && (
                          <div className='text-sm text-gray-500 md:ml-7'>
                            {shift.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div className='grid grid-cols-6 gap-6 mt-5'>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='city'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Город
                    </label>
                    <input
                      {...register('city')}
                      type='text'
                      id='city'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.city ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.city?.message}
                    </div>
                  </div>
                </div> */}
                <div className='grid grid-cols-6 gap-6 mt-5'>
                  <div className='col-span-6 sm:col-span-6'>
                    <label
                      htmlFor='comment'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Комментарий
                    </label>
                    <textarea
                      {...register('comment')}
                      id='comment'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.comment ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.comment?.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
              <button
                type='submit'
                disabled={formState.isSubmitting}
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                {formState.isSubmitting && (
                  <span className='spinner-border spinner-border-sm mr-1'></span>
                )}
                Записаться
              </button>
            </div>
          </form>

          {/* <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
            <button
              className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={async () => {
                // const chatId =
                const requestOptions1 = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                };
                let updates, response;
                try {
                  response = await fetch(
                    'https://api.telegram.org/bot5232112185:AAGIWqIHz7zoi6FQAsFd-d3P1hxus1H0LcM/getUpdates',
                    requestOptions1
                  );
                  updates = await response.json();
                } catch (e) {
                  console.log(e);
                }
                const userName = getValues('telegram').replace(
                  'https://t.me/',
                  ''
                );
                console.log(userName);

                const chatId = updates.result.find(
                  (item) => item.message.from.username === userName
                ).message.chat.id;

                const requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: 'Подтверждено', chatId }),
                };
                try {
                  return await fetch('/api/bot', requestOptions);
                } catch (e) {
                  return console.log(e);
                }
              }}
            >
              {formState.isSubmitting && (
                <span className='spinner-border spinner-border-sm mr-1'></span>
              )}
              Test TelegramBot
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
