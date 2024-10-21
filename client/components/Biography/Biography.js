import React, { useState, useEffect, useContext } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { listSpecialities } from "@/lib/actions/speciality/actions";
import { UserDataContext } from "@/context/UserDatasContext";
import Dropzone from "../DropZone/Dropzone";
import {
  addBiography,
  getBiographyByDoctorId,
  updateBiography,
} from "@/lib/actions/biography/actions";
import {
  addFacility,
  deleteFacility,
  getFacilitiesByDoctorId,
  updateFacility,
} from "@/lib/actions/facility/actions";
import PersonAvatar from "../Avatar/PersonAvatar";
import { ClinicalRecordContext } from "@/context/ClinicalRecordContext";
import {
  getProfileImageByFileName,
  getProfileImagesByUserId,
} from "@/lib/actions/profileImage/actions";
import styles from "./Biography.module.css";
import {
  getDoctor,
  getDoctorByClientId,
  updateDoctor,
} from "@/lib/actions/doctors/actions";
import MyModal from "../MyModal/MyModal";

const Biography = () => {
  const [specialities, setSpecialities] = useState([]);
  const [shortDescription, setShortDescription] = useState("");
  const [shortDescriptionTranslated, setShortDescriptionTranslated] =
    useState("");
  const [longDescription, setLongDescription] = useState("");
  const [longDescriptionTranslated, setLongDescriptionTranslated] =
    useState("");
  const [translatedName, setTranslatedName] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [speciality, setSpeciality] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [doctorId, setDoctorId] = useState(0);
  const { users, fetchCookies } = useContext(UserDataContext);
  const { refresh, setRefresh } = useContext(ClinicalRecordContext);
  const [open, setOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [snackBarInfo, setSnackBarInfo] = useState({
    state: "success",
    message: "",
  });

  useEffect(() => {
    fetchCookies();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const doctorData = await getDoctorByClientId(users.id);
        setDoctorId(doctorData.doctorId);
      } catch (error) {
        console.error("Error fetching doctor ID:", error.message);
      }
    };
    fetchDoctorId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (doctorId !== 0) {
          const existingBiography = await getBiographyByDoctorId(doctorId);
          if (existingBiography) {
            setShortDescription(existingBiography.short_description);
            setShortDescriptionTranslated(
              existingBiography.short_description_translated
            );
            setLongDescription(existingBiography.long_description);
            setLongDescriptionTranslated(
              existingBiography.long_description_translated
            );
            setTranslatedName(existingBiography.translatedName);
          }
          const specialityData = await getDoctor(doctorId);
          if (specialityData) {
            setSpeciality(specialityData.speciality_id);
          }
          const existingFacilities = await getFacilitiesByDoctorId(doctorId);
          setFacilities(existingFacilities);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [doctorId, refresh]);

  useEffect(() => {
    async function fetchData() {
      try {
        const allSpecialities = await listSpecialities();
        const specialitiesWithTranslation = allSpecialities.map(
          (speciality) => ({
            id: speciality.speciality_id,
            original: speciality.name,
            translated: speciality.translate,
          })
        );
        setSpecialities(specialitiesWithTranslation);

        const response = await getProfileImagesByUserId(users.id);
        const folders = response.userFolders;
        if (folders && folders.length > 0) {
          const firstFolder = folders[0];
          const imageResponse = await getProfileImageByFileName(firstFolder);
          const records = imageResponse.files;
          if (records && records.length > 0) {
            const firstImageRecord = records[0];
            const imageUrl = `http://doctorazi.com:8443/profileImage/${firstFolder}/${firstImageRecord}`;
            setProfileImage(imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchData();
  }, [users.id, refresh]);

  const handleShortDescriptionChange = (event) => {
    setShortDescription(event.target.value);
  };

  const handleShortDescriptionTranslatedChange = (event) => {
    setShortDescriptionTranslated(event.target.value);
  };

  const handleLongDescriptionChange = (event) => {
    setLongDescription(event.target.value);
  };

  const handleLongDescriptionTranslatedChange = (event) => {
    setLongDescriptionTranslated(event.target.value);
  };

  const handleTranslatedNameChange = (event) => {
    setTranslatedName(event.target.value);
  };

  const handleAddFacility = () => {
    setFacilities([...facilities, { name: "", position: "" }]);
  };

  const handleRemoveFacility = async (index, facility) => {
    if (facility && facility.facility_id) {
      setSelectedFacilityIndex(index);
      setSelectedFacility(facility);
      setShowConfirmationModal(true);
    } else {
      deleteFromList(index);
    }
  };

  const deleteFromList = (index) => {
    const updatedFacilities = [...facilities];
    updatedFacilities.splice(index, 1);
    setFacilities(updatedFacilities);
  };

  const handleConfirmRemoveFacility = async () => {
    if (selectedFacility && selectedFacility.facility_id) {
      await deleteFacility(selectedFacility.facility_id);
    }
    setRefresh(!refresh);
    setShowConfirmationModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const existingBiography = await getBiographyByDoctorId(doctorId);
      // Update or add biography
      if (existingBiography) {
        await updateBiography(
          existingBiography.biography_id,
          shortDescription,
          shortDescriptionTranslated,
          longDescription,
          longDescriptionTranslated,
          translatedName
        );
      } else {
        await addBiography(
          doctorId,
          shortDescription,
          shortDescriptionTranslated,
          longDescription,
          longDescriptionTranslated,
          translatedName
        );
      }

      // Update or add facilities
      for (const facility of facilities) {
        // If facility has an ID, it exists in the database
        if (facility.facility_id) {
          // Facility exists and needs to be updated
          await updateFacility(
            facility.facility_id,
            facility.name,
            facility.position
          );
        } else {
          // Facility is new, so add it
          await addFacility(doctorId, facility.name, facility.position);
        }
      }

      // Update speciality
      await updateDoctor(doctorId, { speciality_id: speciality });

      // Refresh the page and open snackbar
      setOpen(true);
      setSnackBarInfo({
        state: "success",
        message: "Changes made successfully",
      });
      setRefresh(!refresh);
    } catch (error) {
      setOpen(true);
      setSnackBarInfo({ state: "error", message: "Something went wrong!" });
      console.error("Error handling submit:", error.message);
    }
  };

  return (
    <div>
      <h2>Biography</h2>
      <div className={styles.profilepicture}>
        <Dropzone
          folder="profileImage"
          prefix="pi_"
          parent={2}
          id={users.id}
          isProfile={true}
        />
        <PersonAvatar alt="Profile Image" image={profileImage} />
      </div>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <Autocomplete
            id="speciality"
            options={specialities}
            getOptionLabel={(option) =>
              `${option.original} - ${option.translated}`
            }
            onChange={(event, value) => setSpeciality(value ? value.id : null)}
            value={
              speciality !== null
                ? specialities.find((spec) => spec.id === speciality)
                : null
            }
            renderInput={(params) => (
              <TextField {...params} label="Speciality" />
            )}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            id="translated-name"
            label="Full name in farsi"
            placeholder="Enter your full name (Translated)"
            value={translatedName}
            onChange={handleTranslatedNameChange}
            inputProps={{ maxLength: 100 }}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            id="short-description"
            label="Short Description"
            placeholder="Introduce yourself shortly..."
            multiline
            rows={4}
            value={shortDescription}
            onChange={handleShortDescriptionChange}
            inputProps={{ maxLength: 150 }}
            fullWidth
          />
          <FormHelperText>{`${shortDescription.length}/150`}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            id="short-description-translated"
            label="Short Description Translated"
            placeholder="Introduce yourself shortly (Translated)..."
            multiline
            rows={4}
            value={shortDescriptionTranslated}
            onChange={handleShortDescriptionTranslatedChange}
            inputProps={{ maxLength: 150 }}
            fullWidth
          />
          <FormHelperText>{`${shortDescriptionTranslated.length}/150`}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            id="long-description"
            label="Long Description"
            placeholder="Tell us about your personality and your work experience..."
            multiline
            rows={6}
            value={longDescription}
            onChange={handleLongDescriptionChange}
            inputProps={{ maxLength: 2000 }}
            fullWidth
          />
          <FormHelperText>{`${longDescription.length}/2000`}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            id="long-description-translated"
            label="Long Description Translated"
            placeholder="Tell us about your personality and your work experience (Translated)..."
            multiline
            rows={6}
            value={longDescriptionTranslated}
            onChange={handleLongDescriptionTranslatedChange}
            inputProps={{ maxLength: 2000 }}
            fullWidth
          />
          <FormHelperText>{`${longDescriptionTranslated.length}/2000`}</FormHelperText>
        </FormControl>

        <div>
          <h3>Hospitals / Clinics:</h3>
          {facilities.map((facility, index) => (
            <div key={index}>
              <TextField
                label="Facility Name"
                value={facility.name}
                onChange={(e) => {
                  const updatedFacilities = [...facilities];
                  updatedFacilities[index].name = e.target.value;
                  setFacilities(updatedFacilities);
                }}
                className="mb-4"
                fullWidth
              />
              <TextField
                label="Position"
                value={facility.position}
                onChange={(e) => {
                  const updatedFacilities = [...facilities];
                  updatedFacilities[index].position = e.target.value;
                  setFacilities(updatedFacilities);
                }}
                className="mb-4"
                fullWidth
              />
              <Button
                variant="outlined"
                color="error"
                className="mb-4"
                onClick={() => handleRemoveFacility(index, facility)}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button variant="outlined" onClick={handleAddFacility}>
            Add
          </Button>
        </div>
        <br />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackBarInfo.state}
          sx={{ width: "100%" }}
        >
          {snackBarInfo.message}
        </Alert>
      </Snackbar>
      <MyModal
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmRemoveFacility}
        title="Confirmation"
        description="Are you sure you want to remove this facility?"
      />
    </div>
  );
};

export default Biography;
