import { DriverChoice } from '@prisma/client';
import React, { FC } from 'react';

import { TableShiftCellProps } from './utils/types';

export const IsDriverCell: FC<TableShiftCellProps> = ({
  row: { index },
  register,
}) => {
  return (
    <select
      {...register(`table.${index}.isDriver`)}
      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md `}
    >
      <option value={DriverChoice.YES}>Да</option>
      <option value={DriverChoice.NO}>Нет</option>
      <option value={DriverChoice.WITH_DRIVER}>С водителем</option>
    </select>
  );
};
