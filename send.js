import { styleText } from 'node:util'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'
import { getPackageInfo } from 'vituum/utils/common.js'
import process from 'node:process'

const { name, version } = getPackageInfo(import.meta.url)

const envPath = path.resolve(process.cwd(), '.env')
const envLocalPath = path.resolve(process.cwd(), '.env.local')

if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

if (fs.existsSync(envLocalPath)) {
  process.loadEnvFile(envLocalPath)
}

const send = async (userOptions = {}) => {
  console.info(`${styleText('cyan', `${name} v${version}`)} ${styleText('green', 'sending test email...')}`)

  if (!userOptions.to) {
    console.info(`${styleText('cyan', `${name} v${version}`)} ${styleText('red', 'recipient not defined')}`)
    return
  }

  if (!userOptions.user || !userOptions.host || !userOptions.pass) {
    console.info(`${styleText('cyan', `${name} v${version}`)} ${styleText('red', 'SMTP credentials not defined')}`)
    return
  }

  let subject = 'Vituum Email'
  let html = userOptions.content

  const transport = nodemailer.createTransport({
    host: userOptions.host,
    port: 465,
    auth: {
      user: userOptions.user,
      pass: userOptions.pass,
    },
  })

  if (userOptions.filename) {
    const file = path.resolve(process.cwd(), userOptions.filename)

    subject = path.basename(file)

    if (!userOptions.content) {
      html = fs.readFileSync(file).toString()
    }
  }

  if (!userOptions.content) {
    console.info(`${styleText('cyan', `${name} v${version}`)} ${styleText('red', 'no content to send')}`)
    return
  }

  transport.sendMail({
    from: userOptions.from,
    to: userOptions.to,
    subject,
    html,
  }, (error, info) => {
    if (error) {
      return console.error(styleText('red', error.toString()))
    }

    console.info(`${styleText('cyan', `${name} v${version}`)} ${styleText('green', 'test email sent')} ${styleText('gray', info.messageId)}`)
  })
}

export default send
