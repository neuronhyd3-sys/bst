import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { navModule } from './modules/nav';
import { catalogModule } from './modules/catalog';

export default createApp({
  features: [catalogPlugin, navModule, catalogModule],
});