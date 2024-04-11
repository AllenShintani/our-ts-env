import { initTRPC } from '@trpc/server'
import { prisma } from '../../prisma/client'
import { z } from 'zod'
import { compare } from 'bcrypt'
import { loginSchema } from '../schemas/userSchemas'

const t = initTRPC.create()

export const loginRouter = t.router({
  login: t.procedure
    .input(
      z.object({
        loginData: loginSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { loginData } = input
      const { email, password } = loginData

      try {
        const userInPrisma = await prisma.user.findUnique({
          where: { email },
        })

        const passwordIsCorrect = await compare(
          password,
          userInPrisma?.hashedPassword || ''
        )
        if (!userInPrisma || !passwordIsCorrect) {
          throw new Error('Invalid email or password')
        }

        return { message: 'Login successful' }
      } catch (error) {
        console.error(error)
      }
    }),
})
