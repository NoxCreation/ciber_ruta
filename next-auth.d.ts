import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT, JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string,
      first_name: string,
      last_name: string,
      email: string,
      role: string
    } & DefaultSession
  }

  interface User extends DefaultUser {
    user: {
      id: string,
      first_name: string,
      last_name: string,
      email: string,
      role: string,
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: {
      id: string,
      first_name: string,
      last_name: string,
      email: string,
      role: string,
    }

  }
}
