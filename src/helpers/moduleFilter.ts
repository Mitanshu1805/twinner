import { MenuItemTypes } from '../constants/menu'; // adjust path

export const filterMenuByPermissions = (
    menuItems: MenuItemTypes[],
    permissions: Record<string, string[]>
): MenuItemTypes[] => {
    return menuItems.filter((item) => {
        if (!item.moduleName) return true; // always show items like Dashboard

        const modulePerms = permissions[item.moduleName];
        return modulePerms?.includes('read');
    });
};
