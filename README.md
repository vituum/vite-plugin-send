<a href="https://npmjs.com/package/@vituum/vite-plugin-send"><img src="https://img.shields.io/npm/v/@vituum/vite-plugin-send.svg" alt="npm package"></a>
<a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@vituum/vite-plugin-send.svg" alt="node compatility"></a>

# ⚡️✉️ ViteSend
Lets you send content of your page via `nodemailer` when `?send` get param is present in Vite Dev Server. Handy for testing email templates!

You can also export `send` from `@vituum/vite-plugin-send` or `@vituum/vite-plugin-send/send.js` to write a custom script which you can call via Node.js

## Basic usage

```js
import send from '@vituum/vite-plugin-send'

export default {
  plugins: [
    send()
  ]
}
```

Read the [docs](https://vituum.dev/plugins/send) to learn more about plugin options.

### Requirements

- [Node.js LTS (18.x)](https://nodejs.org/en/download/)
- [Vite](https://vitejs.dev/)
