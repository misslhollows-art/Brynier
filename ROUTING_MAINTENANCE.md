# Routing Maintenance (TanStack Router)

`src/routeTree.gen.ts` is generated code.

Best practice:
- Do not manually edit `src/routeTree.gen.ts`.
- Add/remove routes by creating/removing files under `src/routes/`.
- Run `npm run dev` or `npm run build` to regenerate `src/routeTree.gen.ts` via the Vite TanStack Router plugin.

If you ever see a route missing in `routeTree.gen.ts`, the fix is to regenerate (not to hand-edit the generated file).

