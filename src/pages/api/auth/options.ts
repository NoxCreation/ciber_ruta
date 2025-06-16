import { Manager } from '@/utils/engine'
import { checkPassword } from '@/utils/hash'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'email', type: 'email', placeholder: 'email' },
        password: { label: 'password', type: 'password', placeholder: 'password' }
      },
      async authorize(credentials: any) {
        const { email, password } = credentials

        const user = await (await Manager().User.findOne({
          where: {
            email
          }
        })).toJSON() as any

        // Si existe el correo en la BD
        if (!user)
          throw new Error("Usuario no válido")

        // Si la contraseña es valida
        const password_hash = user.password_hash
        const passwordIsValid = await checkPassword(password, password_hash)
        if (!passwordIsValid)
          throw new Error("Contraseña no válida")

        return { ...user }
      },
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/login',
  },
  callbacks: {
    async jwt(props) {
      const { token, user } = props
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return { ...user, ...token }
    },

    async session(props) {
      const { session, token } = props
      session.user = token as any
      //console.log("token", token) 
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 1 day //7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 24 * 60 * 60 // 1 day //7 * 24 * 60 * 60, // 7 days
  },
}
