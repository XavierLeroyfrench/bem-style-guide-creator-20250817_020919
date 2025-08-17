const roleManagement = (() => {
    const userRoles = new Map();

    const assignRole = (userId, role) => {
        if (!userId || !role) {
            throw new Error('User ID and role are required');
        }
        if (!userRoles.has(userId)) {
            userRoles.set(userId, new Set());
        }
        userRoles.get(userId).add(role);
    };

    const removeRole = (userId, role) => {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!role) {
            throw new Error('Role is required');
        }
        if (userRoles.has(userId) && userRoles.get(userId).has(role)) {
            userRoles.get(userId).delete(role);
            if (userRoles.get(userId).size === 0) {
                userRoles.delete(userId);
            }
        } else {
            throw new Error('Role does not exist for this user');
        }
    };

    const getUserRoles = (userId) => {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return userRoles.has(userId) ? Array.from(userRoles.get(userId)) : [];
    };

    return {
        assignRole,
        removeRole,
        getUserRoles
    };
})();

module.exports = roleManagement;