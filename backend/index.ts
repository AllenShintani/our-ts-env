import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import type { FastifyOAuth2Options } from '@fastify/oauth2'
import fastifyOAuth2 from '@fastify/oauth2'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import type { Session, User } from './types/User'
import dotenv from 'dotenv'

dotenv.config()
const server: FastifyInstance = Fastify()
const prisma = new PrismaClient()
const session = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

server.register(cors, {})
server.register(fastifyCookie)
server.register(fastifySession, {
  secret: session,
  cookie: {
    secure: false,
  },
})

server.post('/signup', async (req, reply) => {
  const data = req.body as { token: string; userData: User }
  const email: string = data.userData.email
  const password: string = data.userData.password
  const firstName: string | undefined = data.userData.firstName
  const lastName: string | undefined = data.userData.lastName
  const fullName =
    firstName && lastName ? `${lastName} ${firstName}` : undefined

  try {
    const result = await main(email, password, firstName, lastName, fullName)
    reply.send(result)
  } catch (error) {
    console.error(error)
    reply.status(500).send({ error: 'Internal Server Error' })
  }
})

server.post('/login', async (req, reply) => {
  const { email, password } = req.body as { email: string; password: string }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.password !== password) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    reply.send({ message: 'Login successful' })
  } catch (error) {
    console.error(error)
    reply.status(500).send({ error: 'Internal Server Error' })
  }
})

const main = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  fullName?: string
) => {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password,
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

//------------ここから下はOAuth認証関連の処理-----------------

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: any
  }
}

const googleOAuth2Options: FastifyOAuth2Options = {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID ?? '',
      secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
    auth: fastifyOAuth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/login/google',
  callbackUri: 'http://localhost:3000',
}

server.register(fastifyOAuth2, googleOAuth2Options)

const getUserInfo = (accessToken: string) => {
  return {
    accessToken,
    id: '12345',
    name: 'John Doe',
    email: 'john@example.com',
  }
}

server.get(
  '/login/google/callback',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token =
      await server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
    const userInfo = getUserInfo(token.access_token)
    ;(request.session as Session).user = userInfo
    reply.redirect('/')
  }
)

server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  const user = (request.session as Session).user

  if (user) {
    reply.send(`Welcome, ${user.name}!`)
  } else {
    reply.send('Please <a href="/login/google">log in</a> with Google.')
  }
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  ;`Server listening at ${address}`
})
