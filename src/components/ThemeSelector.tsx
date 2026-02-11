'use client';

import { List, ListItem, Radio } from 'konsta/react';
import { useTheme, type ThemePreference } from '@/providers/ThemeProvider';

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: 'auto', label: 'Авто' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
];

export default function ThemeSelector() {
  const { preference, setPreference } = useTheme();

  return (
    <List strongIos insetIos className={"m-0"}>
      {THEME_OPTIONS.map((option) => (
        <ListItem
          key={option.value}
          label
          title={option.label}
          after={
            <Radio
              component="div"
              value={option.value}
              checked={preference === option.value}
              onChange={() => setPreference(option.value)}
            />
          }
          onClick={() => setPreference(option.value)}
        />
      ))}
    </List>
  );
}
