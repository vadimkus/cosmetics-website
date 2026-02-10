export interface Partner {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  phone?: string;
  website?: string;
  directions?: string;
  logo: string;
  theme: 'emerald' | 'pink' | 'blue' | 'purple';
  certificateUrl?: string;
}
