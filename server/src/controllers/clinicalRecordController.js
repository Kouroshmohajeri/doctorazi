import ClinicalRecordRepository from '../repository/clinicalRecordRepository.js';

class ClinicalRecordController {
  async createClinicalRecord(req, res) {
    try {
      const clinicalRecord = await ClinicalRecordRepository.create(req.body);
      res.status(201).json(clinicalRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateClinicalRecord(req, res) {
    try {
      const { id } = req.params;
      const clinicalRecord = await ClinicalRecordRepository.update(id, req.body);
      res.json(clinicalRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteClinicalRecord(req, res) {
    try {
      const { id } = req.params;
      await ClinicalRecordRepository.delete(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClinicalRecord(req, res) {
    try {
      const { id } = req.params;
      const clinicalRecord = await ClinicalRecordRepository.findById(id);
      if (!clinicalRecord) {
        return res.status(404).json({ error: 'Clinical record not found' });
      }
      res.json(clinicalRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllClinicalRecords(req, res) {
    try {
      const clinicalRecords = await ClinicalRecordRepository.findAll();
      res.json(clinicalRecords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ClinicalRecordController;
