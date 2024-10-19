import API from "@/app/api/server";

// Action to fetch all comments
export const getAllComments = async () => {
  try {
    const response = await API.get("/comments/getAllComments");
    return response.data; 
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; 
  }
}

// Action to create a new comment
export const createComment = async (commentData) => {
  try {
    const response = await API.post("/comments/new", commentData);
    return response.data; 
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}

// Action to update an existing comment
export const updateComment = async (commentId, commentData) => {
  try {
    const response = await API.put(`/comments/updateComment/${commentId}`, commentData);
    return response.data; 
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment");
  }
}

// Action to delete a comment
export const deleteComment = async (commentId) => {
  try {
    await API.delete(`/comments/deleteComment/${commentId}`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
}

// Action to fetch comments by post_id and expressionId
export const getCommentsByPostAndExpression = async (postId, expressionId) => {
  try {
    const response = await API.get(`/comments/getCommentsByPostAndExpression`, {
      params: { post_id: postId, expressionId: expressionId }
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; 
  }
}