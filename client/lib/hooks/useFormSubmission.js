import { useContext, useState } from "react";
import decoder from "@/lib/decode";
import { Login } from "../auth/userState";
import { getUserByUsername } from "../actions/users/actions";

export function useFormSubmission(router) {
  const [loading, setLoading] = useState(false);
  const [snackState, setSnackState] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleSubmit = async (values, formType) => {
    setLoading(true);
    try {
      const endpoint = `/users/${formType.toLowerCase()}`;
      const response = await Login(values, endpoint);
      // const response = await API.post(endpoint,values);
      console.log(response);
      const userInfo = await decoder(response.data.encryptedPayload);
      const user = await getUserByUsername(userInfo.data.username);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("calendar", userInfo.data.user_id);
      setLoading(false);
      setSnackState({
        open: true,
        message: response.data.message,
        severity: "success",
      });

      const userRedirects = {
        1: "/dashboard/clients",
        2: "/dashboard/doctor",
        3: "/dashboard/author",
        4: "/dashboard/head-author",
        5: "/dashboard/translator",
        6: "/dashboard/management",
      };

      router.push(userRedirects[user.user_type] || "/");
    } catch (error) {
      setLoading(false);
      setSnackState({
        open: true,
        message: error.response?.data.message || "An unexpected error occurred",
        severity: "error",
      });
    }
  };

  return { loading, snackState, setSnackState, handleSubmit };
}
