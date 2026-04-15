import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    githubUsername?: string;
  }

  interface Session {
    user: User & {
      githubUsername?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    githubUsername?: string;
    githubId?: string;
  }
}
