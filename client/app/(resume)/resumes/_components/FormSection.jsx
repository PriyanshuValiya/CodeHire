"use client";
import React, { useState } from "react";
import PersonalForm from "./(forms)/PersonalForm";
import SkillsForm from "./(forms)/SkillsForm";
import { Button } from "@/components/ui/button";
import ExperienceForm from "./(forms)/ExperienceForm";
import EducationForm from "./(forms)/EducationForm";
import ProjectForm from "./(forms)/ProjectForm";
import AchievementForm from "./(forms)/AchievementForm";
import ThemeColor from "./ThemeColor";

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);

  return (
    <div className="flex flex-col gap-y-5 w-1/2 pr-8 mt-5">
      <ThemeColor />
        
      <div>
        {activeFormIndex == 1 ? <PersonalForm /> : ""}
        {activeFormIndex == 2 ? <SkillsForm /> : ""}
        {activeFormIndex == 3 ? <EducationForm /> : ""}
        {activeFormIndex == 4 ? <ExperienceForm /> : ""}
        {activeFormIndex == 5 ? <ProjectForm /> : ""}
        {activeFormIndex == 6 ? <AchievementForm /> : ""}
      </div>
      <div className="flex justify-between">
        {activeFormIndex > 1 ? (
          <Button
            variant="outline"
            onClick={() => setActiveFormIndex(activeFormIndex - 1)}
          >
            Previous
          </Button>
        ) : (
          ""
        )}
        {activeFormIndex < 6 ? (
          <Button onClick={() => setActiveFormIndex(activeFormIndex + 1)}>
            Next
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default FormSection;
