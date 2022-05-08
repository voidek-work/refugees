import 'react-datepicker/dist/react-datepicker.css';

import React, { FC, useEffect, useState } from 'react';
import DatePickerComponent, { ReactDatePickerProps } from 'react-datepicker';
import {
  Control,
  Controller,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form';
import format from 'date-fns/format';

type Props = {
  date?: Date;
  id?: string;
  className?: string;
  name: string;
  control: Control<FieldValues, any> | undefined;
  dateFormat: string;
};

export const DatePicker: FC<Props> = ({
  date,
  className,
  id,
  name,
  control,
  dateFormat = 'dd.MM.yyyy',
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        console.log('value', value);

        return (
          <DatePickerComponent
            onChange={onChange}
            onBlur={onBlur}
            selected={value}
            className={className}
            calendarClassName={
              (props as ReactDatePickerProps).showTimeSelectOnly
                ? 'timeCalendar' //styles.timeCalendar
                : undefined
            }
            id={id}
            locale='ru-RU'
            dateFormat={dateFormat}
          />
          // <></>
        );
      }}
    />
    // <DatePickerComponent
    //   {...props}
    //   selected={selectedDate}
    //   // value={format(selectedDate || 0, 'dd.MM.yyyy')}
    //   onChange={(
    //     newDate: Date,
    //     event: React.SyntheticEvent<any, Event> | undefined
    //   ) => {
    //     setSelectedDate(newDate);
    //     if (!!onChange) {
    //       onChange(format(selectedDate || 0, 'dd.MM.yyyy'));
    //     }
    //   }}
    //   className={className}
    //   calendarClassName={
    //     (props as ReactDatePickerProps).showTimeSelectOnly
    //       ? 'timeCalendar' //styles.timeCalendar
    //       : undefined
    //   }
    //   id={id}
    //   locale='ru-RU'
    // />
  );
};
