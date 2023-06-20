import { config as dotenv } from 'dotenv'
import pc from 'picocolors'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'
import { getPackageInfo } from 'vituum/utils/common.js'
import { defaultOptions } from './index.js'

const { name, version } = getPackageInfo(import.meta.url)

dotenv()

const send = async (userConfig = defaultOptions) => {
    console.info(`${pc.cyan(`${name} v${version}`)} ${pc.green('sending test email...')}`)

    if (!userConfig.content || !userConfig.filename) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('no content provided to send')}`)
    }

    if (!userConfig.to) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('recipient not defined')}`)
    }

    if (!userConfig.content || !userConfig.to) {
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

    const file = path.resolve(process.cwd(), userConfig.filename)

    if (!fs.existsSync(file)) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('email template file not found')} ${pc.gray(file)}`)
        return
    }

    await transport.sendMail({
        from: userConfig.from,
        to: userConfig.to,
        subject: `${path.basename(process.cwd())} - ${path.basename(file)}`,
        html: userConfig.content ? userConfig.content : fs.readFileSync(file).toString()
    }, (error, info) => {
        if (error) {
            return console.error(pc.red(error))
        }

        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.green('test email sent')} ${pc.gray(info.messageId)}`)
    })
}

export default send
