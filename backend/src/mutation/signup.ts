import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../components/lib/firebase/firebase'
import { prisma } from '../../prisma/client'
import { hash } from 'bcrypt'

export const signup = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  fullName?: string
) => {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const hashedPassword = await hash(password, 10)
  try {
    await createUserWithEmailAndPassword(auth, email, hashedPassword)
    await prisma.user.create({
      data: {
        email,
        hashedPassword: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        fullName: fullName,
      },
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
