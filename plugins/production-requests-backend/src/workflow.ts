export type Status =
  | 'pending_manager_approval' | 'pending_staging_ci' | 'pending_staging_cd'
  | 'pending_staging_signoff' | 'pending_prod_ci' | 'pending_prod_cd'
  | 'completed' | 'rejected';

export type Action =
  | 'APPROVE' | 'REJECT' | 'RUN_STAGING_CI' | 'RUN_STAGING_CD'
  | 'GIVE_SIGNOFF' | 'RUN_PROD_CI' | 'RUN_PROD_CD';

type Transition = { from: Status; to: Status; group: string };

export const TRANSITIONS: Record<Action, Transition> = {
  APPROVE:        { from: 'pending_manager_approval', to: 'pending_staging_ci',      group: 'manager-approvers' },
  REJECT:         { from: 'pending_manager_approval', to: 'rejected',                group: 'manager-approvers' },
  RUN_STAGING_CI: { from: 'pending_staging_ci',       to: 'pending_staging_cd',      group: 'mlops-team' },
  RUN_STAGING_CD: { from: 'pending_staging_cd',       to: 'pending_staging_signoff', group: 'mlops-team' },
  GIVE_SIGNOFF:   { from: 'pending_staging_signoff',  to: 'pending_prod_ci',         group: 'qa-signoff-team' },
  RUN_PROD_CI:    { from: 'pending_prod_ci',          to: 'pending_prod_cd',         group: 'mlops-team' },
  RUN_PROD_CD:    { from: 'pending_prod_cd',          to: 'completed',               group: 'mlops-team' },
};

export function checkTransition(action: Action, current: Status, actorGroup: string):
  | { ok: true; to: Status }
  | { ok: false; reason: string } {
  const t = TRANSITIONS[action];
  if (!t) return { ok: false, reason: `Unknown action ${action}` };
  if (t.from !== current) return { ok: false, reason: `Cannot ${action} from status ${current}` };
  if (t.group !== actorGroup) return { ok: false, reason: `Only ${t.group} may ${action}` };
  return { ok: true, to: t.to };
}