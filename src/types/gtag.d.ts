interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

interface Window {
  gtag: (
    command: "config" | "event" | "js" | "set",
    targetIdOrAction: string | Date,
    params?: GtagEventParams | Record<string, unknown>
  ) => void;
  dataLayer: Array<unknown>;
}
