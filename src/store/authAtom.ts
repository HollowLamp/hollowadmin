import { atom } from "jotai";

export const isAuthenticatedAtom = atom(false);
export const tokenAtom = atom<string | null>(null);
