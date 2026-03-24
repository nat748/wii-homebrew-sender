export interface OSCApp {
  slug: string;
  name: string;
  author: string;
  category: string;
  description: {
    short: string;
    long: string;
  };
  version: string;
  release_date: number;
  package_type: 'dol' | 'thm';
  file_size: {
    binary: number;
    icon: number;
    zip_compressed: number;
    zip_uncompressed: number;
  };
  peripherals: string[];
  supported_platforms: string[];
  url: {
    icon: string;
    zip: string;
  };
  flags: string[];
}

export type Category = 'all' | 'games' | 'emulators' | 'utilities' | 'demos' | 'media';

export const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Games', value: 'games' },
  { label: 'Emulators', value: 'emulators' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Demos', value: 'demos' },
  { label: 'Media', value: 'media' },
];
