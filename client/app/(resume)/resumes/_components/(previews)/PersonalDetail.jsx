"use client";
import React, { useEffect, useState } from "react";

function PersonalDetail({ resumeInfo }) {
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("ResumeInfo");
    if (data) {
      setStoredData(JSON.parse(data));
    }
  }, []);

  if (!storedData && !resumeInfo) {
    return <div>Loading...</div>;
  }

  const dataToDisplay = resumeInfo || storedData;

  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={{ color: dataToDisplay?.themeColor }}
      >
        {dataToDisplay?.firstName?.toUpperCase()}{" "}
        {dataToDisplay?.lastName?.toUpperCase()}
      </h2>
      <h2 className="font-medium text-sm text-center">
        {dataToDisplay?.email} | {dataToDisplay?.phone}
      </h2>
      <div className="flex justify-between mt-2">
        <h3 className="text-sm">{dataToDisplay?.github}</h3>
        <h3 className="text-sm">{dataToDisplay?.linkedin}</h3>
      </div>
      <hr className="mt-2 border-[1px] border-black" />
    </div>
  );
}

export default PersonalDetail;
