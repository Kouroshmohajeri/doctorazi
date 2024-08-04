import blogPostRepository from '../repository/blogPostRepository.js';
import BlogPosts from '../models/BlogPosts.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

const BlogPostController = {
  createBlogPost: async (req, res) => {
    try {
      const {
          authorId,
          title,
          shortDescription,
          content,
          url,
          imageUrl,
          altName,
      } = req.body;

      const newPost = await BlogPosts.create({
          author_id: authorId,
          title: title,
          shortDescription: shortDescription,
          content: content,
          url: url,
          imageUrl: imageUrl,
          altName: altName,
          isRejected: false,
          isTranslated: false,
          isEdited: false,
      });

      res.status(201).json(newPost.post_id);
  } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ error: 'Failed to create blog post' });
  }
  },
  getAll: async (req, res) => {
    try {
      const posts = await blogPostRepository.getAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getOneByPostId: async (req, res) => {
    const postId = req.params.postId;
    try {
      const post = await blogPostRepository.getOneByPostId(postId);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOneByAuthorId: async (req, res) => {
    const authorId = req.params.authorId;
    try {
      const post = await blogPostRepository.getAllByAuthorId(authorId);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEdited: async (req, res) => {
    try {
      const posts = await blogPostRepository.getEdited();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getIsRejected: async (req, res) => {
    try {
      const posts = await blogPostRepository.getIsRejected();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEditedByAuthorId: async (req, res) => {
    const authorId = req.params.authorId;
    try {
      const posts = await blogPostRepository.getEditedByAuthorId(authorId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getRejectedByAuthorId: async (req, res) => {
    const authorId = req.params.authorId;
    try {
      const posts = await blogPostRepository.getRejectedByAuthorId(authorId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTranslated: async (req, res) => {
    try {
      const posts = await blogPostRepository.getTranslated();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getNotTranslated: async (req, res) => {
    try {
      const posts = await blogPostRepository.getNotTranslated();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTranslatedByTranslatorId: async (req, res) => {
    const translatorId = req.params.translatorId;
    try {
      const posts = await blogPostRepository.getTranslatedByTranslatorId(translatorId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getNotTranslatedByAuthorId: async (req, res) => {
    const authorId = req.params.authorId;
    try {
      const posts = await blogPostRepository.getNotTranslatedByAuthorId(authorId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const postId = req.params.postId;
    try {
      const deletedPost = await blogPostRepository.delete(postId);
      res.json(deletedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const postId = req.params.postId;
    const newData = req.body;
    console.log(newData)
    try {
      const updatedPost = await blogPostRepository.update(postId, newData);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  uploadImage : async (req, res) => {
    try {
        const file = req.file;
        const authorId = req.body.authorId;
        const postId = req.body.postId;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Define the directory where you want to save the file
        const uploadDir = path.join(__dirname, `../public/blogs/${authorId}/${postId}`);

        // Check if the author's directory exists, if not, create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Move the uploaded file to the blogs/authorId/postId directory
        fs.renameSync(file.path, path.join(uploadDir, file.originalname));

        return res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  },
  deleteImage : async (req, res) => {
    try {
        const { authorId, postId, imageName } = req.body;

        if (!authorId || !postId || !imageName) {
            return res.status(400).json({ message: 'Missing parameters' });
        }

        // Define the path to the image file
        const imagePath = path.join(__dirname, `../public/blogs/${authorId}/${postId}/${imageName}`);

        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the file
        fs.unlinkSync(imagePath);

        return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  deleteFolder: async (req, res) => {
    try {
      const { authorId, postId } = req.body;

      if (!authorId || !postId) {
        return res.status(400).json({ message: 'Missing parameters' });
      }

      const folderPath = path.join(__dirname, `../public/blogs/${authorId}/${postId}`);

      // Check if the folder exists
      if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ message: 'Folder not found' });
      }

      // Delete the folder and its contents
      fs.rmSync(folderPath, { recursive: true, force: true });

      return res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
      console.error('Error deleting folder:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  getLastFourPosts: async (req, res) => {
    try {
      const posts = await blogPostRepository.getLastFourPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addTranslation: async (req, res) => {
    const postId = req.params.postId;
    const { translatedTitle, translatedShortDescription, translatedContent, translatorId, isTranslated } = req.body;
    try {
      const updatedPost = await blogPostRepository.addTranslation(postId, translatedTitle, translatedShortDescription, translatedContent, translatorId, isTranslated);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  checkUrlExists: async (req, res) => {
    const { url } = req.body;
    try {
      const post = await blogPostRepository.getByUrl(url);
      if (post) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getRandomTwoPosts: async (req, res) => {
    try {
      const posts = await blogPostRepository.getRandomTwoPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllNotRejected: async (req, res) => {
    try {
      const posts = await blogPostRepository.getAllNotRejected();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateRejectStatus: async (req, res) => {
    const postId = req.params.postId;
    const { isRejected, headId } = req.body;
    try {
      const updatedPost = await blogPostRepository.updateRejectStatus(postId, isRejected, headId);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default BlogPostController;
