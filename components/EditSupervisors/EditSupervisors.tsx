import { yupResolver } from '@hookform/resolvers/yup';
import { Chief, Supervisor, User } from '@prisma/client';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { requiredMessage } from '../../shared/validations';
import { EditSupervisorsItem } from './EditSupervisorsItem';
import loader from '/public/loader.svg';

export const EditSupervisors: FC<{
  user: User;
  supervisors: Supervisor[];
  chiefs: Chief[];
}> = ({ supervisors, chiefs }) => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    supervisors: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(requiredMessage),
        phone: Yup.string().required(requiredMessage),
      })
    ),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: { supervisors, chiefs },
  };

  // get functions to build form with useForm() hook
  const { register, formState, getValues, control } = useForm<{
    supervisors: Supervisor[];
    chiefs: Chief[];
  }>(formOptions);
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'supervisors', // unique name for your Field Array
  });
  const {
    fields: chiefFields,
    append: chiefAppend,
    remove: chiefRemove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'chiefs', // unique name for your Field Array
  });

  const [isLoading, setIsLoading] = useState({
    supervisors: false,
    chiefs: false,
  });

  const save =
    (name: 'supervisors' | 'chiefs', route: string) =>
    (values: Supervisor[] | Chief[]) => {
      setIsLoading({ ...isLoading, [name]: true });
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };
      try {
        fetch(route, requestOptions).then((data) => {
          setIsLoading({ ...isLoading, [name]: false });
        });
      } catch (e) {
        setIsLoading({ ...isLoading, [name]: false });
        return console.log(e);
      }
    };

  const saveSupervisors = save('supervisors', '/api/supervisors');
  const saveChiefs = save('chiefs', '/api/chiefs');

  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h2 className='text-lg mt-5 mb-2'>Старшие смен и начальники штабов</h2>
      </div>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <div className='mt-5 md:mt-0 md:col-span-1'>
          <div className='shadow overflow-hidden sm:rounded-md px-4 bg-white sm:p-6'>
            <h3 className='text-md mb-2'>Старшие смен</h3>
            {fields.map((field, index) => (
              <EditSupervisorsItem
                register={register}
                index={index}
                errors={errors}
                key={field.id}
                name={'supervisors'}
                remove={remove}
              />
            ))}
            <div className='flex mt-5 items-end justify-between'>
              <button
                type='button'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                onClick={() => {
                  append({
                    name: '',
                    phone: '',
                  });
                }}
              >
                Добавить
              </button>

              <button
                disabled={isLoading.supervisors}
                type='button'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                onClick={() => {
                  saveSupervisors(getValues('supervisors'));
                }}
              >
                {isLoading.supervisors ? (
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
        <div className='mt-5 md:mt-0 md:col-span-1'>
          <div className='shadow overflow-hidden sm:rounded-md px-4 bg-white sm:p-6'>
            <h3 className='text-md mb-2'>Начальники штабов</h3>
            {chiefFields.map((field, index) => (
              <EditSupervisorsItem
                register={register}
                index={index}
                errors={errors}
                key={field.id}
                name={'chiefs'}
                remove={chiefRemove}
              />
            ))}
            <div className='flex mt-5 items-end justify-between'>
              <button
                type='button'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                onClick={() => {
                  chiefAppend({
                    name: '',
                    phone: '',
                  });
                }}
              >
                Добавить
              </button>

              <button
                disabled={isLoading.chiefs}
                type='button'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                onClick={() => {
                  saveChiefs(getValues('chiefs'));
                }}
              >
                {isLoading.chiefs ? (
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
