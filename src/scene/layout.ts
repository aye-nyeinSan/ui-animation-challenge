import { MOTION } from '../motion';

export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface PlatePose {
  readonly x: number;
  readonly y: number;
  readonly width: number;
}

export interface AdPose {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly scale: number;
}

export function computePlatePose(viewport: Size, image: Size): PlatePose {
  const coverWidth = viewport.width * 1.02;
  const coverHeight = viewport.height * 1.02;
  const scale = Math.max(coverWidth / image.width, coverHeight / image.height);
  const renderedWidth = image.width * scale;
  const renderedHeight = image.height * scale;
  const originX = -0.01 * viewport.width + (coverWidth - renderedWidth) * 0.5;
  const originY = -0.01 * viewport.height + (coverHeight - renderedHeight);

  return {
    x: originX + MOTION.plate.x * renderedWidth,
    y: originY + MOTION.plate.y * renderedHeight,
    width: MOTION.plate.w * renderedWidth,
  };
}

export function computeAdPose(viewport: Size, plateWidth: number): AdPose {
  const ad = MOTION.ad;
  const width = Math.max(
    ad.minW,
    Math.min(viewport.width * ad.vwFrac, viewport.height * ad.vhFrac, ad.maxW),
  );
  return {
    width,
    scale: width / plateWidth,
    x: viewport.width / 2,
    y: viewport.height * ad.centerY,
  };
}

export function menuLead(isMobile: boolean): number {
  const h = MOTION.handoff;
  return isMobile ? h.landAtMobile + h.settleMobile : h.landAt + h.settle;
}

export function computeMenuRun(trackOverflow: number, isMobile: boolean): number {
  const speed = MOTION.menu.speed * (isMobile ? 0.72 : 1);
  return Math.max(1, (trackOverflow * speed) / (1 - menuLead(isMobile)));
}

export function cardOffset(cardCentre: number, trackShift: number, viewportWidth: number): number {
  return Math.max(-1, Math.min(1, (cardCentre - trackShift - viewportWidth / 2) / viewportWidth));
}
