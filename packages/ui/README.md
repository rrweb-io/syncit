# @syncit/ui

[![npm version](https://badge.fury.io/js/%40syncit%2Fui.svg)](https://badge.fury.io/js/%40syncit%2Fui)

UI & demo project for Syncit, see [Guide.md](../../guide.md) for more details.

## Developing

Install dependencies with `yarn`, start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

Everything inside `src/lib` is part of the library, everything inside `src/routes` can be used as a showcase or preview app.

This project is powered by Svelte(kit): Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

Read more about creating a library [in the docs](https://kit.svelte.dev/docs/packaging).

## Building

To build the library:

```bash
npm run package
```

To create a production version of the showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Publishing

To publish your library to [npm](https://www.npmjs.com):

```bash
yarn publish
```
