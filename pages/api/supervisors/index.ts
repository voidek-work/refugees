// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession } from 'next-auth/react';

import { prisma } from '../../../shared/db';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await getSession({ req });

  const chatId = session?.user?.telegramId;
  const isAdmin = session?.user?.isAdmin;

  let supervisors;

  if (chatId && isAdmin && req.body) {
    await prisma.supervisor.deleteMany({});
    supervisors = await prisma.supervisor.createMany({
      data: req.body,
    });

    res.status(200).json(supervisors);
  }
  res.end();
}
