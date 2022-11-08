import { sveltekit } from '@sveltejs/kit/vite'
import { optimizeImports } from 'carbon-preprocess-svelte'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), optimizeImports()]
}

export default config
