import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { supabase, mapUserFromDatabase, mapUserToDatabase, User } from './supabase'
import { UserRole } from '@timeoff/types'
import { env, devLog } from './env'

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth (only if credentials are provided)
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          // Check if user exists in our database
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !user) {
            throw new Error('User not found')
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '')
          
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          // Map user data from database format
          const mappedUser = mapUserFromDatabase(user)

          return {
            id: mappedUser.id,
            email: mappedUser.email,
            name: `${mappedUser.firstName} ${mappedUser.lastName}`,
            first_name: mappedUser.firstName,
            last_name: mappedUser.lastName,
            department: mappedUser.department,
            team: mappedUser.team,
            role: mappedUser.role as UserRole,
            managerId: mappedUser.managerId,
            hireDate: mappedUser.hireDate,
            isActive: mappedUser.isActive,
          }
        } catch (error) {
          devLog.error('Error during credentials authorization:', error)
          return null
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our database
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email || '')
            .single()

          if (!existingUser) {
            // Create new user in our database
            const userData = mapUserToDatabase({
              email: user.email || 'unknown@example.com',
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              avatar: user.image || undefined,
              department: 'Unassigned',
              team: 'Unassigned',
              role: 'employee',
              hireDate: new Date(),
              isActive: true,
            })

            const { data: newUser, error } = await supabase
              .from('users')
              .insert(userData)
              .select()
              .single()

            if (error) {
              devLog.error('Error creating user:', error)
              return false
            }
          }
        } catch (error) {
          devLog.error('Error during sign in:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Get user data from our database
          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single()

          if (user) {
            const mappedUser = mapUserFromDatabase(user)
            session.user = {
              ...session.user,
              id: mappedUser.id,
              first_name: mappedUser.firstName,
              last_name: mappedUser.lastName,
              department: mappedUser.department,
              team: mappedUser.team,
              role: mappedUser.role,
              managerId: mappedUser.managerId,
              hireDate: mappedUser.hireDate,
              isActive: mappedUser.isActive,
            } as any
          }
        } catch (error) {
          devLog.error('Error fetching user data:', error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.first_name = (user as any).first_name
        token.last_name = (user as any).last_name
        token.department = (user as any).department
        token.team = (user as any).team
        token.role = (user as any).role
        token.managerId = (user as any).managerId
        token.hireDate = (user as any).hireDate
        token.isActive = (user as any).isActive
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === 'development',
} 