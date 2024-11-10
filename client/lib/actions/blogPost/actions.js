import API from "@/app/api/server";
import { notFound } from "next/navigation";

export const getAllBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/getAll");
    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const addTranslationToBlogPost = async (postId, translationData) => {
  try {
    const response = await API.put(
      `/blogPost/addTranslation/${postId}`,
      translationData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding translation to blog post:", error);
    return null;
  }
};

export const getBlogPostByPostId = async (postId) => {
  try {
    const response = await API.get(`/blogPost/getByPostId/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog post by postId:", error);
    return notFound();
  }
};

export const deleteFolder = async (authorId, postId) => {
  try {
    const response = await API.post("/blogPost/deleteFolder", {
      authorId,
      postId,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting folder:", error.message);
    throw error;
  }
};

export const getBlogPostByAuthorId = async (authorId) => {
  try {
    const response = await API.get(`/blogPost/author/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog post by authorId:", error);
    return null;
  }
};

export const getEditedBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/edited");
    return response.data;
  } catch (error) {
    console.error("Error fetching edited blog posts:", error);
    return [];
  }
};

export const getRejectedBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/isRejected");
    return response.data;
  } catch (error) {
    console.error("Error fetching rejected blog posts:", error);
    return [];
  }
};

export const getEditedBlogPostsByAuthorId = async (authorId) => {
  try {
    const response = await API.get(`/blogPost/editedByAuthor/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching edited blog posts by authorId:", error);
    return [];
  }
};

export const getRejectedBlogPostsByAuthorId = async (authorId) => {
  try {
    const response = await API.get(`/blogPost/rejectedByAuthor/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rejected blog posts by authorId:", error);
    return [];
  }
};

export const getTranslatedBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/translated");
    return response.data;
  } catch (error) {
    console.error("Error fetching translated blog posts:", error);
    return [];
  }
};

export const getNotTranslatedBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/notTranslated");
    return response.data;
  } catch (error) {
    console.error("Error fetching not translated blog posts:", error);
    return [];
  }
};

export const getTranslatedBlogPostsByTranslatorId = async (translatorId) => {
  try {
    const response = await API.get(
      `/blogPost/translatedByTranslatorId/${translatorId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching translated blog posts by translatorId:",
      error
    );
    return [];
  }
};

export const getNotTranslatedBlogPostsByAuthorId = async (authorId) => {
  try {
    const response = await API.get(
      `/blogPost/notTranslatedByAuthor/${authorId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching not translated blog posts by authorId:",
      error
    );
    return [];
  }
};

export const deleteBlogPost = async (postId) => {
  try {
    const response = await API.delete(`/blogPost/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return null;
  }
};

export const updateBlogPost = async (postId, newData) => {
  try {
    const response = await API.put(`/blogPost/${postId}`, newData);
    return response.data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    return null;
  }
};

export const getLastFourBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/lastFourPosts");
    return response.data;
  } catch (error) {
    console.error("Error fetching last four blog posts:", error);
    return [];
  }
};

export const getRandomTwoBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/randomTwoPosts");
    return response.data;
  } catch (error) {
    console.error("Error fetching random two blog posts:", error);
    return [];
  }
};

export const addBlogPost = async (postData) => {
  try {
    const response = await API.post("/blogPost/addBlog", postData);
    return response.data;
  } catch (error) {
    console.error("Error adding new blog post:", error);
    return null;
  }
};
export const uploadImage = async (file, authorId, postId) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("authorId", authorId);
    formData.append("postId", postId);

    const response = await API.post("/blogPost/saveImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};

export const deleteImage = async (authorId, postId, imageName) => {
  console.log(authorId, postId, imageName);
  try {
    const response = await API.post("/blogPost/deleteImage", {
      authorId,
      postId,
      imageName,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error.message);
    throw error;
  }
};

export const getNotRejectedBlogPosts = async () => {
  try {
    const response = await API.get("/blogPost/notRejected");
    return response.data;
  } catch (error) {
    console.error("Error fetching not rejected blog posts:", error);
    return [];
  }
};

export const updateRejectStatus = async (postId, isRejected, headId) => {
  try {
    const response = await API.put(`/blogPost/updateRejectStatus/${postId}`, {
      isRejected,
      headId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating reject status:", error);
    return null;
  }
};
