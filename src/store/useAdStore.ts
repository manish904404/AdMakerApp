import { create } from 'zustand';

interface AdState {
  images: string[];
  businessName: string;
  offerText: string;
  addImage: (uri: string) => void;
  removeImage: (index: number) => void;
  setBusinessName: (name: string) => void;
  setOfferText: (text: string) => void;
  reset: () => void;
}

export const useAdStore = create<AdState>((set) => ({
  images: [],
  businessName: '',
  offerText: '',
  addImage: (uri) =>
    set((state) => ({
      images: state.images.length < 3 ? [...state.images, uri] : state.images,
    })),
  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
  setBusinessName: (businessName) => set({ businessName }),
  setOfferText: (offerText) => set({ offerText }),
  reset: () => set({ images: [], businessName: '', offerText: '' }),
}));