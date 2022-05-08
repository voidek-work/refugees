import { yupResolver } from '@hookform/resolvers/yup';
import { User, Shifts, DriverChoice, Choice, Direction } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';

import { DatePicker } from './DatePicker';
import { requiredMessage } from '../shared/validations';
import parse from 'date-fns/parse';
import { ShiftTime } from './ShiftTime';
import set from 'date-fns/set';
import { add } from 'date-fns';
import {
  useTable,
  usePagination,
  CellProps,
  ColumnInterface,
  ColumnWithStrictAccessor,
} from 'react-table';
import format from 'date-fns/format';

// Create an editable cell renderer
const EditableCell: FC<CellProps<Shifts> & { updateMyData: any }> = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      type='text'
      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md `}
    />
  );
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

// Be sure to pass our updateMyData and the skipPageReset option
// @ts-ignore
function Table({ columns, data, updateMyData, skipPageReset }) {
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // @ts-ignore
    page,
    // @ts-ignore
    canPreviousPage,
    // @ts-ignore
    canNextPage,
    // @ts-ignore
    pageOptions,
    // @ts-ignore
    pageCount,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    nextPage,
    // @ts-ignore
    previousPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      // @ts-ignore
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            /* eslint-disable react/jsx-key */
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                /* eslint-disable react/jsx-props-no-spreading */
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {/* @ts-ignore */}
          {page.map((row, i) => {
            prepareRow(row);
            return (
              /* eslint-disable react/jsx-props-no-spreading */
              <tr {...row.getRowProps()}>
                {/* @ts-ignore */}
                {row.cells.map((cell) => {
                  return (
                    /* eslint-disable react/jsx-props-no-spreading */
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='pagination'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export const EditShifts = ({
  user,
  shifts = [],
}: {
  user: User;
  shifts: Shifts[];
}) => {
  console.log(shifts);

  // city: null
  // comment: ""
  // countOfPassenger: 0
  // createdAt: "2022-05-08T14:11:22.851Z"
  // dateEnd: "2022-05-10T05:30:00.000Z"
  // dateStart: "2022-05-09T21:00:00.000Z"
  // direction: []
  // getVolunteers: "YES"
  // id: "cl2xdiag30059vwvye2i5omdi"
  // isDriver: "YES"
  // name: null
  // phone: null
  // telegram: null
  // telegramNameDriver: null
  // updatedAt: "2022-05-08T14:11:23.904Z"
  // user:
  // city: "Таганрог"
  // createdAt: "2022-05-08T14:03:08.529Z"
  // email: null
  // emailVerified: null
  // id: "cl2xd7p0x0002vwvykf9rc72i"
  // image: ""
  // name: "Vladislav"
  // phone: "+7 (123) 123-12-31"
  // telegramId: "525917739"
  // telegramName: "voidek"
  // [[Prototype]]: Object
  // userId: "cl2xd7p0x0002vwvykf9rc72i"

  const { control, register, getValues } = useForm<{ table: Shifts[] }>({
    defaultValues: {
      table: shifts,
    },
  });

  const { fields, append, prepend, remove, swap, move, insert, update } =
    useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'table', // unique name for your Field Array
    });

  console.log(getValues());

  const Cell = (props: CellProps<Shifts>) => {
    console.log(props);

    const { value, column, row } = props;
    console.log(`table.${row.index}.${column.id}`, value);
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
        />
      </>
    );
  };
  // format(new Date(value), 'dd.MM.yyyy HH:mm');
  const columns = React.useMemo(
    () =>
      [
        {
          Header: 'Создано',
          accessor: 'createdAt',
          Cell: ({ value }) => format(new Date(value), 'dd.MM.yyyy HH:mm'),
        },
        {
          Header: 'Начало смены',
          accessor: 'dateStart',
          Cell,
        },
        {
          Header: 'Окончание смены',
          accessor: 'dateEnd',
          Cell,
        },
        {
          Header: 'Водитель',
          accessor: 'isDriver',
          Cell: ({ value }) =>
            value === DriverChoice.YES
              ? 'Да'
              : value === DriverChoice.WITH_DRIVER
              ? 'С водителем'
              : 'Нет',
        },
        {
          Header: 'Готов взять',
          accessor: 'getVolunteers',
          Cell: ({ value }) => (value === Choice.YES ? 'Да' : 'Нет'),
        },
        {
          Header: 'Количество пассажиров',
          accessor: 'countOfPassenger',
        },
        {
          Header: 'Город',
          accessor: 'city',
        },
        {
          Header: 'Имя фамилия',
          accessor: 'name',
        },
        {
          Header: 'Телефон',
          accessor: 'phone',
        },
        {
          Header: 'Telegram',
          accessor: 'telegramName',
        },
        {
          Header: 'Telegram назначенного водителя',
          accessor: 'telegramNameDriver',
        },
      ] as {
        Header: string;
        accessor: keyof Shifts | keyof User;
        Cell: ({ value }: { value: string }) => JSX.Element;
      }[],
    []
  );
  const makeData = (num: number) => {
    return shifts;
  };

  const [data, setData] = React.useState(() => makeData(20));
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  // @ts-ignore
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
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
        <div className='mt-5 md:mt-0 md:col-span-2'>
          <Table
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
          />
        </div>
      </div>
    </div>
  );
};
