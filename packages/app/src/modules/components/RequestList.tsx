import React from 'react';
import { Typography } from '@mui/material';
import { ProductionRequest } from '../interfaces';
import { RequestListItem } from './RequestListItem';

export const RequestList = ({
  requests, canApprove, busy, onApprove, onReject,
}: {
  requests: ProductionRequest[];
  canApprove: boolean;
  busy: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) => {
  if (requests.length === 0) {
    return <Typography color="textSecondary">No requests yet.</Typography>;
  }
  return (
    <>
      {requests.map(req => (
        <RequestListItem
          key={req.id} request={req} canApprove={canApprove} busy={busy}
          onApprove={onApprove} onReject={onReject}
        />
      ))}
    </>
  );
};