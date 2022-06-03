import add from 'date-fns/add';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import React, { FC, useEffect } from 'react';
import {
  Control,
  Controller,
  UseFieldArrayReturn,
  useForm,
} from 'react-hook-form';
import { Shift } from './AddShift';
import { DatePicker } from './DatePicker';

type ArrayProps = UseFieldArrayReturn<any, 'shifts', 'id'>;
type OptionalArrayProps = {
  [key in keyof ArrayProps]?: ArrayProps[keyof ArrayProps];
};

export const ShiftTime: FC<
  OptionalArrayProps & {
    index: number;
    value: any;
    control: Control<Shift>;
    setValue: any;
  }
> = ({ index, value, control, setValue, remove }) => {
  const errors: any = {};

  const shiftList: any[] = [
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
  ];

  // const shiftsValue: any[] = watch('shifts');
  // const shiftsListValue: string = watch(`shifts.${index}.shiftsList`);

  // useEffect(() => {
  console.log('value', JSON.stringify(value));

  // }, [shiftsValue]);

  console.log('value', JSON.stringify(value));
  // console.log('shiftsListValue', JSON.stringify(shiftsListValue));

  const minDate = new Date();
  const maxDate = add(new Date(), { days: 3 });

  return (
    <>
      <div className='col-span-4 sm:col-span-2'>
        <label
          htmlFor='dateOfShift'
          className='block text-sm font-medium text-gray-700'
        >
          Дата выхода на смену
        </label>
        <DatePicker
          name={`shifts.${index}.dateOfShift`}
          id='dateOfShift'
          className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
            errors.dateOfShift ? 'is-invalid' : ''
          }`}
          minDate={minDate}
          maxDate={maxDate}
          // @ts-ignore
          control={control}
        />
        {/* <input
          {...register(`shifts.${index}.dateOfShift`)}
          id='dateOfShift'
          className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
            errors.dateOfShift ? 'is-invalid' : ''
          }`}
          type='text'
        /> */}
        <div className='invalid-feedback'>{errors.dateOfShift?.message}</div>
      </div>
      <div className='col-span-2 sm:col-span-1'>
        <label
          htmlFor='timeOfStart'
          className='block text-sm font-medium text-gray-700'
        >
          Начало смены
        </label>
        <Controller
          control={control}
          name={`shifts.${index}.timeOfStart`}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              id='timeOfStart'
              // disabled={shiftsValue && shiftsValue.length > 0}
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                errors.timeOfStart ? 'is-invalid' : ''
              }`}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              type='time'
            />
          )}
        />
        {/* <input
          {...register(`shifts.${index}.timeOfStart`)}
          id='timeOfStart'
          // disabled={shiftsValue && shiftsValue.length > 0}
          className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
            errors.timeOfStart ? 'is-invalid' : ''
          }`}
          type='time'
        /> */}
        <div className='invalid-feedback'>{errors.timeOfStart?.message}</div>
      </div>
      <div className='col-span-2 sm:col-span-1'>
        <label
          htmlFor='timeOfEnd'
          className='block text-sm font-medium text-gray-700'
        >
          Конец смены
        </label>
        <Controller
          control={control}
          name={`shifts.${index}.timeOfEnd`}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              id='timeOfEnd'
              // disabled={shiftsValue && shiftsValue.length > 0}
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                errors.timeOfEnd ? 'is-invalid' : ''
              }`}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              type='time'
            />
          )}
        />
        {/* <input
          {...register(`shifts.${index}.timeOfEnd`)}
          id='timeOfEnd'
          // disabled={shiftsValue && shiftsValue.length > 0}
          className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
            errors.timeOfEnd ? 'is-invalid' : ''
          }`}
          type='time'
        /> */}
        <div className='invalid-feedback'>{errors.timeOfEnd?.message}</div>
      </div>
      <div className='col-span-4 sm:col-span-2'>
        <button
          type='button'
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          onClick={() => {
            // @ts-ignore
            remove(index);
          }}
        >
          {index > 0 ? 'Удалить' : 'Очистить'}
        </button>
      </div>
      <div className='col-span-4 sm:col-span-2'>
        <div
          className={`grid grid-cols-3 md:grid-cols-${shiftList.length} md:gap-6`}
        >
          {shiftList.map((shift) => (
            <div key={shift.id} className='md:col-span-1'>
              <div>
                <div className='flex items-center'>
                  <Controller
                    control={control}
                    name={`shifts.${index}.shiftsList`}
                    render={({
                      field: { onChange, onBlur, ref, value, name },
                    }) => (
                      <input
                        value={shift.id}
                        id={shift.id}
                        type='radio'
                        name={name}
                        className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                        onChange={(e) => {
                          if (e?.target?.checked) {
                            // if (value?.shiftsList) {
                            // console.log(value.shiftsList);

                            // const index = shiftList.findIndex((s) => s.id === shiftsListValue);
                            // const shift = shiftList.find((s) => s.id === value.shiftsList)!;
                            // update(index, {
                            //   timeOfStart: shift.timeOfStart,
                            //   timeOfEnd: shift.timeOfEnd,
                            //   // dateOfShift: new Date(),
                            // });

                            console.log(shift.timeOfStart);

                            setValue(
                              `shifts.${index}.timeOfStart`,
                              shift.timeOfStart
                            );
                            setValue(
                              `shifts.${index}.timeOfEnd`,
                              shift.timeOfEnd
                            );

                            console.log(shift.timeOfStart);
                            onChange(shift.id);
                          }
                          // }
                        }}
                        onBlur={onBlur}
                        // value={value}
                      />
                    )}
                  />
                  {/* <input
                    value={shift.id}
                    id={shift.id}
                    type='radio'
                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                    {...register(`shifts.${index}.shiftsList`)}
                  /> */}
                  <label
                    htmlFor={shift.id}
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
      </div>
    </>
  );
};
