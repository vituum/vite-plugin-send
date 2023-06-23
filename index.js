import { getPackageInfo, merge } from 'vituum/utils/common.js'
import send from './send.js'

const { name } = getPackageInfo(import.meta.url)

/**
 * @type {import('@vituum/vite-plugin-send/types').PluginUserConfig}
 */
export const defaultOptions = {
    content: null,
    filename: process.env.VITUUM_SEND_FILE || null,
    from: process.env.VITUUM_SEND_FROM || 'example@example.com',
    to: process.env.VITUUM_SEND_TO || null,
    host: process.env.VITUUM_SEND_HOST || null,
    user: process.env.VITUUM_SEND_USER || null,
    pass: process.env.VITUUM_SEND_PASS || null
}

/**
 * @param {import('@vituum/vite-plugin-send/types').PluginUserConfig} options
 * @returns {import('vite').Plugin}
 */
const plugin = (options = {}) => {
    options = merge(defaultOptions, options)

    return {
        name,
        enforce: 'post',
        configureServer (server) {
            server.ws.on('my:send', async ({ content, filename }) => {
                await send({
                    filename: filename.replace('.html', ''),
                    content,
                    from: options.from,
                    to: options.to,
                    host: options.host,
                    user: options.user,
                    pass: options.pass
                })
            })
        },
        transformIndexHtml: {
            async transform (content, { path, filename, server }) {
                const html = `
                    <script>
                        if (import.meta.hot && window.location.search === '?send') {
                            import.meta.hot.send('my:send', { filename: window.location.href, content: document.doctype + document.documentElement.outerHTML })
                        }
                    </script>
                `
                content = content.replace('</head>', html + '</head>')

                return content
            }
        }
    }
}

export { send }
export default plugin
