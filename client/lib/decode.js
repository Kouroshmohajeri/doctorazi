import API from "@/app/api/server";

const decoder = async (encryptedToken) => {
  const verified = await API.post("/verify-token", {
    encryptedToken: encryptedToken,
  });
  try {
    return verified;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
export default decoder;

export const serverSideDecoder = async (encryptedToken) => {
  let code;
  try {
    const response = await fetch(`https://doctorazi.com/api/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encryptedToken: encryptedToken }),
    });
    if (!response.ok) {
      const errorBody = await response.json(); // Parsing the JSON body of the response
      code = errorBody.code;
      throw new Error(errorBody.message);
    }
    return await response.json();
  } catch (error) {
    console.error("Error decoding token:", error);
    return code;
  }
};
