import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

export interface MediaFlags {
  readonly isMobile: boolean;
  readonly reducedMotion: boolean;
}

function read(): MediaFlags {
  if (typeof window === 'undefined') return { isMobile: false, reducedMotion: false };
  return {
    isMobile: window.matchMedia(MOBILE_QUERY).matches,
    reducedMotion: window.matchMedia(REDUCED_QUERY).matches,
  };
}

export function useMediaFlags(): MediaFlags {
  const [flags, setFlags] = useState<MediaFlags>(read);

  useEffect(() => {
    const queries = [window.matchMedia(MOBILE_QUERY), window.matchMedia(REDUCED_QUERY)];
    const update = () => setFlags(read());
    queries.forEach((q) => q.addEventListener('change', update));
    update();
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);
  return flags;
}
