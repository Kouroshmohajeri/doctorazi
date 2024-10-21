"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TimeLine from "@/components/TimeLine/TimeLine";
import React, { useEffect, useState, useContext } from "react";
import styles from "./Doctor.module.css";
import Label from "@/components/Label/Label";
import Link from "next/link";
import DcotorCard from "@/components/DoctorCard/DoctorCard";
import { languageContext } from "@/context/LanguageContext";
import { getAllDoctors } from "@/lib/actions/doctors/actions";
import { getFullNameById } from "@/lib/actions/users/actions";
import { getSpecialityById } from "@/lib/actions/speciality/actions";
import {
  getProfileImagesByUserId,
  getProfileImageByFolderName,
} from "@/lib/actions/profileImage/actions";
import PersonSearchSharpIcon from "@mui/icons-material/PersonSearchSharp";
import { getBiographyByDoctorId } from "@/lib/actions/biography/actions";

export default function Page() {
  const baseUrl = "doctors";
  const { t, currentLang } = useContext(languageContext);
  const [doctorsList, setDoctorsList] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        if (response) {
          const promises = response.map(async (doctor) => {
            const fullNameResponse = await getFullNameById(doctor.client_id);
            const fullName = fullNameResponse.fullName;
            const biography = await getBiographyByDoctorId(doctor.doctor_id);
            const fullNameFarsi = biography ? biography.translatedName : null;
            const specialityResponse = await getSpecialityById(
              doctor.speciality_id
            );
            const speciality = `${specialityResponse.name} - ${specialityResponse.translate}`;

            let fileName = "";
            let hasProfileImage = true;

            const foldersResponse = await getProfileImagesByUserId(
              doctor.client_id
            );
            const userFolders = foldersResponse.userFolders;

            if (userFolders.length > 0) {
              const folderName = userFolders[0];
              const filesResponse = await getProfileImageByFolderName(
                folderName
              );
              const files = filesResponse.files;
              if (files.length > 0) {
                fileName = files[0];
              } else {
                hasProfileImage = false;
              }
            } else {
              hasProfileImage = false;
            }

            return {
              doctor_id: doctor.doctor_id,
              client_id: doctor.client_id,
              speciality: doctor.speciality_id,
              fullName,
              fullNameTranslated: fullNameFarsi,
              specialityName: speciality,
              hasProfileImage,
              fileName,
            };
          });

          const doctors = await Promise.all(promises);
          setDoctorsList(doctors);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDoctors = doctorsList.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <Header />
      <TimeLine
        source={"/images/Doctors.jpg"}
        headLine={t("Doctors:OurDoctors")}
      />
      <div className={styles.container}>
        <div className={styles.searchbar}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              className={styles.bar}
              type="search"
              placeholder={t("Doctors:SearchDoctors")}
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <span className={styles.icon}>
              <PersonSearchSharpIcon />
            </span>
          </form>
        </div>
        <label className={styles.label}>
          {t("Doctors:DoctorsAndSpecialities")}
        </label>
        <hr className="w-50 mx-auto" />
        <div className={styles.doctorsList}>
          {searchMessage ? (
            <p>{searchMessage}</p>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <Link
                className={styles.links}
                key={index}
                href={`${baseUrl}/${doctor.doctor_id}/${doctor.fullName.replace(
                  /\s+/g,
                  "-"
                )}`}
              >
                {doctor.hasProfileImage ? (
                  <DcotorCard
                    name={
                      currentLang === "en"
                        ? doctor.fullName
                        : doctor.fullNameTranslated
                    }
                    image={`https://doctorazi.com:8443/profileImage/pi_${doctor.client_id}/${doctor.fileName}`}
                    speciality={doctor.specialityName}
                    alt={doctor.fullName.replace(/\s+/g, "-")}
                    buttonText={t("Doctors:ShowProfile")}
                  />
                ) : (
                  <DcotorCard
                    name={doctor.fullName}
                    image={"/images/12980656_5109265.svg"}
                    speciality={doctor.specialityName}
                    alt={doctor.fullName.replace(/\s+/g, "-")}
                    buttonText={t("Doctors:ShowProfile")}
                  />
                )}
              </Link>
            ))
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
