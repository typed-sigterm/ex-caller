import type { Callback } from 'mixpanel-browser';
import type { UserConfig } from '@/utils/config';
import { __APP__, __GA__, getBuildMeta, isPortable } from '@/utils/app';
import { CONFIG_LOCALSTORAGE_KEY } from '@/utils/config';

export type TrackEvent
  = | 'Roll Call'
    | 'Auto Update Confirmed'
    | 'Auto Update Dismissed'
    | 'Manual Update'
;

const clientType = __APP__ ? 'app' : 'web';
type MixpanelResponse = Parameters<Callback>[0];
let mp: typeof import('mixpanel-browser').default | undefined;

function isAnalyticsEnabled(): boolean {
  try {
    const raw = localStorage.getItem(CONFIG_LOCALSTORAGE_KEY);
    if (!raw)
      return true;
    const config = JSON.parse(raw) as Partial<UserConfig>;
    return config.analytics !== false;
  } catch {
    return true;
  }
}

export async function initAnalytics() {
  mp ??= (await import('mixpanel-browser')).default;
  const token = import.meta.env.EXC_MIXPANEL_TOKEN;
  mp.init(token, {
    persistence: 'localStorage',
    track_pageview: __GA__,
  });
  if (!__GA__ || !isAnalyticsEnabled())
    mp.disable();
}

export async function track(event: TrackEvent, prop?: Record<string, unknown>) {
  if (!isAnalyticsEnabled())
    return;
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
