export function computeSidebarAutoCollapse(params: {
  wasAuto: boolean;
  isAuto: boolean;
  collapsed: boolean;
  wasAutoCollapsed: boolean | null;
}): { collapsed: boolean; wasAutoCollapsed: boolean | null } {
  const { wasAuto, isAuto, collapsed, wasAutoCollapsed } = params;
  if (!wasAuto && isAuto) {
    if (!collapsed) {
      return { collapsed: true, wasAutoCollapsed: true };
    }
    return { collapsed: true, wasAutoCollapsed: false };
  }
  if (wasAuto && !isAuto) {
    if (wasAutoCollapsed) {
      return { collapsed: false, wasAutoCollapsed: null };
    }
    return { collapsed, wasAutoCollapsed: null };
  }
  return { collapsed, wasAutoCollapsed };
}
