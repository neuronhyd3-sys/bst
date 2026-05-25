import React from 'react';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@material-ui/core';

const TestServiceDashboard = () => {
  const { entity } = useEntity();

  const isTestService =
    entity.kind.toLowerCase() === 'component' &&
    entity.metadata.name === 'test-service';

  if (!isTestService) {
    return (
      <Box p={3}>
        <Typography variant="h6">No custom dashboard configured</Typography>
        <Typography variant="body2">
          This custom page is currently configured only for test-service.
        </Typography>
      </Box>
    );
  }

  const tags = entity.metadata.tags ?? [];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {entity.metadata.name}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {entity.metadata.description ?? 'No description available'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Service Details</Typography>
              <Typography variant="body2">
                Owner: {String(entity.spec?.owner ?? 'unknown')}
              </Typography>
              <Typography variant="body2">
                System: {String(entity.spec?.system ?? 'unknown')}
              </Typography>
              <Typography variant="body2">
                Type: {String(entity.spec?.type ?? 'unknown')}
              </Typography>
              <Typography variant="body2">
                Lifecycle: {String(entity.spec?.lifecycle ?? 'unknown')}
              </Typography>

              <Box mt={2}>
                {tags.map(tag => (
                  <Chip key={tag} label={tag} style={{ marginRight: 8 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">CI/CD</Typography>
              <Typography variant="body2">
                Jenkins job:{' '}
                {entity.metadata.annotations?.['jenkins.io/job-full-name'] ??
                  'not configured'}
              </Typography>
              <Typography variant="body2">
                This page is where we can later embed Jenkins build status.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const testServiceDashboardContent = EntityContentBlueprint.make({
  name: 'test-service-dashboard',
  params: {
    path: '/test-dashboard',
    title: 'Test Dashboard',
    filter: entity =>
      entity.kind.toLowerCase() === 'component' &&
      entity.metadata.name === 'test-service',
    loader: async () => <TestServiceDashboard />,
  },
});

export const catalogModule = createFrontendModule({
  pluginId: 'catalog',
  extensions: [testServiceDashboardContent],
});