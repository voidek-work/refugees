import { Shifts, User } from '@prisma/client';
import format from 'date-fns/format';

import { DateCell } from '../DateCell';
import { IsDriverCell } from '../IsDriverCell';
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
        },
        {
          Header: 'Окончание смены',
          accessor: 'dateEnd',
          Cell: DateCell,
        },
        {
          Header: 'Водитель',
          accessor: 'isDriver',
          Cell: IsDriverCell,
        },
        {
          Header: 'Количество пассажиров',
          accessor: 'countOfPassenger',
        },
        {
          Header: 'Telegram назначенного водителя',
          accessor: 'telegramNameDriver',
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
          Cell: (props) => <DateCell {...props} showTimeSelect={false} />,
        },
        {
          Header: 'Паспортные данные',
          accessor: 'user.passport',
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
        },
      ],
    },
    {
      Header: 'Сохранить',
      Cell: StatusCell,
    },
  ] as CellConf[];
