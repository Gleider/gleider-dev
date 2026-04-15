import NextAuth, { type NextAuthResult } from 'next-auth';
import GitHub from 'next-auth/providers/github';

const ALLOWED_GITHUB_USERNAME = 'Gleider';

const nextAuth: NextAuthResult = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/admin/login',
  },

  callbacks: {
    async signIn({ profile }) {
      return profile?.login === ALLOWED_GITHUB_USERNAME;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubUsername = profile.login as string;
        token.githubId = profile.id as string;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.githubUsername = token.githubUsername as string;
      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = nextAuth;
