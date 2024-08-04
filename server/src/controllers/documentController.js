import DocumentRepository from '../repository/documentRepository.js';
import { validationResult } from 'express-validator';

class DocumentController {
    async createDocument(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const documentData = req.body;
            const document = await DocumentRepository.createDocument(documentData);
            res.status(201).json(document);
        } catch (error) {
            console.error('Error creating document:', error);
            res.status(500).json({ error: 'An error occurred while creating the document' });
        }
    }

    async getDocumentById(req, res) {
        try {
            const { id } = req.params;
            const document = await DocumentRepository.findDocumentById(id);
            if (document) {
                res.json(document);
            } else {
                res.status(404).json({ message: 'Document not found' });
            }
        } catch (error) {
            console.error('Error getting document by ID:', error);
            res.status(500).json({ error: 'An error occurred while fetching the document' });
        }
    }

    async getDocumentsByUserId(req, res) {
        try {
            const { userId } = req.params;
            const documents = await DocumentRepository.findDocumentsByUserId(userId);
            res.json(documents);
        } catch (error) {
            console.error('Error getting documents by user ID:', error);
            res.status(500).json({ error: 'An error occurred while fetching the documents' });
        }
    }

    async updateDocument(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updated = await DocumentRepository.updateDocument(id, updates);
    
            if (updated) { // Check if any rows were updated
                const updatedDocument = await DocumentRepository.findDocumentById(id);
                res.json(updatedDocument);
            } else {
                res.status(404).json({ message: 'Document not found' });
            }
        } catch (error) {
            console.error('Error updating document:', error);
            res.status(500).json({ error: 'An error occurred while updating the document' });
        }
    }
    

    async deleteDocument(req, res) {
        try {
            const { id } = req.params;
            const deleted = await DocumentRepository.deleteDocumentById(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Document not found' });
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({ error: 'An error occurred while deleting the document' });
        }
    }
}

export default DocumentController;
