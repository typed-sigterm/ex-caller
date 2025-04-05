import type { Callback } from 'mixpanel-browser';
import mp from 'mixpanel-browser';
import { __APP__, getBuildMeta, isPortable } from '@/utils/app';

export type TrackEvent =
  | 'Roll Call'
  | 'Auto Update Confirmed'
  | 'Auto Update Dismissed'
  | 'Manual Update'
;

const clientType = __APP__ ? 'app' : 'web';
type MixpanelResponse = Parameters<Callback>[0];

export async function track(event: TrackEvent, prop?: Record<string, unknown>) {
  const portable = clientType === 'app' ? await isPortable() : undefined;
  return new Promise<MixpanelResponse>((resolve) => {
    mp.track?.(event, {
      version: getBuildMeta().commit,
      client_type: __APP__ ? 'app' : 'web',
      portable,
      ...prop,
    }, resolve);
  });
}
