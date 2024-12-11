"use client";
import React, { useContext, useEffect, useState } from "react";
import { Lightbulb, Trophy, Brain, LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResumeContext } from "@/app/(context)/ResumeContext";

const formField = {
  title: "",
  description: "",
};

function AchievementForm() {
  const { toast } = useToast();
  const [achievementList, setAchievementList] = useState([formField]);
  const [load, setLoad] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);

  const handleOnChange = (e, index) => {
    const newEntries = achievementList.slice();
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setAchievementList(newEntries);
  };

  const handleAddExperience = () => {
    setAchievementList([...achievementList, { ...formField }]);
  };

  const handleRemoveExperience = (index) => {
    const updatedList = achievementList.filter((_, idx) => idx !== index);
    setAchievementList(updatedList);
  };

  const handleOnSave = () => {
    const updatedResumeInfo = {
      ...resumeInfo,
      achievement: achievementList,
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
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/resume/acheivement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            achievement: achievementList[index],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Error at Generating Project Description");
        return;
      }

      const updatedList = [...achievementList];
      updatedList[index].description = data.response;
      setAchievementList(updatedList);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      achievement: achievementList,
    });
  }, [achievementList]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-2 border-black">
      <div className="flex justify-between">
        <div>
          <h2 className="flex gap-x-2 text-lg font-bold">
            <Trophy />
            Achievement Section
          </h2>
        </div>
        <div>
          <Lightbulb
            className="cursor-pointer"
            onClick={() => {
              toast({
                title: "AI Suggestion",
                description:
                  "Describe Your Atmost 1-2 Top Achievements For Stand Out In The Competition...",
              });
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        {achievementList?.map((item, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <div className="flex flex-col mb-3">
              <label className="text-sm">Achievement Title</label>
              <Input
                name="title"
                value={item.title}
                onChange={(e) => handleOnChange(e, index)}
                placeholder="Winner of Open Source Compititon'24"
              />
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex justify-between my-1">
                <label className="text-sm">Summary</label>
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
                name="description"
                value={item.description}
                onChange={(e) => handleOnChange(e, index)}
                placeholder="Describe few things about this in 30 words..."
                rows={3}
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
          Add Project
        </Button>
        <Button onClick={handleOnSave} size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}

export default AchievementForm;
