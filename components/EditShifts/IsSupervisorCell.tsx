import { Choice } from '@prisma/client';
import React, { FC } from 'react';

import { TableShiftCellProps } from './utils/types';

export const IsSupervisorCell: FC<TableShiftCellProps> = ({
  row: { index },
  register,
}) => {
  return (
    <select
      {...register(`table.${index}.isSupervisor`)}
      className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md `}
    >
      <option value={Choice.YES}>Да</option>
      <option value={Choice.NO}>Нет</option>
    </select>
  );
};
