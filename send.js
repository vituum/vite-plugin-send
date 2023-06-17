import { config as dotenv } from 'dotenv'
import pc from 'picocolors'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'
import { getPackageInfo } from 'vituum/utils/common.js'
import { defaultOptions } from './index.js'

const { name, version } = getPackageInfo(import.meta.url)

const send = async (userConfig = defaultOptions) => {
    dotenv()

    const content = userConfig.content
    const to = userConfig.to

    console.info(`${pc.cyan(`${name} v${version}`)} ${pc.green('sending test email...')}`)

    if (!content && !userConfig.file) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('no content provided to send')}`)
    }

    if (!to) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('recipient not defined')}`)
    }

    if (!content || !to) {
        return
    }

    const transport = nodemailer.createTransport({
        host: userConfig.host,
        port: 465,
        auth: {
            user: userConfig.user,
            pass: userConfig.pass
        }
    })

    const file = path.join(process.cwd(), userConfig.file)

    if (!fs.existsSync(file)) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('email template not found')} ${pc.gray(file)}`)
        return
    }

    const html = fs.readFileSync(file).toString()

    await transport.sendMail({
        from: userConfig.send.from,
        to,
        subject: `${path.basename(process.cwd())} - ${path.basename(file)}`,
        html
    }, (error, info) => {
        if (error) {
            return console.error(pc.red(error))
        }

        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.green('test email sent')} ${pc.gray(info.messageId)}`)
    })
}

export default send
