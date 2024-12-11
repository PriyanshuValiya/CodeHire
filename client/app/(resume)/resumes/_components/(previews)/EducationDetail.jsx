"use client";
import React, { useEffect, useState } from "react";

function EducationDetail({ resumeInfo }) {
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("ResumeInfo");

    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData.education) {
        setStoredData(parsedData);
      }
    }
  }, []);

  if (!storedData && !resumeInfo) {
    return <div>Loading...</div>;
  }

  const dataToDisplay = resumeInfo || storedData;

  return (
    <div className="mt-2">
      <h2 className="text-normal" style={{ color: dataToDisplay?.themeColor }}>
        <b>Education</b>
      </h2>
      <div className="ml-2 mt-2">
        {dataToDisplay?.education.map((ele, index) => (
          <li className="flex justify-between" key={index}>
            <h3 className="fort-normal">
              {ele.degree.trim()}
              {ele.program !== "" ? `, ${ele.program}` : ""} |{" "}
              {ele.universityName.trim()}, {ele.state.trim()}
            </h3>
            <h3 className="text-sm">
              {ele.cgp < 10 ? `CGP : ${ele.cgp}` : `Grade : ${ele.cgp}%`} | (
              {ele.startDate} - {ele.endDate === "" ? "Current" : ele.endDate})
            </h3>
          </li>
        ))}
      </div>
    </div>
  );
}

export default EducationDetail;
