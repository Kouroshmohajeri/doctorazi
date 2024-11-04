import React, { useEffect, useState } from "react";
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from "@/lib/actions/users/actions";
import { getAllRoles } from "@/lib/actions/roles/actions";
import { Snackbar, Alert } from "@mui/material";
import MuiSearchBar from "@/components/MuiSearchBar/MuiSearchBar";
import HireTable from "@/components/HireTable/HireTable";
import MyModal from "@/components/MyModal/MyModal";
import { createTranslator } from "@/lib/actions/translator/actions";
import { addNewDoctor } from "@/lib/actions/doctors/actions";
import { addAuthor } from "@/lib/actions/authors/actions";

const HirePanel = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [allRoles, setAllRoles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await getAllUsers();
      const fetchedRoles = await getAllRoles();
      setUsers(fetchedUsers);
      setAllRoles(fetchedRoles);
    };
    fetchData();
  }, [refresh]);

  const refreshUsersList = async () => {
    const updatedUsers = await getAllUsers();
    setUsers(updatedUsers);
  };

  const handlePromote = (user) => {
    setCurrentUser(user);
    setModalType("promote");
    setOpenModal(true);
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setModalType("delete");
    setOpenModal(true);
  };

  const confirmPromote = async (roleId) => {
    try {
      await updateUser(currentUser.user_id, { user_type: roleId });

      switch (roleId) {
        case 2:
          await addNewDoctor(currentUser.user_id);
          break;
        case 3:
          await addAuthor(currentUser.user_id, "false");
          break;
        case 4:
          await addAuthor(currentUser.user_id, "true");
          break;
        case 5:
          await createTranslator(currentUser.user_id);
          break;
        default:
          throw new Error("Invalid role ID");
      }

      setSnackbar({
        open: true,
        message: "User promoted successfully!",
        severity: "success",
      });
      refreshUsersList();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error promoting user.",
        severity: "error",
      });
    } finally {
      handleCloseModal();
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(currentUser.user_id);
      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
      refreshUsersList();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting user.",
        severity: "error",
      });
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalType("");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredUsers = users
    .map((user) => ({
      ...user,
      roleName:
        allRoles.find((role) => role.role_id === user.user_type)?.name ||
        "Unknown Role",
    }))
    .filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <MuiSearchBar onChange={(e) => setSearchTerm(e.target.value)} />
      <HireTable
        users={filteredUsers}
        onPromote={handlePromote}
        onDelete={handleDelete}
      />
      <MyModal
        open={openModal}
        onClose={handleCloseModal}
        title={
          modalType === "promote" ? "Change User Role" : "Confirm Deletion"
        }
        description={
          modalType === "promote"
            ? "Please select a new role for the user."
            : "Are you sure you want to delete this user?"
        }
        onConfirm={
          modalType === "promote"
            ? (selectedRoleId) => confirmPromote(selectedRoleId)
            : confirmDelete
        }
        roles={
          modalType === "promote"
            ? allRoles.filter((role) => role.role_id !== currentUser.user_type)
            : []
        }
        currentUserRole={currentUser.user_type}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default HirePanel;
