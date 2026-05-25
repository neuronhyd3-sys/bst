import { LoggerService } from '@backstage/backend-plugin-api';
import { Router } from 'express';
import express from 'express';
import { RequestsStore } from './database/RequestStore';
import { Action, Status, checkTransition } from './workflow';

export async function createRouter(opts: { logger: LoggerService; store: RequestsStore }) {
  const { store } = opts;
  const router = Router();
  router.use(express.json());

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  router.get('/requests', async (req, res) => {
    res.json(await store.list(req.query.apiRef as string | undefined));
  });

  router.post('/requests', async (req, res) => {
    const { apiRef, title, prLink, description, requestedBy } = req.body;
    if (!apiRef || !title || !prLink || !requestedBy) {
      res.status(400).json({ error: 'apiRef, title, prLink, requestedBy are required' });
      return;
    }
    res.status(201).json(await store.insert({ apiRef, title, prLink, description, requestedBy }));
  });

  router.post('/requests/:id/transition', async (req, res) => {
    const { action, actorGroup, actor, comment } = req.body as {
      action: Action; actorGroup: string; actor: string; comment?: string;
    };

    const existing = await store.getById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'request not found' });
      return;
    }

    const result = checkTransition(action, existing.status as Status, actorGroup);
    if (!result.ok) {
      res.status(409).json({ error: result.reason });
      return;
    }

    res.json(await store.applyTransition(existing.id, result.to, {
      actor, action, fromStatus: existing.status, comment,
    }));
  });


  router.get('/requests/:id/events', async (req, res) => {
  const existing = await store.getById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'request not found' });
    return;
  }
  res.json(await store.getEvents(existing.id));
});

  return router;
}