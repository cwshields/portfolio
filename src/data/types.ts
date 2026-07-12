export interface ShowcaseData {
  link: {
    url: string;
    img: string;
    alt: string;
  };
  name: string;
  description: string[];
  github: {
    url?: string;
  };
  subheader: string[];
  features: string[][];
  footer?: boolean;
}
