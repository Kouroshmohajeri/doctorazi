import RoleRepository from '../repository/roleRepository.js'; // Adjust the path as necessary

class RoleController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const role = await RoleRepository.createRole(name);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const roles = await RoleRepository.getAllRoles();
      res.json(roles);
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { role_id } = req.params;
      const role = await RoleRepository.getRoleById(role_id);
      if (role) {
        res.json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { role_id } = req.params;
      const { name } = req.body;
      const updatedRole = await RoleRepository.updateRole(role_id, name);
      if (updatedRole) {
        res.json(updatedRole);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { role_id } = req.params;
      await RoleRepository.deleteRole(role_id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new RoleController();
