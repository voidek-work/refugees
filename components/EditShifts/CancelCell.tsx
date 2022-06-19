import Image from 'next/image';
import React, { FC } from 'react';

import { TableShiftCellProps } from './utils/types';
import loader from '/public/loader.svg';
import { ShiftStatus } from '@prisma/client';

export const CancelCell: FC<TableShiftCellProps> = ({
  row: { original, index },
  row,
  isLoading,
  setIsLoading,
  save,
  getValues,
  updateMyData,
  setValue,
}) => {
  const isActive = original.status === ShiftStatus.ACTIVE;

  return (
    <button
      onClick={() =>
        save({
          shift: {
            ...getValues(`table.${index}`),
            status: isActive ? ShiftStatus.CANCELED : ShiftStatus.ACTIVE,
          },
          row,
          isLoading,
          setIsLoading,
          updateMyData,
          setValue,
        })
      }
      disabled={isLoading[original.id]}
      className={`${isActive ? 'bg-red-500' : 'bg-green-500'} hover:${
        isActive ? 'bg-red-700' : 'bg-green-700'
      } text-white font-bold py-2 px-4 rounded flex items-center w-full justify-center`}
    >
      {isLoading[original.id] ? (
        <Image
          className='w-8 h-8 rounded-full'
          src={loader}
          width={24}
          height={24}
          alt='загрузка'
        />
      ) : isActive ? (
        'Отменить'
      ) : (
        'Возобновить'
      )}
    </button>
  );
};
