"use client";
import React, { useEffect, useState } from "react";
import FormSection from "../_components/FormSection";
import PreviewSection from "../_components/PreviewSection";
import { ResumeContext } from "@/app/(context)/ResumeContext";
import dummyData from "../_components/(previews)/dummyData";
import { Button } from "@/components/ui/button";
import { Download, Home } from "lucide-react";
import Link from "next/link";

function GeneratePage() {
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("ResumeInfo");
    if (storedData) {
      setResumeInfo(JSON.parse(storedData));
    } else {
      setResumeInfo(dummyData);
    }
  }, []);

  useEffect(() => {
    if (resumeInfo) {
      localStorage.setItem("ResumeInfo", JSON.stringify(resumeInfo));
    }
  }, [resumeInfo]);

  if (!resumeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <ResumeContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <Link href={"/dashboard"}><Home /></Link>
      <div className="max-w-screen-2xl mx-auto flex pb-5">
        <FormSection />
        <PreviewSection />
      </div>
    </ResumeContext.Provider>
  );
}

export default GeneratePage;
