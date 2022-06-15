import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      telegramId: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface JWT extends Record<string, unknown>, DefaultJWT {
    telegramId: string;
  }
}
