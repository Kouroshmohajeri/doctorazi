import PersonAvatar from "@/components/Avatar/PersonAvatar";
import React from "react";
import styles from "./DoctorId.module.css";
import Header from "@/components/Header/Header";
import { getDoctor } from "@/lib/actions/doctors/actions";
import { getFullNameById } from "@/lib/actions/users/actions";
import { getSpecialityById } from "@/lib/actions/speciality/actions";
import { getBiographyByDoctorId } from "@/lib/actions/biography/actions";
import LocalHospitalSharpIcon from "@mui/icons-material/LocalHospitalSharp";
import { Paper, Typography } from "@mui/material";
import { getFacilitiesByDoctorId } from "@/lib/actions/facility/actions";
import Footer from "@/components/Footer/Footer";
import SSRButton from "@/components/SSR/Button/SSRButton";
import {
  getProfileImagesByUserId,
  getProfileImageByFolderName,
} from "@/lib/actions/profileImage/actions";
import CommentSection from "@/components/CommentSection/CommentSection";
import UserComments from "@/components/UserComments/UserComments";

const Page = async ({ params }) => {
  const { id } = params;
  const { locale } = params;

  try {
    const doctor = await getDoctor(id);
    const clientId = doctor.client_id;
    const specialityId = doctor.speciality_id;

    const [resume, fullNameResponse, specialityResponse, facilities] =
      await Promise.all([
        getBiographyByDoctorId(id),
        getFullNameById(clientId),
        getSpecialityById(specialityId),
        getFacilitiesByDoctorId(id),
      ]);

    const fullName = fullNameResponse.fullName;
    const speciality = specialityResponse.name;
    const specialityTranslate = specialityResponse.translate;

    // Fetch the profile image
    let profileImage = "/images/12980656_5109265.svg"; // Default image
    const foldersResponse = await getProfileImagesByUserId(clientId);
    const userFolders = foldersResponse.userFolders;

    if (userFolders.length > 0) {
      const folderName = userFolders[0]; // Assuming there's only one folder per user
      const filesResponse = await getProfileImageByFolderName(folderName);
      const files = filesResponse.files;
      if (files.length > 0) {
        profileImage = `http://doctorazi.com:8800/profileImage/pi_${clientId}/${files[0]}`;
      }
    }

    const biographyData = {
      fullName,
      speciality,
      translatedName: resume?.translatedName,
      shortDescription: resume?.short_description,
      shortDescriptionTranslated: resume?.short_description_translated,
      longDescription: resume?.long_description,
      longDescriptionTranslated: resume?.long_description_translated,
    };

    return (
      <main>
        <Header />
        <div className={styles.profile}>
          <div className={styles.info}>
            <PersonAvatar
              image={profileImage}
              alt={fullName.replace(/\s+/g, "-")}
            />
            <div className={styles.rating}></div>
            <SSRButton id={id}>Set Appointment</SSRButton>
          </div>
          <div className={styles.desc}>
            <h2>
              {locale === "fa"
                ? biographyData.translatedName
                : biographyData.fullName}
            </h2>
            <h3>
              {locale === "fa" ? biographyData.speciality : specialityTranslate}
            </h3>
            <p>
              {locale === "fa"
                ? biographyData.shortDescriptionTranslated
                : biographyData.shortDescription}
            </p>
            <p>
              {locale === "fa"
                ? biographyData.longDescriptionTranslated
                : biographyData.longDescription}
            </p>
          </div>
        </div>
        <hr className={styles.hr} />
        <div className={styles.facilitiesContainer}>
          <h3>
            {locale === "fa"
              ? "بیمارستان ها / کلینیک ها"
              : "Hospitals / Clinics"}
          </h3>
          <div className={styles.facilities}>
            {facilities.map((facility) => (
              <Paper
                key={facility.facility_id}
                className={styles.facilityPaper}
                elevation={3}
              >
                <LocalHospitalSharpIcon
                  sx={{ width: "60px", height: "60px" }}
                />
                <Typography variant="h6">{facility.name}</Typography>
                <Typography variant="body1">{facility.position}</Typography>
              </Paper>
            ))}
          </div>
        </div>
        <hr className={styles.hrComment} />
        <div className={styles.comments}>
          <div className={styles.commentSection}>
            <CommentSection postId={id} type={1} />
          </div>
          <div className={styles.userComments}>
            <UserComments postId={id} expressionId={1} locale={locale} />
          </div>
        </div>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <main>
        <Header />
        <div className={styles.notFound}>
          <h4>Doctor not found</h4>
          <SSRButton type={"back"}>Back</SSRButton>
        </div>
        <Footer />
      </main>
    );
  }
};

export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const doctor = await getDoctor(id);
    const clientId = doctor.client_id;
    const fullNameResponse = await getFullNameById(clientId);

    const fullName = fullNameResponse.fullName;

    return {
      title: fullName,
      description: "Designed By Kourosh Mohajeri - Web Gallery",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Doctor Profile",
      description: "Designed By Kourosh Mohajeri - Web Gallery",
    };
  }
}

export default Page;
