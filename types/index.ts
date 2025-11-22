export interface CatFact {
  fact: string;
  length: number;
}

export interface Breed {
  breed: string;
  country: string;
  origin: string;
  coat: string;
  pattern: string;
}

export interface BreedResponse {
  current_page: number;
  data: Breed[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface HybridBreed {
  id: string;
  name: string;
  parentA: Breed;
  parentB: Breed;
  coat: string;
  pattern: string;
  origin: string;
  createdAt: number;
}

export interface FactAction {
  id: string;
  type: 'joke' | 'summary' | 'emoji' | 'dramatic';
  originalFact: string;
  result: string;
}
