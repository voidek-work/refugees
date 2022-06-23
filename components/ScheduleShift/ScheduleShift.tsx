import { User } from '@prisma/client';
import React, { FC } from 'react';
import styles from './ScheduleShift.module.css';

export const ScheduleShift: FC<{ user: User; schedule: JSX.Element }> = ({
  schedule,
}) => {
  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h1 className='text-lg mt-5 mb-2'>Актуальный график смен</h1>
      </div>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <div className='mt-5 md:mt-0 md:col-span-2'>
          <div className='px-4 py-5 bg-white sm:p-6'>
            <div className={styles.preWrap}>{schedule}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
