import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';

export const EditUser = ({ user }: { user: User }) => {
  console.log(user);

  let { phone, city, ...otherUserData } = user;

  phone ||= '';
  city ||= 'Таганрог';

  const router = useRouter();

  // form validation rules // TODO: api
  const validationSchema = Yup.object().shape({
    // firstName: Yup.string().required('First Name is required'),
    // lastName: Yup.string().required('Last Name is required'),
    name: Yup.string().required('Last Name is required'),
    telegramName: Yup.string().required('Last Name is required'),
    phone: Yup.string().required('Last Name is required'),
    city: Yup.string().required('Last Name is required'),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: { ...otherUserData, phone, city },
  };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState, getValues, control } =
    useForm<User>(formOptions);
  const { errors } = formState;

  const onSubmit: SubmitHandler<User> = async (data: User) => {
    console.log(data);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    try {
      // TODO: api
      return await fetch('/api/updateUser', requestOptions);
    } catch (e) {
      return console.log(e);
    }
  };
  const onError = (errors, e) => console.error(errors, e);

  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h1 className='text-lg mt-5 mb-2'>Редактирование профиля</h1>
        <div className='mt-5 md:mt-0 md:col-span-2'>
          <form onSubmit={handleSubmit<User>(onSubmit, onError)}>
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
                      type='text'
                      {...register('name')}
                      id='name'
                      autoComplete='given-name'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.name?.message}
                    </div>
                  </div>
                  {/* <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='lastName'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Фамилия
                    </label>
                    <input
                      type='text'
                      {...register('lastName')}
                      id='lastName'
                      autoComplete='given-name'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.lastName ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.lastName?.message}
                    </div>
                  </div> */}

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
                    <input
                      type='text'
                      {...register('telegramName')}
                      id='telegramName'
                      autoComplete='given-name'
                      placeholder='https://t.me/username'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.telegramName ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='text-sm text-gray-500'>
                      Находится в настройках сверху, необходимо скопировать имя
                      пользователя и вставить его сюда.
                    </div>
                    <div className='invalid-feedback'>
                      {errors.telegramName?.message}
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
