import type { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const fastify: FastifyInstance = Fastify()

async function kusa() {
  ;(async () => {
    await fastify.register(cors, {})

    fastify.post('/data', (req) => {
      const data = req.body as {
        mail: string
        firstName: string
        lastName: string
        password: string
      }
      //console.log(data)でフロントエンドからリクエストされたデータを確認できるよ。
      const mail: string = data.mail
      const password: string = data.password
      const firstName: string = data.firstName
      const lastName: string = data.lastName
      return main(mail, password, firstName, lastName)
    })

    await fastify.listen({ port: 8080 })
    console.log(`Server listening at ${8080}`)
  })()
}

async function main(
  mail: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const result = await prisma.user.create({
    data: {
      mail: mail,
      password: password,
      firstName: firstName,
      lastName: lastName,
    },
  })
  console.log(result)
  console.log('mainは回った')
}

kusa()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
