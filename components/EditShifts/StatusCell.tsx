import Image from 'next/image';
import React, { FC } from 'react';

import { TableShiftCellProps } from './utils/types';
import loader from '/public/loader.svg';

export const StatusCell: FC<TableShiftCellProps> = ({
  row: { original, index },
  row,
  isLoading,
  setIsLoading,
  save,
  getValues,
  setValue,
  updateMyData,
}) => {
  return (
    <button
      onClick={() =>
        save({
          shift: getValues(`table.${index}`),
          row,
          isLoading,
          setIsLoading,
          updateMyData,
          setValue,
        })
      }
      disabled={isLoading[original.id]}
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center w-full justify-center'
    >
      {isLoading[original.id] ? (
        <Image
          className='w-8 h-8 rounded-full'
          src={loader}
          width={24}
          height={24}
          alt='загрузка'
        />
      ) : (
        'Сохранить'
      )}
    </button>
  );
};
