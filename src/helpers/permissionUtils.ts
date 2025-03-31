// Function to check if the user has a specific permission
export const hasPermission = (userPermissions: string[], requiredPermission: string) => {
    return userPermissions.includes(requiredPermission);
};
