import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/** Responsable del panel. La app no tiene inicio de sesión: es un perfil fijo. */
export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default hover:bg-transparent active:bg-transparent"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            TI
          </span>
          <span className="grid flex-1 text-left text-xs leading-tight">
            <strong className="truncate text-[13px] font-semibold text-sidebar-accent-foreground">
              Jefatura de TI
            </strong>
            <span className="truncate text-muted-foreground">
              DGTI, panel de seguimiento
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
