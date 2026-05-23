# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc nx.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY tools ./tools
COPY jest.preset.js jest.config.ts eslint.config.mjs ./
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
RUN pnpm nx run-many --target=build --projects=shell,mfe-explore,mfe-decide,mfe-checkout --configuration=production

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/apps/shell /usr/share/nginx/html/shell
COPY --from=build /app/dist/packages/mfe-explore /usr/share/nginx/html/mfe-explore
COPY --from=build /app/dist/packages/mfe-decide /usr/share/nginx/html/mfe-decide
COPY --from=build /app/dist/packages/mfe-checkout /usr/share/nginx/html/mfe-checkout
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
