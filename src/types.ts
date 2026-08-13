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
  sizeMm?: number;
  widthMm?: number;
  heightMm?: number;
  style?: string;
  finish?: string;
  colour?: string;
  /** Legacy metadata retained while the generated catalog is migrated. Ignored by V1. */
  riveArtboardRef?: string;
  colourBindable: boolean;
  /** Full-size transparent PNG aligned to the shared puppet canvas. */
  previewAssetPath?: string;
  /** Legacy fields retained until generated data and archived sources are cleaned. */
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
