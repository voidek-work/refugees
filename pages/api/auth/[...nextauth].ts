import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '../../db';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        id: {},
        auth_date: {},
        first_name: {},
        hash: {},
        username: {},
      },
      async authorize(credentials, req) {
        /** Fetch User With TelegramID */
        console.log(credentials);
        const userData = await prisma.user.findUnique({
          where: {
            telegramId: credentials!.id,
          },
        });

        console.log(userData);

        if (userData) {
          const userPersistedSession = await prisma.session.findFirst({
            where: {
              userId: userData.id,
            },
          });

          // if (!userPersistedSession) {
          //   throw new Error('UniqueId Is Expired. Try To Generate Again.');
          // }

          // if (!compareMinutes(userPersistedSession[0].createdOn)) {
          //   throw new Error('UniqueId Is Expired. Try To Generate Again.');
          // }

          return userData;
        }

        const createdUser = await prisma.user.create({
          data: {
            // auth_date,
            name: credentials!.first_name,
            telegramName: credentials!.username,
            telegramId: credentials!.id,
          },
        });

        return createdUser;

        // throw new Error('User Is Not Valid. Please Register YourSelf.');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2000 * 60 * 60,
  },
  jwt: {
    secret: 'asdasdasd', //process.env.NEXT_PUBLIC_JWT_SECRET,
    maxAge: 2000 * 60 * 60, //2 Hours
  },
  callbacks: {
    async jwt({ token, user }) {
      //Set role and telegramId into jwt token
      if (user?.role) {
        token.role = user.role;
      }
      if (user?.telegramId) {
        token.telegramId = user.telegramId;
      }
      console.log(token);
      
      return token;
    },
    async session({ session, token }) {
      //Set role and telegramId into session
      console.log('token', token);
      
      if (token?.telegramId) {
        session.user.telegramId = token.telegramId as string;
      }
      console.log(session);
      return session;
    },
  },
});
