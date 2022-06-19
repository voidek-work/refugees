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
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  timeFormat?: string;
};

export const DatePicker: FC<Props> = ({
  date,
  className,
  id,
  name,
  control,
  dateFormat = 'dd.MM.yyyy',
  minDate,
  maxDate,
  showTimeSelect,
  timeFormat,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
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
            minDate={minDate}
            maxDate={maxDate}
            showTimeSelect={showTimeSelect}
            timeFormat={timeFormat}
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
