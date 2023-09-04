const { userModel } = require('../models/user.model');
async function getUserRoleFromDatabase(userId) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            console.error('Usuario no encontrado');
            return 'user'; // Si el usuario no se encuentra, asume un rol predeterminado 'user'
        }
    
        return user.rol;
    } catch (error) {
        console.error('Error al obtener el rol del usuario desde la base de datos:', error);
        return 'user'; // En caso de error, asume un rol predeterminado 'user'
    }
}

module.exports = {
    getUserRoleFromDatabase,
};
