import { createBackendPlugin, coreServices } from '@backstage/backend-plugin-api';
import {createRouter} from './router';
import { RequestsStore } from './database/RequestStore';


export const productionRequestsPlugin = createBackendPlugin({
  pluginId: 'production-requests',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        database: coreServices.database,
      },
      async init({ httpRouter, logger, database }) {
        const store = await RequestsStore.create(database);
        httpRouter.use(await createRouter({ logger, store }));
        // learning shortcut — open routes until we wire real identity later
        httpRouter.addAuthPolicy({ path: '/health', allow: 'unauthenticated' });
        httpRouter.addAuthPolicy({ path: '/requests', allow: 'unauthenticated' });
        httpRouter.addAuthPolicy({ path: '/requests/:id/transition', allow: 'unauthenticated' });
        httpRouter.addAuthPolicy({ path: '/requests/:id/events', allow: 'unauthenticated' });

      },
    });
  },
});
export default productionRequestsPlugin;