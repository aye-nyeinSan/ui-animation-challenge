export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly blurb: string;
  readonly image: string;
  readonly alt: string;
}

export interface FloatTiming {
  readonly duration: string;
  readonly delay: string;
  readonly reverse?: boolean;
}

export interface MenuProduct extends Product {
  readonly float: FloatTiming;
}
