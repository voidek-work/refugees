import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@prisma/client';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';
import { requiredMessage } from '../shared/validations';
import { DatePicker } from './DatePicker';
import { prepareClientDates } from '../shared/prepareDates';

export const EditUser = ({ user }: { user: User }) => {
  let { phone, city, passport, ...otherUserData } = user;

  phone ||= '';
  city ||= '';
  passport ||= '';

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(requiredMessage),
    telegramName: Yup.string().required(requiredMessage),
    phone: Yup.string().required(requiredMessage),
    city: Yup.string().required(requiredMessage),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: { ...otherUserData, phone, city, passport },
  };

  const { register, handleSubmit, formState, setValue, watch, control } =
    useForm<User>(formOptions);
  const { errors } = formState;

  const [telegramNameValue, cityValue] = watch(['telegramName', 'city']);

  useEffect(() => {
    if (
      typeof telegramNameValue === 'string' &&
      telegramNameValue.includes('https://t.me/')
    ) {
      setValue('telegramName', telegramNameValue.replace('https://t.me/', ''));
    }
  }, [telegramNameValue]);

  const onSubmit: SubmitHandler<User> = async (data: User) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        prepareClientDates(data, ['dateOfBirthday', 'createdAt'])
      ),
    };

    try {
      return await fetch('/api/updateUser', requestOptions);
    } catch (e) {
      return console.log(e);
    }
  };

  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h1 className='text-lg mt-5 mb-2'>Редактирование профиля</h1>
      </div>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <div className='mt-5 md:mt-0 md:col-span-2'>
          <form onSubmit={handleSubmit<User>(onSubmit)}>
            <div className='shadow overflow-hidden sm:rounded-md'>
              <div className='px-4 py-5 bg-white sm:p-6'>
                <div className='grid grid-cols-6 gap-6'>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Имя Фамилия
                    </label>
                    <input
                      {...register('name')}
                      type='text'
                      id='name'
                      autoComplete='given-name'
                      placeholder='Введите имя и фамилию'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.name?.message}
                    </div>
                  </div>
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
                      placeholder='Введите город'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.city ? 'is-invalid' : ''
                      }`}
                    />
                    {!cityValue && (
                      <div className='text-sm flex gap-2'>
                        <div className='text-gray-500'>или выберите:</div>
                        <button
                          type='button'
                          className='link text-indigo-500'
                          onClick={() => setValue('city', 'Таганрог')}
                        >
                          Таганрог,
                        </button>
                        <button
                          type='button'
                          className='link text-indigo-500'
                          onClick={() => setValue('city', 'Ростов-на-Дону')}
                        >
                          Ростов-на-Дону
                        </button>
                      </div>
                    )}
                    <div className='invalid-feedback'>
                      {errors.city?.message}
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-6 gap-6 mt-5'>
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
                      htmlFor='telegramName'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Ссылка на телеграм
                    </label>
                    <div className='mt-1 flex rounded-md shadow-sm'>
                      <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                        https://t.me/
                      </span>
                      <input
                        {...register('telegramName')}
                        type='text'
                        id='telegramName'
                        autoComplete='given-name'
                        placeholder='username'
                        className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 ${
                          errors.telegramName ? 'is-invalid' : ''
                        }`}
                      />
                    </div>
                    <div className='text-sm text-gray-500'>
                      Находится в настройках сверху, необходимо скопировать имя
                      пользователя и вставить его сюда.
                    </div>
                    <div className='invalid-feedback'>
                      {errors.telegramName?.message}
                    </div>
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='passportAddress'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Место и адрес прописки, как указано в паспорте
                    </label>
                    <input
                      {...register('passportAddress')}
                      type='text'
                      id='passportAddress'
                      autoComplete='given-name'
                      placeholder=''
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.passportAddress?.message}
                    </div>
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='passport'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Серия и номер паспорта
                    </label>
                    <InputMask
                      {...register('passport')}
                      type='text'
                      id='passport'
                      mask='9999 999999'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.passport ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.passport?.message}
                    </div>
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='dateOfBirthday'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Дата рождения
                    </label>
                    <DatePicker
                      name={`dateOfBirthday`}
                      id='dateOfBirthday'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.dateOfBirthday ? 'is-invalid' : ''
                      }`}
                      dateFormat={'dd.MM.yyyy'}
                      // @ts-ignore
                      control={control}
                    />
                    <div className='invalid-feedback'>
                      {errors.dateOfBirthday?.message}
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
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
