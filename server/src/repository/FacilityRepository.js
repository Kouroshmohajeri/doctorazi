import Facility from "../models/Facility.js";

class FacilityRepository {
  async addFacility(doctor_id, name, position) {
    try {
      const facility = await Facility.create({ doctor_id, name, position });
      return facility;
    } catch (error) {
      throw new Error("Error creating facility: " + error.message);
    }
  }

  async updateFacility(facility_id, name, position) {
    try {
      const facility = await Facility.findByPk(facility_id);
      if (facility) {
        facility.name = name;
        facility.position = position;
        await facility.save();
        return facility;
      }
      return null;
    } catch (error) {
      throw new Error("Error updating facility: " + error.message);
    }
  }

  async deleteFacility(facility_id) {
    try {
      const deleted = await Facility.destroy({
        where: { facility_id },
      });
      return deleted;
    } catch (error) {
      throw new Error("Error deleting facility: " + error.message);
    }
  }

  async getAllFacilities() {
    try {
      const facilities = await Facility.findAll();
      return facilities;
    } catch (error) {
      throw new Error("Error getting all facilities: " + error.message);
    }
  }

  async getFacilityById(facility_id) {
    try {
      const facility = await Facility.findByPk(facility_id);
      return facility;
    } catch (error) {
      throw new Error("Error getting facility by ID: " + error.message);
    }
  }

  async getByDoctorId(doctorId) {
    try {
      const facilities = await Facility.findAll({
        where: { doctor_id: doctorId },
      });
      return facilities;
    } catch (error) {
      throw new Error(
        "Error getting facilities by doctor ID: " + error.message
      );
    }
  }
}

export default new FacilityRepository();
