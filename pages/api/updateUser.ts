// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@prisma/client';
import { getSession } from 'next-auth/react';

import { prisma } from '../../shared/db';

import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  console.log(req.body);
  const session = await getSession({ req });
  if (session?.user?.telegramId) {
    const user = await prisma.user.update({
      where: { telegramId: session?.user?.telegramId },
      data: req.body,
    });
    console.log(user);
    res.status(200).json(user);
  }
  res.end();
}
