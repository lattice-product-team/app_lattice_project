export interface DetailMetric {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

export interface DetailAction {
  id: string;
  label: string;
  icon: string;
  type: 'primary' | 'secondary' | 'outline';
  onPress: () => void;
}

export interface PremiumDetailModel {
  id: string;
  type: 'event' | 'poi';
  name: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  logoUrl?: string;
  categoryIcon?: string;
  metrics: DetailMetric[];
  actions: DetailAction[];
}
