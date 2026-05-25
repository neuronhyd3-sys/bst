import React from 'react';
import { Chip } from '@mui/material';

type MuiColor = 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const STATUS_META: Record<string, { label: string; color: MuiColor }> = {
  pending_manager_approval: { label: 'Pending approval', color: 'warning' },
  pending_staging_ci:       { label: 'Staging CI',       color: 'info' },
  pending_staging_cd:       { label: 'Staging CD',       color: 'info' },
  pending_staging_signoff:  { label: 'Staging sign-off', color: 'secondary' },
  pending_prod_ci:          { label: 'Prod CI',          color: 'info' },
  pending_prod_cd:          { label: 'Prod CD',          color: 'info' },
  completed:                { label: 'Completed',        color: 'success' },
  rejected:                 { label: 'Rejected',         color: 'error' },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status] ?? { label: status, color: 'default' as MuiColor };
  return <Chip size="small" label={meta.label} color={meta.color} />;
};