import API from "@/app/api/server";

export const getAllAuthors = async () => {
  try {
    const response = await API.get("/authors/getAll");
    return response.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
};

export const getAuthorByUserId = async (userId) => {
  try {
    const response = await API.get(`/authors/getByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching author by user ID:", error);
    return null;
  }
};

export const getAuthorByAuthorId = async (authorId) => {
  try {
    const response = await API.get(`/authors/getByAuthorId/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching author by author ID:", error);
    return null;
  }
};

export const getBlogListByUserId = async (userId) => {
  try {
    const response = await API.get(`/authors/getBlogListByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog list by user ID:", error);
    return null;
  }
};

export const addAuthor = async ({ authorData }) => {
  try {
    console.log(authorData);
    const response = await API.post("/authors/add", authorData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error adding author:", error);
    throw new Error("Failed to add author");
  }
};

export const updateAuthor = async (authorId, authorData) => {
  try {
    const response = await API.put(`/authors/${authorId}`, authorData);
    return response.data;
  } catch (error) {
    console.error("Error updating author:", error);
    throw new Error("Failed to update author");
  }
};

export const deleteAuthor = async (authorId) => {
  try {
    const response = await API.delete(`/authors/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting author:", error);
    throw new Error("Failed to delete author");
  }
};
