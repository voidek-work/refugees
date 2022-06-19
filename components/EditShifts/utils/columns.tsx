import { Shifts, User } from '@prisma/client';
import format from 'date-fns/format';
import { CancelCell } from '../CancelCell';

import { DateCell } from '../DateCell';
import { IsСhiefCell } from '../IsChiefCell';
import { IsDriverCell } from '../IsDriverCell';
import { IsSupervisorCell } from '../IsSupervisorCell';
import { StatusCell } from '../StatusCell';
import { TableShiftCellProps } from './types';

type CellConf = {
  Header: string;
  accessor: keyof Shifts | keyof User;
  Cell: (props: TableShiftCellProps) => JSX.Element;
  columns?: CellConf[];
};

export const shiftsColumns = () =>
  [
    {
      Header: 'Смена',
      columns: [
        {
          Header: 'Создано',
          accessor: 'createdAt',
          Cell: ({ value }) => format(new Date(value), 'dd.MM.yyyy HH:mm'),
        },
        {
          Header: 'Начало смены',
          accessor: 'dateStart',
          Cell: DateCell,
          width: 135,
        },
        {
          Header: 'Окончание смены',
          accessor: 'dateEnd',
          Cell: DateCell,
          width: 135,
        },
        {
          Header: 'Водитель',
          accessor: 'isDriver',
          Cell: IsDriverCell,
          width: 137,
        },
        {
          Header: 'Количество пассажиров',
          accessor: 'countOfPassenger',
          width: 76,
        },
        {
          Header: 'Telegram назначенного водителя',
          accessor: 'telegramNameDriver',
          width: 120,
        },
        {
          Header: 'Старший смены',
          accessor: 'isSupervisor',
          Cell: IsSupervisorCell,
          width: 80,
        },
        {
          Header: 'Начальник штаба',
          accessor: 'chiefShift',
          Cell: IsСhiefCell,
          width: 95,
        },
      ],
    },
    {
      Header: 'Пользователь',
      columns: [
        {
          Header: 'Город',
          accessor: 'user.city',
        },
        {
          Header: 'Имя фамилия',
          accessor: 'user.name',
        },
        {
          Header: 'Дата рождения',
          accessor: 'user.dateOfBirthday',
          Cell: (props) => (
            <DateCell
              {...props}
              showTimeSelect={false}
              dateFormat='dd.MM.yyyy'
            />
          ),
          width: 95,
        },
        {
          Header: 'Паспортные данные',
          accessor: 'user.passport',
          width: 106,
        },
        {
          Header: 'Адрес',
          accessor: 'user.passportAddress',
        },
        {
          Header: 'Телефон',
          accessor: 'user.phone',
        },
        {
          Header: 'Telegram',
          accessor: 'user.telegramName',
          width: 124,
        },
      ],
    },
    {
      Header: 'Сохранить',
      Cell: StatusCell,
    },
    {
      Header: 'Отменить',
      Cell: CancelCell,
    },
  ] as CellConf[];
