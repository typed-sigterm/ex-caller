import type { Callback } from 'mixpanel-browser';
import { __APP__, __GA__, getBuildMeta, isPortable } from '@/utils/app';

export type TrackEvent
  = | 'Roll Call'
    | 'Auto Update Confirmed'
    | 'Auto Update Dismissed'
    | 'Manual Update'
;

const clientType = __APP__ ? 'app' : 'web';
type MixpanelResponse = Parameters<Callback>[0];
let mp: typeof import('mixpanel-browser').default | undefined;

export async function initAnalytics() {
  mp ??= (await import('mixpanel-browser')).default;
  const token = import.meta.env.EXC_MIXPANEL_TOKEN;
  mp.init(token, {
    persistence: 'localStorage',
    track_pageview: __GA__,
  });
  if (!__GA__)
    mp.disable();
}

export async function track(event: TrackEvent, prop?: Record<string, unknown>) {
  const portable = clientType === 'app' ? await isPortable() : undefined;
  mp ??= (await import('mixpanel-browser')).default;
  return new Promise<MixpanelResponse>((resolve) => {
    mp!.track?.(event, {
      version: getBuildMeta().commit,
      client_type: __APP__ ? 'app' : 'web',
      portable,
      ...prop,
    }, resolve);
  });
}
