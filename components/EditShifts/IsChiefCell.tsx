import { ChiefShift } from '@prisma/client';
import React, { FC } from 'react';

import { TableShiftCellProps } from './utils/types';

export const IsСhiefCell: FC<TableShiftCellProps> = ({
  row: { index },
  register,
}) => {
  return (
    <select
      {...register(`table.${index}.chiefShift`, {
        setValueAs: (v: ChiefShift | '') => v || null,
      })}
      className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md `}
    >
      <option value={''}>Нет</option>
      <option value={ChiefShift.MORNING}>Утро</option>
      <option value={ChiefShift.EVENING}>Вечер</option>
    </select>
  );
};
