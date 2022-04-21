// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Shifts } from '@prisma/client';
import { getSession } from 'next-auth/react';

import { prisma } from '../db';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Shifts>
) {
  console.log(req.body);
  const session = await getSession({ req });
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    });
    const shift = await prisma.shifts.create({
      data: req.body,
    });
    console.log(shift);
    res.status(200).json(shift);
  }
  res.end();
}
