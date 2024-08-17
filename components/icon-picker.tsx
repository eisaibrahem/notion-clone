import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
interface IconPickerProps {
  onIconChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

export function IconPicker({
  onIconChange,
  children,
  asChild = false,
}: IconPickerProps) {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;
  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };
  const theme = themeMap[currentTheme];

  return (
    <>
      <Popover>
        <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <EmojiPicker
            height={350}
            theme={theme}
            onEmojiClick={(data) => onIconChange(data.emoji)}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
