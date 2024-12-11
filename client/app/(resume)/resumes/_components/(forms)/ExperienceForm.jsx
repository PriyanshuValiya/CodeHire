"use client";
import React, { useContext, useEffect, useState } from "react";
import { Route, Lightbulb, Brain, LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResumeContext } from "@/app/(context)/ResumeContext";

const formField = {
  title: "",
  companyName: "",
  city: "",
  startDate: "",
  endDate: "",
  workSummary: "",
};

function ExperienceForm() {
  const { toast } = useToast();
  const [experienceList, setExperienceList] = useState([formField]);
  const [load, setLoad] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);

  const handleOnChange = (e, index) => {
    const newEntries = experienceList.slice();
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const handleAddExperience = () => {
    setExperienceList([...experienceList, { ...formField }]);
  };

  const handleRemoveExperience = (index) => {
    const updatedList = experienceList.filter((_, idx) => idx !== index);
    setExperienceList(updatedList);
  };

  const handleOnSave = () => {
    const updatedResumeInfo = {
      ...resumeInfo,
      experience: experienceList,
    };
    setResumeInfo(updatedResumeInfo);
    localStorage.setItem("ResumeInfo", JSON.stringify(updatedResumeInfo));
    toast({
      variant: "destructive",
      description: "Data saved successfully...",
    });

    console.log(JSON.parse(localStorage.getItem("ResumeInfo")));
  };

  const GenerateFromAI = async (index) => {
    setLoad(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/resume/experience`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            experience: experienceList[index],
          }),
        }
      );


      const data = await res.json();

      if (!res.ok) {
        console.log("Error at Generating Experience Description");
        return;
      }

      const updatedList = [...experienceList];
      updatedList[index].workSummary = data.response;
      setExperienceList(updatedList);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      experience: experienceList,
    });
  }, [experienceList]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-2 border-black">
      <div className="flex justify-between">
        <div>
          <h2 className="flex gap-x-2 text-lg font-bold">
            <Route />
            Experience Section
          </h2>
        </div>
        <div>
          <Lightbulb
            className="cursor-pointer"
            onClick={() => {
              toast({
                title: "AI Suggestion",
                description:
                  "Describe your achievements concisely and include measurable results when possible, Please Enter at most 2 most valuable experiences...",
              });
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        {experienceList?.map((item, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <div className="flex flex-col mb-3">
              <label className="text-sm">Position Title</label>
              <Input
                name="title"
                value={item.title}
                onChange={(e) => handleOnChange(e, index)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="flex gap-x-3">
              <div className="flex flex-col mb-2 w-1/2">
                <label className="text-sm">Company Name</label>
                <Input
                  name="companyName"
                  value={item.companyName}
                  onChange={(e) => handleOnChange(e, index)}
                  placeholder="Google"
                />
              </div>
              <div className="flex flex-col mb-2 w-1/2">
                <label className="text-sm">City</label>
                <Input
                  name="city"
                  value={item.city}
                  onChange={(e) => handleOnChange(e, index)}
                  placeholder="Bengaluru"
                />
              </div>
            </div>
            <div className="flex gap-3 mb-2">
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
            <div className="flex flex-col mb-2">
              <div className="flex justify-between my-1">
                <label className="text-sm">Work Summary</label>
                {load ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Brain
                    className="cursor-pointer"
                    onClick={() => {
                      GenerateFromAI(index);
                    }}
                  />
                )}
              </div>
              <Textarea
                name="workSummary"
                value={item.workSummary}
                onChange={(e) => handleOnChange(e, index)}
                placeholder="Write your experince in short and generate it's professional version by AI..."
                rows={4}
              />
            </div>
            <div className="flex justify-end mt-3">
              <Button
                className="float-right"
                variant="destructive"
                onClick={() => handleRemoveExperience(index)}
                size="sm"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={handleAddExperience} size="sm">
          Add Experience
        </Button>
        <Button onClick={handleOnSave} size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}

export default ExperienceForm;
