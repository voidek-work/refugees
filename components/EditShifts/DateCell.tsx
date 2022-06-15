import React from 'react';

import { DatePicker } from '../DatePicker';
import { TableShiftCellProps } from './utils/types';

export const DateCell = (
  props: TableShiftCellProps & { showTimeSelect?: boolean; dateFormat?: string }
) => {
  const {
    showTimeSelect = true,
    dateFormat = 'dd.MM.yyyy HH:mm',
    column,
    row,
    control,
  } = props;

  return (
    <>
      <DatePicker
        name={`table.${row.index}.${column.id}`}
        // ${
        //errors?.dateOfShift ? 'is-invalid' : ''
        //}
        // value={value}
        className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md `}
        // @ts-ignore
        control={control}
        dateFormat={dateFormat}
        showTimeSelect={showTimeSelect}
        timeFormat='HH:mm'
      />
    </>
  );
};
