import React from "react";
import { create } from "zustand";

type SearchStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

const UseSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onToggle: () => set({ isOpen: !get().isOpen }),
}));

export default UseSearch;
