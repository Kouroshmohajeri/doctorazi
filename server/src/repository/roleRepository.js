import Role from '../models/Roles.js'; 

class RoleRepository {
  async createRole(name) {
    return await Role.create({ name });
  }

  async getAllRoles() {
    return await Role.findAll();
  }

  async getRoleById(role_id) {
    return await Role.findByPk(role_id);
  }

  async updateRole(role_id, name) {
    const role = await Role.findByPk(role_id);
    if (role) {
      role.name = name;
      await role.save();
      return role;
    }
    return null;
  }

  async deleteRole(role_id) {
    return await Role.destroy({ where: { role_id } });
  }
}

export default new RoleRepository();
