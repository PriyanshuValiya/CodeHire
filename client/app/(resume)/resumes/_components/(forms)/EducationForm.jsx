"use client";
import React, { useContext, useEffect, useState } from "react";
import { Lightbulb, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeContext } from "@/app/(context)/ResumeContext";

const formField = {
  universityName: "",
  startDate: "",
  endDate: "",
  cgp: "",
  degree: "",
  program: "",
  state: "",
};

function EducationForm() {
  const { toast } = useToast();
  const [educationList, setEducationList] = useState([{ ...formField }]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);

  const handleOnChange = (e, index) => {
    const { name, value } = e.target;
    const updatedList = [...educationList];
    updatedList[index][name] = value;
    setEducationList(updatedList);
  };

  const handleAddEducation = () => {
    setEducationList([...educationList, { ...formField }]);
  };

  const handleRemoveEducation = (index) => {
    const updatedList = educationList.filter((_, idx) => idx !== index);
    setEducationList(updatedList);
  };

  const handleOnSave = () => {
    const updatedResumeInfo = {
      ...resumeInfo,
      education: educationList,
    };
    setResumeInfo(updatedResumeInfo);
    localStorage.setItem("ResumeInfo", JSON.stringify(updatedResumeInfo));

    toast({
      variant: "destructive",
      description: "Data saved successfully...",
    });

    console.log(JSON.parse(localStorage.getItem("ResumeInfo")));
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      education: educationList,
    });
  }, [educationList]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-2 border-black">
      <div className="flex justify-between">
        <div>
          <h2 className="flex gap-x-2 text-lg font-bold">
            <GraduationCap />
            Education Section
          </h2>
        </div>
        <div>
          <Lightbulb
            className="cursor-pointer"
            onClick={() => {
              toast({
                title: "AI Suggestion",
                description:
                  "Describe Your Education Journey In Latest Order...",
              });
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        {educationList?.map((item, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <div className="flex flex-col mb-3">
              <label className="text-sm">University / School Name</label>
              <Input
                name="universityName"
                value={item.universityName}
                onChange={(e) => handleOnChange(e, index)}
              />
            </div>
            <div className="flex gap-x-3">
              <div className="flex flex-col mb-3 w-1/2">
                <label className="text-sm">Degree / Board Name</label>
                <Input
                  name="degree"
                  value={item.degree}
                  onChange={(e) => handleOnChange(e, index)}
                />
              </div>
              <div className="flex flex-col mb-3 w-1/2">
                <label className="text-sm">Program (optinal)</label>
                <Input
                  name="program"
                  value={item.program}
                  onChange={(e) => handleOnChange(e, index)}
                />
              </div>
            </div>
            <div className="flex gap-x-3">
              <div className="flex flex-col mb-3 w-1/2">
                <label className="text-sm">CGPA / Grade</label>
                <Input
                  name="cgp"
                  value={item.cgp}
                  onChange={(e) => handleOnChange(e, index)}
                />
              </div>
              <div className="flex flex-col mb-3 w-1/2">
                <label className="text-sm">State</label>
                <Input
                  name="state"
                  value={item.state}
                  onChange={(e) => handleOnChange(e, index)}
                />
              </div>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="flex flex-col w-1/2">
                <label className="text-sm">Start Date</label>
                <Input
                  name="startDate"
                  value={item.startDate}
                  onChange={(e) => handleOnChange(e, index)}
                  type="date"
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-sm">End Date</label>
                <Input
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => handleOnChange(e, index)}
                  type="date"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button
                className="float-right"
                variant="destructive"
                onClick={() => handleRemoveEducation(index)}
                size="sm"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={handleAddEducation} size="sm">
          Add Education
        </Button>
        <Button onClick={handleOnSave} size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}

export default EducationForm;
