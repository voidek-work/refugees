import React from 'react';

import { DatePicker } from '../DatePicker';
import { TableShiftCellProps } from './utils/types';

export const DateCell = (
  props: TableShiftCellProps & { showTimeSelect?: boolean }
) => {
  const { showTimeSelect = true, column, row, control } = props;

  return (
    <>
      <DatePicker
        name={`table.${row.index}.${column.id}`}
        // ${
        //errors?.dateOfShift ? 'is-invalid' : ''
        //}
        // value={value}
        className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md `}
        // @ts-ignore
        control={control}
        dateFormat='dd.MM.yyyy HH:mm'
        showTimeSelect={showTimeSelect}
        timeFormat='HH:mm'
      />
    </>
  );
};
