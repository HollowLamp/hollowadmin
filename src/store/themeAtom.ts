import { atomWithStorage } from "jotai/utils";
import { ThemeName } from "@/utils/theme/themes";

export const themeAtom = atomWithStorage<ThemeName>("theme", "blue");
