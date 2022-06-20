import { yupResolver } from '@hookform/resolvers/yup';
import { User, Shifts, DriverChoice, Choice, Direction } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';

import { DatePicker } from './DatePicker';
import { requiredMessage } from '../shared/validations';
import parse from 'date-fns/parse';
import { ShiftTime } from './ShiftTime';
import set from 'date-fns/set';
import { add } from 'date-fns';
import { ExtendedUser } from '../types/extendedUser';

export type Shift = Shifts & {
  dateOfShift: Date;
  timeOfStart: string;
  timeOfEnd: string;
  shifts: any[];
  // TODO: rename
  shiftsList: string;
  getVolunteers: Choice;
  direction: Direction;
};

type ShiftTime = {
  id: string;
  timeOfStart: string;
  timeOfEnd: string;
  note: string;
  canCombineWith: string[];
};

export const AddShift = ({ user }: { user: ExtendedUser }) => {
  const { isSupervisor: userIsSupervisor, isChief: userIsChief } = user;

  // form validation rules
  const validationSchema = Yup.object().shape({
    isDriver: Yup.string().optional(),
    countOfPassengerTo: Yup.number().optional(),
    countOfPassengerBack: Yup.number().optional(),
    shifts: Yup.array().of(
      Yup.object().shape({
        dateOfShift: Yup.string().required(requiredMessage),
      })
    ),
    comment: Yup.string().optional(),
    userId: Yup.string(),
    telegramNameDriverTo: Yup.string().optional(),
    telegramNameDriverBack: Yup.string().optional(),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    setValue,
    formState,
    getValues,
    control,
    watch,
    // @ts-ignore
  } = useForm<Shift>(formOptions);

  const { errors } = formState;
  // @ts-ignore
  const onSubmit: SubmitHandler<Shift> = async (data: Shift) => {
    // TODO: Проверить, что все поля зареганы, чекнуть хеппи вей водителя, добавить логику с привязкой
    console.log(data);

    const { shifts, ...otherData } = data;

    const dateClass = new Date();
    return await Promise.all(
      shifts.map((shift) => {
        const { dateOfShift, timeOfStart, timeOfEnd } = shift;
        const preparedDateOfShift = new Date(dateOfShift);

        const formDateStart = set(preparedDateOfShift, {
          hours: parse(timeOfStart, 'HH:mm', dateClass).getHours(),
          minutes: parse(timeOfStart, 'HH:mm', dateClass).getMinutes(),
        });
        const formDateEnd = set(preparedDateOfShift, {
          hours: parse(timeOfEnd, 'HH:mm', dateClass).getHours(),
          minutes: parse(timeOfEnd, 'HH:mm', dateClass).getMinutes(),
        });
        const dateEnd =
          formDateEnd > formDateStart
            ? formDateEnd
            : add(formDateEnd, { days: 1 });

        const { chiefShift, isSupervisor } = shift;

        const preparedData: Shifts = {
          ...otherData,
          dateStart: formDateStart,
          dateEnd: dateEnd,
          chiefShift: chiefShift?.[0],
          isSupervisor,
        };

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preparedData),
        };
        try {
          return fetch('/api/shift/new', requestOptions);
        } catch (e) {
          return console.log(e);
        }
      })
    );
  };

  const { fields, append, prepend, remove, swap, move, insert, update } =
    useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'shifts', // unique name for your Field Array
    });

  const isDriver = watch('isDriver');
  const getVolunteers = watch('getVolunteers');
  const shifts = watch('shifts');
  const direction = watch('direction');

  useEffect(() => {
    if (isDriver === DriverChoice.NO) {
      setValue('countOfPassengerTo', 0);
      setValue('countOfPassengerBack', 0);
      setValue('getVolunteers', Choice.YES);
      setValue('direction', []);
    }
  }, [isDriver]);

  useEffect(() => {
    if (shifts && shifts.length === 0) {
      append({
        dateOfShift: '',
        timeOfStart: '',
        timeOfEnd: '',
        shiftsList: '',
        isSupervisor: null,
        chiefShift: null,
      });
    }
  }, [shifts]);

  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h1 className='text-lg mt-5 mb-2'>Запись на смену</h1>
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
                        value={DriverChoice.YES}
                        type='radio'
                        className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                        {...register('isDriver')}
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
                        value={DriverChoice.NO}
                        className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                        {...register('isDriver')}
                      />
                      <label
                        htmlFor='isDriverNo'
                        className='ml-3 block text-sm font-medium text-gray-700'
                      >
                        Нет
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='withDriver'
                        type='radio'
                        value={DriverChoice.WITH_DRIVER}
                        className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                        {...register('isDriver')}
                      />
                      <label
                        htmlFor='withDriver'
                        className='ml-3 block text-sm font-medium text-gray-700'
                      >
                        Нет, но у меня уже есть контакты водителя
                      </label>
                    </div>
                  </div>
                </fieldset>
                {isDriver === DriverChoice.YES && (
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

                    <div className='md:grid md:grid-cols-3 md:gap-6 items-center'>
                      <div className='mt-4 space-y-4'>
                        <div className='flex items-center'>
                          <input
                            id='yesGet'
                            value={Choice.YES}
                            type='radio'
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            {...register('getVolunteers')}
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
                            type='radio'
                            value={Choice.NO}
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            {...register('getVolunteers')}
                          />
                          <label
                            htmlFor='noGet'
                            className='ml-3 block text-sm font-medium text-gray-700'
                          >
                            Нет
                          </label>
                        </div>
                        <div className='invalid-feedback'>
                          {errors.getVolunteers?.message}
                        </div>
                      </div>
                      {getVolunteers === Choice.YES && (
                        <>
                          <div className='items-center'>
                            <label
                              htmlFor='countOfPassengerTo'
                              className='block text-sm font-medium text-gray-700'
                            >
                              Количество человек (туда)
                            </label>
                            <input
                              type='number'
                              {...register('countOfPassengerTo', {
                                valueAsNumber: true,
                              })}
                              id='countOfPassengerTo'
                              autoComplete='given-name'
                              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full block shadow-sm sm:text-sm border-gray-300 rounded-md ${
                                errors.countOfPassengerTo ? 'is-invalid' : ''
                              }`}
                            />
                            <div className='invalid-feedback'>
                              {errors.countOfPassengerTo?.message}
                            </div>
                          </div>
                          <div className='items-center'>
                            <label
                              htmlFor='countOfPassengerBack'
                              className='block text-sm font-medium text-gray-700'
                            >
                              Количество человек (обратно)
                            </label>
                            <input
                              type='number'
                              {...register('countOfPassengerBack', {
                                valueAsNumber: true,
                              })}
                              id='countOfPassengerBack'
                              autoComplete='given-name'
                              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full block shadow-sm sm:text-sm border-gray-300 rounded-md ${
                                errors.countOfPassengerBack ? 'is-invalid' : ''
                              }`}
                            />
                            <div className='invalid-feedback'>
                              {errors.countOfPassengerBack?.message}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </fieldset>
                )}
                {/* @ts-ignore */}
                {isDriver === DriverChoice.WITH_DRIVER && (
                  <fieldset className='mt-5'>
                    <div>
                      <legend className='text-base font-medium text-gray-900'>
                        Вам необходимо указать как вы поедете и ссылку на
                        телеграмм водителя
                      </legend>
                      <p className='text-sm text-gray-500'>
                        Будьте внимательны, в системе произойдет привязка
                      </p>
                    </div>

                    <div className='md:grid md:grid-cols-2 md:gap-6 items-center'>
                      <div className='mt-4 space-y-4'>
                        <div className='flex items-center'>
                          <input
                            id='to'
                            type='checkbox'
                            value={Direction.TO}
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            {...register('direction')}
                          />
                          <label
                            htmlFor='to'
                            className='ml-3 block text-sm font-medium text-gray-700'
                          >
                            Туда
                          </label>
                        </div>
                        <div className='invalid-feedback'>
                          {errors.direction?.[0]?.message}
                        </div>
                      </div>
                      {direction && direction.includes(Direction.TO) && (
                        <div>
                          <label
                            htmlFor='telegramNameDriverTo'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Ссылка на телеграм водителя (туда)
                          </label>
                          <div className='mt-1 flex rounded-md shadow-sm'>
                            <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                              https://t.me/
                            </span>
                            <input
                              type='text'
                              id='telegramNameDriverTo'
                              autoComplete='given-name'
                              placeholder='username'
                              className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 ${
                                errors.telegramNameDriverTo ? 'is-invalid' : ''
                              }`}
                              {...register('telegramNameDriverTo')}
                            />
                          </div>
                          <div className='text-sm text-gray-500'>
                            Находится в настройках сверху, необходимо
                            скопировать имя пользователя и вставить его сюда.
                          </div>
                          <div className='invalid-feedback'>
                            {errors.telegramNameDriverTo?.message}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='md:grid md:grid-cols-2 md:gap-6 items-center'>
                      <div className='mt-4 space-y-4'>
                        <div className='flex items-center'>
                          <input
                            id='back'
                            type='checkbox'
                            value={Direction.BACK}
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            {...register('direction')}
                          />
                          <label
                            htmlFor='back'
                            className='ml-3 block text-sm font-medium text-gray-700'
                          >
                            Обратно
                          </label>
                        </div>
                        <div className='invalid-feedback'>
                          {errors.direction?.[0]?.message}
                        </div>
                      </div>
                      {direction && direction.includes(Direction.BACK) && (
                        <div>
                          <label
                            htmlFor='telegramNameDriverBack'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Ссылка на телеграм водителя (обратно)
                          </label>
                          <div className='mt-1 flex rounded-md shadow-sm'>
                            <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                              https://t.me/
                            </span>
                            <input
                              type='text'
                              id='telegramNameDriverBack'
                              autoComplete='given-name'
                              placeholder='username'
                              className={`focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 ${
                                errors.telegramNameDriverBack
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              {...register('telegramNameDriverBack')}
                            />
                          </div>
                          <div className='text-sm text-gray-500'>
                            Находится в настройках сверху, необходимо
                            скопировать имя пользователя и вставить его сюда.
                          </div>
                          <div className='invalid-feedback'>
                            {errors.telegramNameDriverTo?.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </fieldset>
                )}
                <div className='grid grid-cols-4 gap-6 mt-5'>
                  {fields.map((field, index) => (
                    <ShiftTime
                      key={field.id}
                      control={control}
                      setValue={setValue}
                      update={update}
                      index={index}
                      value={field}
                      remove={remove}
                      register={register}
                      userIsSupervisor={userIsSupervisor}
                      userIsChief={userIsChief}
                      watch={watch}
                    />
                  ))}
                  <button
                    type='button'
                    className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                    onClick={() => {
                      append({
                        dateOfShift: '',
                        timeOfStart: '',
                        timeOfEnd: '',
                        shiftsList: '',
                        isSupervisor: null,
                        chiefShift: null,
                      });
                    }}
                  >
                    Добавить ещё смену
                  </button>
                </div>
                <div className='grid grid-cols-6 gap-6 mt-5'>
                  <div className='col-span-6 sm:col-span-6'>
                    <label
                      htmlFor='comment'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Комментарий
                    </label>
                    <textarea
                      id='comment'
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        errors.comment ? 'is-invalid' : ''
                      }`}
                      {...register('comment')}
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
        </div>
      </div>
    </div>
  );
};
