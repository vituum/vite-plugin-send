export interface PluginUserConfig {
    content?: string
    filename?: string
    from?: string
    to?: string
    host?: string
    user?: string
    pass?: string
}

export default function plugin(options?: PluginUserConfig) : import('vite').Plugin
