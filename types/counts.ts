import { TimesOfDay } from '@prisma/client';
export type Counts = {
  [key in TimesOfDay]: CountShifts;
};

export type CountShifts = { current: number; max: number };
