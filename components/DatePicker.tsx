import React, { FC, useState } from 'react';
import DatePickerComponent, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { UseFormRegisterReturn } from 'react-hook-form';

import styles from './DatePicker.module.css';

type Props = { date?: Date; id?: string; className?: string } & (
  | ReactDatePickerProps
  | UseFormRegisterReturn
);

export const DatePicker: FC<Props> = ({ date, className, id, ...props }) => {
  const [selectedDate, setSelectedDate] = useState(date);
  return (
    <DatePickerComponent
      {...props}
      selected={selectedDate}
      onChange={(newDate: Date) => setSelectedDate(newDate)}
      className={className}
      calendarClassName={
        (props as ReactDatePickerProps).showTimeSelectOnly
          ? 'timeCalendar' //styles.timeCalendar
          : undefined
      }
      id={id}
      locale='ru-RU'
    />
  );
};
