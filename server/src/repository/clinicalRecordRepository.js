import ClinicalRecord from '../models/ClinicalRecord.js';

class ClinicalRecordRepository {
  async create(clinicalRecordData) {
    try {
      return await ClinicalRecord.create(clinicalRecordData);
    } catch (error) {
      throw new Error('Error creating clinical record');
    }
  }

  async update(clinicalRecordId, clinicalRecordData) {
    try {
      const clinicalRecord = await ClinicalRecord.findByPk(clinicalRecordId);
      if (!clinicalRecord) {
        throw new Error('Clinical record not found');
      }
      return await clinicalRecord.update(clinicalRecordData);
    } catch (error) {
      throw new Error('Error updating clinical record');
    }
  }

  async delete(clinicalRecordId) {
    try {
      const clinicalRecord = await ClinicalRecord.findByPk(clinicalRecordId);
      if (!clinicalRecord) {
        throw new Error('Clinical record not found');
      }
      await clinicalRecord.destroy();
    } catch (error) {
      throw new Error('Error deleting clinical record');
    }
  }

  async findById(clinicalRecordId) {
    try {
      return await ClinicalRecord.findByPk(clinicalRecordId);
    } catch (error) {
      throw new Error('Error finding clinical record');
    }
  }

  async findAll() {
    try {
      return await ClinicalRecord.findAll();
    } catch (error) {
      throw new Error('Error finding all clinical records');
    }
  }
}

export default new ClinicalRecordRepository();
