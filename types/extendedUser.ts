import { User } from '@prisma/client';

export type ExtendedUser = User & { isSupervisor: boolean; isChief: boolean };
