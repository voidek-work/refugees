import { Shifts } from '@prisma/client';
import React, { FC } from 'react';
import { Control, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { TableOptions, usePagination, useTable } from 'react-table';

import { InputCell } from './InputCell';
import { IsLoading, SaveFn, SetIsLoading } from './utils/types';

type Props = TableOptions<Shifts> & {
  updateMyData: Function;
  skipPageReset: Function;
  control: Control<{ table: Shifts[] }>;
  register: UseFormRegister<{ table: Shifts[] }>;
  isLoading: IsLoading;
  setIsLoading: SetIsLoading;
  save: SaveFn;
  getValues: UseFormGetValues<{ table: Shifts[] }>;
};

export const Table: FC<Props> = ({
  columns,
  data,
  updateMyData,
  skipPageReset,
  control,
  register,
  isLoading,
  setIsLoading,
  save,
  getValues,
}) => {
  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: InputCell,
  };

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
      register,
      isLoading,
      control,
      setIsLoading,
      save,
      getValues,
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <table
        className='table-auto min-w-max divide-y divide-gray-200 border-b border-gray-200'
        {...getTableProps()}
      >
        <thead className='bg-gray-50'>
          {headerGroups.map((headerGroup) => (
            /* eslint-disable react/jsx-key */
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                /* eslint-disable react/jsx-props-no-spreading */
                <th
                  scope='col'
                  className='group text-center text-xs font-medium text-gray-500 tracking-wider'
                  {...column.getHeaderProps({
                    style: { width: `${column.width}px` },
                  })}
                >
                  {column.render('Header')}
                </th>
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
                    <td
                      className='whitespace-nowrap'
                      role='cell'
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
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
};

// console.log(getValues());
