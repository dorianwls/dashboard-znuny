import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ThemePreference = "light" | "dark" | "system";

// Cicla entre claro, oscuro y el tema del sistema.
const options: Record<
  ThemePreference,
  { next: ThemePreference; label: string; icon: typeof Sun }
> = {
  light: { next: "dark", label: "Tema claro", icon: Sun },
  dark: { next: "system", label: "Tema oscuro", icon: Moon },
  system: { next: "light", label: "Tema del sistema", icon: Monitor },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = (theme as ThemePreference | undefined) ?? "system";
  const { next, label, icon: Icon } = options[current] ?? options.system;
  const title = `${label}. Cambiar a ${options[next].label.toLowerCase()}`;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={title}
      title={title}
    >
      <Icon />
    </Button>
  );
}
