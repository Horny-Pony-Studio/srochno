'use client';

import { List, ListItem, Radio } from 'konsta/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type ThemePreference } from '@/providers/ThemeProvider';
import { useHaptic } from '@/hooks/useTelegram';

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  {
    value: 'auto',
    label: 'Авто',
    description: 'Відповідно до налаштувань Telegram або системи',
    icon: Monitor,
  },
  {
    value: 'light',
    label: 'Світла',
    description: 'Завжди світла тема',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Темна',
    description: 'Завжди темна тема',
    icon: Moon,
  },
];

export default function ThemeSelector() {
  const { preference, setPreference } = useTheme();
  const { impact } = useHaptic();

  const handleChange = (value: ThemePreference) => {
    impact('light');
    setPreference(value);
  };

  return (
    <List strongIos insetIos>
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <ListItem
            key={option.value}
            label
            title={option.label}
            after={
              <Radio
                component="div"
                value={option.value}
                checked={preference === option.value}
                onChange={() => handleChange(option.value)}
              />
            }
            onClick={() => handleChange(option.value)}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </div>
              </div>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}
