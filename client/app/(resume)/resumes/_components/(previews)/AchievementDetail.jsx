"use client";
import React, { useEffect, useState } from "react";

function AchievementDetail({ resumeInfo }) {
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("ResumeInfo");

    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData.achievement) {
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
        <b>Achievements</b>
      </h2>
      <div className="ml-2 mt-2">
        {dataToDisplay?.achievement.map((ele, index) => (
          <div className="pb-2" key={index}>
            <div className="flex justify-between">
              <h2 className="font-semibold">{ele.title}</h2>
            </div>
            <h3 className="text-sm">{ele.description}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementDetail;
