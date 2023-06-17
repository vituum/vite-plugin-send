import { getPackageInfo, merge } from 'vituum/utils/common.js'
import send from './send.js'

const { name } = getPackageInfo(import.meta.url)

/**
 * @type {import('@vituum/vite-plugin-send/types/index').PluginUserConfig}
 */
export const defaultOptions = {
    content: null,
    file: process.env.VITUUM_SEND_FILE || null,
    from: process.env.VITUUM_SEND_FROM || 'example@example.com',
    to: process.env.VITUUM_SEND_TO || null,
    host: process.env.VITUUM_SEND_HOST || null,
    user: process.env.VITUUM_SEND_USER || null,
    pass: process.env.VITUUM_SEND_PASS || null
}

/**
 * @param {import('@vituum/vite-plugin-send/types/index').PluginUserConfig} options
 * @returns {import('vite').Plugin}
 */
const plugin = (options = {}) => {
    options = merge(defaultOptions, options)

    return {
        name,
        enforce: 'post',
        transformIndexHtml: {
            async transform (content, { path, server }) {
                if (server && path.endsWith('?send')) {
                    await send({
                        content: options.content,
                        from: options.from,
                        to: options.to,
                        host: options.host,
                        user: options.user,
                        pass: options.pass
                    })
                }

                return content
            }
        }
    }
}

export { send }
export default plugin
