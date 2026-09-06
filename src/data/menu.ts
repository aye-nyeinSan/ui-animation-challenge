import type { MenuProduct, Product } from '../types';

import classic from '../assets/menu/classic.webp';
import frozen from '../assets/menu/frozen.webp';
import irl from '../assets/menu/irl.webp';
import jellyfish from '../assets/menu/jellyfish.webp';
import nasty from '../assets/menu/nasty.webp';
import newPatty from '../assets/menu/new.webp';
import pipsqueak from '../assets/menu/pipsqueak.webp';
import pretty from '../assets/menu/pretty.webp';
import withlove from '../assets/menu/withlove.webp';

import bits from '../assets/other/bits.webp';
import cola from '../assets/other/cola.webp';
import fries from '../assets/other/fries.webp';
import kelpshake from '../assets/other/kelpshake.webp';
import sundae from '../assets/other/sundae.webp';

export const MENU: readonly MenuProduct[] = [
  {
    id: 'Classic',
    name: 'Krabby Patty',
    price: 2.0,
    blurb: 'The one that started it all.',
    image: classic,
    alt: 'Classic',
    float: { duration: '5s', delay: '0s' },
  },
  {
    id: 'IRL',
    name: 'IRL',
    price: 2.5,
    blurb: 'Suspiciously photorealistic.',
    image: irl,
    alt: 'IRL',
    float: { duration: '5.7s', delay: '-0.9s', reverse: true },
  },
  {
    id: 'Frozen',
    name: 'Frozen',
    price: 1.5,
    blurb: 'Thaw time not included.',
    image: frozen,
    alt: 'Frozen',
    float: { duration: '6.4s', delay: '-1.8s' },
  },
  {
    id: 'Jellyfish Jelly',
    name: 'Jellyfish Jelly',
    price: 3.0,
    blurb: 'Stings a little. Worth it.',
    image: jellyfish,
    alt: 'Jellyfish Jelly',
    float: { duration: '7.1s', delay: '-2.7s', reverse: true },
  },
  {
    id: 'Nasty',
    name: 'Nasty',
    price: 0.25,
    blurb: 'Found behind the grill. Still sells.',
    image: nasty,
    alt: 'Nasty',
    float: { duration: '5s', delay: '-3.6s' },
  },
  {
    id: 'Pretty',
    name: 'Pretty',
    price: 4.0,
    blurb: 'Nine colours. Zero flavour notes.',
    image: pretty,
    alt: 'Pretty',
    float: { duration: '5.7s', delay: '-4.5s', reverse: true },
  },
  {
    id: 'New',
    name: 'New',
    price: 2.0,
    blurb: 'Reformulated. Nobody asked.',
    image: newPatty,
    alt: 'New',
    float: { duration: '6.4s', delay: '-5.4s' },
  },
  {
    id: 'With Love',
    name: 'With Love',
    price: 2.0,
    blurb: 'Comes with a note. And a bill.',
    image: withlove,
    alt: 'With Love',
    float: { duration: '7.1s', delay: '-6.3s', reverse: true },
  },
  {
    id: 'Pipsqueak',
    name: 'Pipsqueak',
    price: 1.0,
    blurb: 'Smiles back. Please don’t stare.',
    image: pipsqueak,
    alt: 'Pipsqueak',
    float: { duration: '5s', delay: '-7.2s' },
  },
];

export const SIDES: readonly Product[] = [
  {
    id: 'Krabby Sundae',
    name: 'Krabby Sundae',
    price: 2.5,
    blurb: 'Whipped, cherried, gone in four bites.',
    image: sundae,
    alt: 'Krabby Sundae',
  },
  {
    id: 'Krusty Fries',
    name: 'Krusty Fries',
    price: 1.5,
    blurb: 'Golden. Salted. Occasionally seaworthy.',
    image: fries,
    alt: 'Krusty Fries',
  },
  {
    id: 'Kelp Cola',
    name: 'Kelp Cola',
    price: 1.25,
    blurb: 'Fizzes twice as hard down here.',
    image: cola,
    alt: 'Kelp Cola',
  },
  {
    id: 'Coral Bits',
    name: 'Coral Bits',
    price: 2.75,
    blurb: 'Six to a box. Steam included.',
    image: bits,
    alt: 'Coral Bits',
  },
  {
    id: 'Kelp Shake',
    name: 'Kelp Shake',
    price: 3.0,
    blurb: 'Greener than the health inspector.',
    image: kelpshake,
    alt: 'Kelp Shake',
  },
];

export const TAX_RATE = 0.05;
