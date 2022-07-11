import { yupResolver } from '@hookform/resolvers/yup';
import { Chief, MaxCount, Supervisor, TimesOfDay, User } from '@prisma/client';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { requiredMessage } from '../../shared/validations';

import loader from '/public/loader.svg';

export const EditMaxCounts: FC<{
  counts: MaxCount[];
}> = ({ counts }) => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    supervisors: Yup.array().of(
      Yup.object().shape({
        type: Yup.string(),
        count: Yup.number().required(requiredMessage),
      })
    ),
  });

  const defaultCounts: MaxCount[] = [
    { type: TimesOfDay.NIGHT, count: 0 },
    { type: TimesOfDay.DAY, count: 0 },
    { type: TimesOfDay.EVENING, count: 0 },
  ];

  counts ??= defaultCounts;

  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: { counts },
  };

  // get functions to build form with useForm() hook
  const { register, formState, getValues, control } = useForm<{
    counts: MaxCount[];
  }>(formOptions);
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'counts', // unique name for your Field Array
  });

  const [isLoading, setIsLoading] = useState(false);

  const save = (values: MaxCount[]) => {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    };
    try {
      fetch('/api/counts', requestOptions).then((data) => {
        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
      return console.log(e);
    }
  };

  const countNames = {
    [TimesOfDay.NIGHT]: 'Ночная',
    [TimesOfDay.DAY]: 'Дневная',
    [TimesOfDay.EVENING]: 'Вечерняя',
  };

  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h2 className='text-lg mt-5 mb-2'>Смены</h2>
      </div>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <div className='mt-5 md:mt-0 md:col-span-1'>
          <div className='shadow overflow-hidden sm:rounded-md px-4 bg-white sm:p-6'>
            <h3 className='text-md mb-2'>
              Максимальное количество человек на смене
            </h3>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
              {fields.map((field, index) => (
                <div className='md:col-span-1 items-center'>
                  <label
                    htmlFor='countOfPassengerTo'
                    className='block text-sm font-medium text-gray-700'
                  >
                    {countNames[field.type]}
                  </label>
                  <input
                    type='number'
                    {...register(`counts.${index}.count`, {
                      valueAsNumber: true,
                    })}
                    id='countOfPassengerTo'
                    autoComplete='given-name'
                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full block shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      errors.counts?.[index]?.count ? 'is-invalid' : ''
                    }`}
                  />
                  <div className='invalid-feedback'>
                    {errors.counts?.[index]?.count?.message}
                  </div>
                </div>
              ))}
            </div>
            <div className='flex mt-5 items-end justify-between'>
              <button
                disabled={isLoading}
                type='button'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                onClick={() => {
                  save(getValues('counts'));
                }}
              >
                {isLoading ? (
                  <Image
                    className='w-8 h-8 rounded-full'
                    src={loader}
                    width={16}
                    height={16}
                    alt='загрузка'
                  />
                ) : (
                  'Сохранить'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
