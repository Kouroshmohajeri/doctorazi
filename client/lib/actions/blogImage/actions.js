import API from "@/app/api/server";

export const uploadBlogImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await API.post('/blogImages/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data; 
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export const deleteBlogImage = async (imageSrc) => {
    try {
        const response = await API.delete('/blogImages/delete', {
            data: { src: imageSrc }
        });
        return response.data; 
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
}
export const checkDuplicateUrl = async (url) => {
    try {
      // Replace spaces with dashes in the URL
      const formattedUrl = url.toLowerCase().replace(/\s+/g, "-");
      // Send the formatted URL in the API request
      const response = await API.post('/blogPost/checkDuplicate', { url: formattedUrl });
      console.log(response);
      const isExist = response.data.exists;
      // Cache the URL in sessionStorage to avoid redundant requests
      sessionStorage.setItem(formattedUrl, JSON.stringify(isExist));
      return isExist;
    } catch (error) {
      console.error("Error checking URL duplication:", error);
      throw error;
    }
  }
  
