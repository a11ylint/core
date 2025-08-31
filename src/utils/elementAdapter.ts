export type NormalizedHeading = {
  tagName?: string;
  role?: string | null;
  ariaLevel?: string | null;
  textContent?: string | null;
  outerHTML?: string;
  index?: number;
  // keep original for possible reporting if needed
  original?: unknown;
};

export const isDomElement = (el: unknown): el is HTMLElement => {
  // Guard against environments where HTMLElement is not defined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctor = (globalThis as any).HTMLElement;
  return typeof ctor !== 'undefined' && el instanceof ctor;
};

export function toNormalizedHeading(el: unknown, fallbackIndex = 0): NormalizedHeading {
  if (isDomElement(el)) {
    const dom = el as HTMLElement & { index?: number };
    return {
      tagName: dom.tagName,
      role: dom.getAttribute('role'),
      ariaLevel: dom.getAttribute('aria-level'),
      textContent: dom.textContent ?? null,
      outerHTML: (dom as HTMLElement & { outerHTML?: string }).outerHTML ?? String(dom),
      index: typeof dom.index === 'number' ? dom.index : fallbackIndex,
      original: dom,
    };
  }

  // virtual element fallback
  const v = el as Record<string, unknown> | undefined;
  return {
    tagName: v?.tagName as string | undefined,
    role: (v?.role as string) ?? null,
    ariaLevel: (v?.ariaLevel as string) ?? null,
    textContent: (v?.textContent as string) ?? null,
    outerHTML: (v?.outerHTML as string) ?? String(v),
    index: typeof v?.index === 'number' ? (v!.index as number) : fallbackIndex,
    original: el,
  };
}
