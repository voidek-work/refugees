import { yupResolver } from '@hookform/resolvers/yup';
import { Shifts, User } from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Table } from './Table';
import { shiftsColumns } from './utils/columns';
import { save } from './utils/save';
import { validationSchemaShifts } from './utils/validators';

export const EditShifts = ({
  user,
  shifts = [],
}: {
  user: User;
  shifts: Shifts[];
}) => {
  const { control, register, getValues, setValue } = useForm<{
    table: Shifts[];
  }>({
    defaultValues: {
      table: shifts,
    },
    resolver: yupResolver(validationSchemaShifts),
  });

  useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'table', // unique name for your Field Array
  });

  // Be sure to pass our updateMyData and the skipPageReset option
  // @ts-ignore

  const [isLoading, setIsLoading] = useState({});

  const columns = useMemo(() => shiftsColumns(), []);

  const makeData = (num: number) => {
    return shifts;
  };

  const [data, setData] = useState(() => makeData(20));
  const [originalData] = useState(data);
  const [skipPageReset, setSkipPageReset] = useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  // @ts-ignore
  const updateMyData = (rowIndex, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            ...value,
          };
        }
        return row;
      })
    );
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData);
  return (
    <div className='mt-10 sm:mt-0 mb-10 sm:mb-0'>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <h1 className='text-lg mt-5 mb-2'>Записи на смену</h1>
      </div>
      <div className='md:grid md:grid-cols-2 md:gap-6'>
        <div className='mt-5 md:mt-0 md:col-span-2 overflow-auto'>
          <Table
            control={control}
            // @ts-ignore
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            // @ts-ignore
            skipPageReset={skipPageReset}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            register={register}
            save={save}
            getValues={getValues}
            setValue={setValue}
          />
        </div>
      </div>
    </div>
  );
};
