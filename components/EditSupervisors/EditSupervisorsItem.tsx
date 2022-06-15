import React, { FC } from 'react';
import {
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormStateReturn,
} from 'react-hook-form';
import { Chief, Supervisor } from '@prisma/client';
import InputMask from 'react-input-mask';

type Form = { chiefs: Chief[]; supervisors: Supervisor[] };

export const EditSupervisorsItem: FC<{
  register: UseFormRegister<Form>;
  index: number;
  errors: UseFormStateReturn<Form>['errors'];
  name: keyof Form;
  remove: UseFieldArrayRemove;
}> = ({ register, index, errors, name, remove }) => {
  return (
    <div className='grid grid-cols-7 gap-3 mt-5 items-end'>
      <div className='col-span-7 sm:col-span-4'>
        <label
          htmlFor={`${name}Name`}
          className='block text-sm font-medium text-gray-700'
        >
          Имя Фамилия
        </label>
        <input
          {...register(`${name}.${index}.name`)}
          type='text'
          id={`${name}Name`}
          autoComplete='given-name'
          placeholder='Введите имя и фамилию'
          className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
            errors?.[name]?.[index]?.name ? 'is-invalid' : ''
          }`}
        />
        <div className='invalid-feedback'>
          {errors?.[name]?.[index]?.name?.message}
        </div>
      </div>

      <div className='col-span-7 sm:col-span-2'>
        <label
          htmlFor={`${name}Phone`}
          className='block text-sm font-medium text-gray-700'
        >
          Телефон
        </label>
        <InputMask
          {...register(`${name}.${index}.phone`)}
          type='text'
          id={`${name}Phone`}
          mask='+7 (999) 999-99-99'
          className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
            errors?.[name]?.[index]?.phone ? 'is-invalid' : ''
          }`}
        />
        <div className='invalid-feedback'>
          {errors?.[name]?.[index]?.phone?.message}
        </div>
      </div>
      <div className='col-span-7 sm:col-span-1 flex justify-end'>
        <button
          type='button'
          className='py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          onClick={() => {
            remove(index);
          }}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};
