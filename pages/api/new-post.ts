import { Prisma } from '@prisma/client';
import { getUser, withApiAuth } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default withApiAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getUser({ req, res });
  const body = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        ...body,
        createdAt: new Date(),
        createdBy: user.id,
      },
    });

    return res.status(200).json({ post });
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: e.message });
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return res.status(400).json({ error: 'Taki slug już istnieje w systemie' });
      }
    }
  }

  return res.status(400).json({ error: 'Something went wrong. Try again' });
});
