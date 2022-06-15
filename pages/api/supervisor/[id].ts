// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Supervisor } from '@prisma/client';
import { getSession } from 'next-auth/react';

import { prisma } from '../../../shared/db';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Supervisor>
) {
  const session = await getSession({ req });

  const chatId = session?.user?.telegramId;
  const isAdmin = session?.user?.isAdmin;

  let supervisor;

  if (chatId && isAdmin) {
    switch (req.method) {
      case 'CREATE':
        supervisor = await prisma.supervisor.create({
          data: {
            ...req.body,
          },
        });
        break;
      case 'POST':
        supervisor = await prisma.supervisor.update({
          where: {
            phone: req.body.phone,
          },
          data: {
            ...req.body,
          },
        });
        break;
      case 'DELETE':
        supervisor = await prisma.supervisor.delete({
          where: {
            phone: req.body.phone,
          },
        });
        break;

      default:
        return res.status(400);
    }

    res.status(200).json(supervisor);
  }
  res.end();
}
