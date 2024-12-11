"use client";
import React, { useEffect, useState } from "react";

function Skills({ resumeInfo }) {
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("ResumeInfo");

    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData.skills) {
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
      <h2 className="text-normal" style={{ color: resumeInfo?.themeColor }}>
        <b>Skills</b>
      </h2>

      {dataToDisplay?.skills.map((skill, index) => (
        <li key={index} className="text-base">
          {skill.key} : {skill.value}
        </li>
      ))}
    </div>
  );
}

export default Skills;
