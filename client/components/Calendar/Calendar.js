"use client";
import React, { useContext, useState, useEffect } from "react";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { languageContext } from "@/context/LanguageContext";
import jalaali from "jalaali-js";
import { AppointmentContext } from "@/context/AppointmentContex";

export default function Calendar() {
  const { currentLang } = useContext(languageContext);
  const { date, setDate } = useContext(AppointmentContext);
  const [value, setValue] = useState(null);
  const [displayDate, setDisplayDate] = useState("");

  const handleChange = (newValue) => {
    if (!newValue) return;

    let year, month, day, jalaliDate, gregorianDate;

    if (currentLang === "en") {
      year = newValue.$d.getFullYear();
      month = newValue.$d.getMonth() + 1;
      day = newValue.$d.getDate();
      gregorianDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
      const { jy, jm, jd } = jalaali.toJalaali(year, month, day);
      jalaliDate = `${jy}-${String(jm).padStart(2, "0")}-${String(jd).padStart(2, "0")}`;
    } else {
      year = newValue.getFullYear();
      month = newValue.getMonth() + 1;
      day = newValue.getDate();
      const { jy, jm, jd } = jalaali.toJalaali(year, month, day);
      const convertedDate = jalaali.toGregorian(jy, jm, jd);
      jalaliDate = `${jy}-${String(jm).padStart(2, "0")}-${String(jd).padStart(2, "0")}`;
      const gregorianUnConvertedDate = dayjs(new Date(convertedDate.gy, convertedDate.gm - 1, convertedDate.gd));
      gregorianDate = gregorianUnConvertedDate.format("YYYY-MM-DD");
    }

    setDate({
      gregorian: gregorianDate,
      jalali: jalaliDate,
    });
    setValue(newValue);
    setDisplayDate(currentLang === "en" ? gregorianDate : jalaliDate);
  };

  return (
    <LocalizationProvider dateAdapter={currentLang === "en" ? AdapterDayjs : AdapterDateFnsJalali}>
      <div dir={currentLang === "fa" ? "rtl" : "ltr"}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
          inputFormat={currentLang === "en" ? "DD-MM-YYYY" : "yyyy/MM/dd"}
        />
        {value && <div>Picked Date: {displayDate}</div>}
      </div>
    </LocalizationProvider>
  );
}
