import { initTRPC } from '@trpc/server'
import { userSchema } from '../schemas/userSchemas'
import { z } from 'zod'
import { signup } from '../mutation/signup'

const t = initTRPC.create()

export const signupRouter = t.router({
  signup: t.procedure
    .input(
      z.object({
        userData: userSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { userData } = input
      const { email, password, firstName, lastName } = userData
      const fullName =
        firstName && lastName ? `${lastName} ${firstName}` : undefined

      try {
        await signup(email, password, firstName, lastName, fullName)
        return { message: 'Signup successful' }
      } catch (error) {
        console.error('Error in signup mutation:', error)
        throw new Error('Internal Server Error')
      }
    }),
})
