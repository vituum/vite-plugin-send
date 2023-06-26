import { config as dotenv } from 'dotenv'
import pc from 'picocolors'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'
import { getPackageInfo } from 'vituum/utils/common.js'

const { name, version } = getPackageInfo(import.meta.url)

dotenv()

const send = async (userOptions = {}) => {
    console.info(`${pc.cyan(`${name} v${version}`)} ${pc.green('sending test email...')}`)

    if (!userOptions.to) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('recipient not defined')}`)
        return
    }

    if (!userOptions.user || !userOptions.host || !userOptions.pass) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('SMTP credentials not defined')}`)
        return
    }

    let subject = 'Vituum Email'
    let html = userOptions.content

    const transport = nodemailer.createTransport({
        host: userOptions.host,
        port: 465,
        auth: {
            user: userOptions.user,
            pass: userOptions.pass
        }
    })

    if (userOptions.filename) {
        const file = path.resolve(process.cwd(), userOptions.filename)

        subject = path.basename(file)

        if (!userOptions.content) {
            html = fs.readFileSync(file).toString()
        }
    }

    if (!userOptions.content) {
        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.red('no content to send')}`)
        return
    }

    await transport.sendMail({
        from: userOptions.from,
        to: userOptions.to,
        subject,
        html
    }, (error, info) => {
        if (error) {
            return console.error(pc.red(error))
        }

        console.info(`${pc.cyan(`${name} v${version}`)} ${pc.green('test email sent')} ${pc.gray(info.messageId)}`)
    })
}

export default send
