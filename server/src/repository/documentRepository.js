import Document from '../models/Document.js';

class documentRepository {
    static async createDocument(documentData) {
        try {
            return await Document.create(documentData);
        } catch (error) {
            console.error("Error creating document:", error);
            throw error;
        }
    }

    static async findDocumentById(documentId) {
        try {
            return await Document.findByPk(documentId);
        } catch (error) {
            console.error("Error finding document by ID:", error);
            throw error;
        }
    }

    static async findDocumentsByUserId(userId) {
        try {
            return await Document.findAll({ where: { userId } });
        } catch (error) {
            console.error("Error finding documents by user ID:", error);
            throw error;
        }
    }

    static async updateDocument(documentId, updates) {
        try {
            const [updated] = await Document.update(updates, { where: { documentId: documentId } });
            return updated; // Number of affected rows
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
        }
    }

    static async deleteDocumentById(documentId) {
        try {
            return await Document.destroy({ where: { id: documentId } });
        } catch (error) {
            console.error("Error deleting document:", error);
            throw error;
        }
    }
}

export default documentRepository;
