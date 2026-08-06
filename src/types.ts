export type Category =
  | 'body'
  | 'eyes'
  | 'nose'
  | 'glasses'
  | 'hair'
  | 'outfit'
  | 'shoes'
  | 'accessory';

export type AssetOption = {
  id: string;
  label: string;
  category: Category;
  group?: string;
  price?: number;
  shape?: string;
  size?: string;
  colour?: string;
  riveArtboardRef: string;
  colourBindable: boolean;
  vectorAssetPath?: string;
  textureAssetPath?: string;
  thumbnailPath: string;
  requiredTier?: 'diy' | 'curated' | 'masterworks';
  autoSelect?: boolean;
};

export type SelectionState = Record<Category, AssetOption | null>;

export type StepDefinition = {
  id: Category | 'review';
  shortLabel: string;
  title: string;
  prompt: string;
  icon: string;
};
