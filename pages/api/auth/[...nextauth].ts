import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '../../../shared/db';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      name: 'telegram',
      credentials: {
        id: {},
        auth_date: {},
        first_name: {},
        hash: {},
        username: {},
      },
      async authorize(credentials) {
        const userData = await prisma.user.findUnique({
          where: {
            telegramId: credentials!.id,
          },
        });

        if (userData) {
          return userData;
        }

        const createdUser = await prisma.user.create({
          data: {
            name: credentials!.first_name,
            telegramName: credentials!.username,
            telegramId: credentials!.id,
          },
        });

        return createdUser;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2000 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    maxAge: 2000 * 60 * 60, //2 Hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.telegramId) {
        token.telegramId = user.telegramId;
      }
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.telegramId) {
        session.user.telegramId = token.telegramId as string;
      }
      if (token?.isAdmin) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
