import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { MenuItem } from "@/lib/menu";
import { Link, useRouterState } from "@tanstack/react-router";

export function NavMain({ items }: { items: MenuItem[] }) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const { isMobile, setOpenMobile } = useSidebar();
  const sections = Map.groupBy(items, (item) => item.section);

  return (
    <>
      {Array.from(sections.entries()).map(([menuSection, menuItems]) => (
        <SidebarGroup key={menuSection}>
          <SidebarGroupLabel>{menuSection}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ id, name, route, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath.startsWith(route)}
                    tooltip={name}
                  >
                    <Link
                      to={route}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <Icon />
                      <span>{name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
