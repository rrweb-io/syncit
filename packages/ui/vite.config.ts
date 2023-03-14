import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import sveltePreprocess from 'svelte-preprocess';
import type { BuildOptions, PluginOption } from 'vite';

export default defineConfig(({ command, mode }) => {
	let plugins: PluginOption[] = [sveltekit()];
	let build: BuildOptions = {};
	if (mode === 'production') {
		build = {
			minify: false,
			lib: {
				entry: './src/lib/index.ts',
				name: 'syncit'
			}
		};
		plugins = [
			dts({
				insertTypesEntry: true
			}),

			svelte({
				preprocess: [sveltePreprocess({ typescript: true })]
			})
		];
	}

	return {
		build,
		plugins,
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		}
	};
});
