"use client";
import { ResumeContext } from "@/app/(context)/ResumeContext";
import React, { useContext } from "react";
import PersonalDetail from "./(previews)/PersonalDetail";
import Skills from "./(previews)/Skills";
import ExperienceDetail from "./(previews)/ExperienceDetail";
import EducationDetail from "./(previews)/EducationDetail";
import ProjectDetail from "./(previews)/ProjectDetail";
import AchievementDetail from "./(previews)/AchievementDetail";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

function PreviewSection() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);

  const handlePrint = () => {
    alert("This feature is not ready yet !!");
  };

  return (
    <div className="flex flex-col gap-y-2 w-1/2">
      <Button className="w-1/6 ml-auto" onClick={handlePrint}>
        <Download />
        Download
      </Button>
      <div className="w-full shadow-lg h-full p-8 border-2 border-black">
        <PersonalDetail resumeInfo={resumeInfo} />
        <Skills resumeInfo={resumeInfo} />
        <EducationDetail resumeInfo={resumeInfo} />
        <ExperienceDetail resumeInfo={resumeInfo} />
        <ProjectDetail resumeInfo={resumeInfo} />
        <AchievementDetail resumeInfo={resumeInfo} />
      </div>
    </div>
  );
}

export default PreviewSection;
