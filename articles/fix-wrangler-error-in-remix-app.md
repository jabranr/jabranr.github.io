---
layout: post
title: How to resolve Cloudflare Workers Sites deploy error in a Remix app
date: 2023-02-14 07:00:00
categories: articles
tags: ['articles', remix, wrangler, cloudflare, workers, 'workers-sites']
excerpt: How to resolve "The uploaded script has no registered event handlers. " in the Remix.run app
comment: true
private: false
---

If you have a Cloudflare Workers Sites in [Remix](https://remix.run), there are high chance that you may have already or will face the following error on deployment to Cloudflare:

```bash
The uploaded script has no registered event handlers. [code: 10068]
```

This error happens with `wrangler` v2 in the Remix app. If at least one package/dependency in a Remix app has ESM export format and it gets bundled along with the `worker` script then `wrangler`'s automatic format guess does not work quite correctly.

There is already an [issue](https://github.com/cloudflare/workers-sdk/issues/1668) and a [pull request](https://github.com/cloudflare/workers-sdk/pull/2396) for this at the wrangler GitHub repository.

Meanwhile, this issue can be fixed using a patch. Here are the steps to patch the wrangler to make it work correctly. There are 2 parts to this.

### Part 1

> Part 1 is the setup so it is only needed once.

- Install `patch-package`—an extremely useful package to patch broken node modules.

```bash
npm install patch-package
```

- Now go to **`node_modules/wrangler/src/entry.ts`** and replace all entries for:

```js
format: 'esm';
```

with

```js
format: hint === 'service-worker' ? 'cjs' : 'esm';
```

- Now go to **`node_modules/wrangler/wrangler-dist/cli.js`** and repeat the above step and replace all entries for:

```js
format: 'esm';
```

with

```js
format: hint === 'service-worker' ? 'cjs' : 'esm';
```

- Save the files
- Go to the root of the app in the CLI
- Run the following and wait for it to finish creating the patch

```bash
node_modules/.bin/patch-package wrangler
```

This will create a patch file in `patches/warngler+{version}.patch`. It will look something like the following:

> Do not copy the following code. It is incomplete and for reference only.

```diff
diff --git a/node_modules/wrangler/src/entry.ts b/node_modules/wrangler/src/entry.ts
index 3ee1afe..585cb84 100644
--- a/node_modules/wrangler/src/entry.ts
+++ b/node_modules/wrangler/src/entry.ts
@@ -151,7 +151,7 @@ export default async function guessWorkerFormat(
 		absWorkingDir: entryWorkingDirectory,
 		metafile: true,
 		bundle: false,
-		format: "esm",
+		format: hint === "service-worker" ? "cjs" : "esm",
 		target: "es2020",
 		write: false,
 		loader: {
diff --git a/node_modules/wrangler/wrangler-dist/cli.js b/node_modules/wrangler/wrangler-dist/cli.js
index 622e617..0090fbd 100644
--- a/node_modules/wrangler/wrangler-dist/cli.js
+++ b/node_modules/wrangler/wrangler-dist/cli.js
@@ -121579,7 +121579,7 @@ async function guessWorkerFormat(entryFile, entryWorkingDirectory, hint, tsconfi
     absWorkingDir: entryWorkingDirectory,
     metafile: true,
     bundle: false,
-    format: "esm",
+    format: hint === "service-worker" ? "cjs" : "esm",
     target: "es2020",
     write: false,
     loader: {
...
```

- Now add the following script in `package.json`:

### Part 2

```json
"scripts": {
  "postinstall": "patch-package"
  ...
}
```

This will ensure that `wrangler` is always patched correctly after each `npm install`.

### References

- [GitHub wrangler issue](https://github.com/cloudflare/workers-sdk/issues/1668)
- [GitHub wrangler pull request](https://github.com/cloudflare/workers-sdk/pull/2396)
