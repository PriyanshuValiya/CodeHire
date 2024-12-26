"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  ShieldCheckIcon,
  Lightbulb,
  X,
  Brain,
  LoaderCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ResumeContext } from "@/app/(context)/ResumeContext";

const formField = { key: "", value: "" };

function SkillsForm() {
  const { toast } = useToast();
  const [jobDesc, setJobDesc] = useState("");
  const [aiRes, setAiRes] = useState("");
  const [techList, setTechList] = useState([formField]);
  const [load, setLoad] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);

  const handleAddField = (e) => {
    e.preventDefault();
    setTechList([...techList, { key: "", value: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedTechList = [...techList];
    updatedTechList[index] = { ...updatedTechList[index], [field]: value };
    setTechList(updatedTechList);
  };

  const handleRemoveField = (index) => {
    const updatedTechList = techList.filter((_, i) => i !== index);
    setTechList(updatedTechList);
  };

  const handleOnSave = (e) => {
    e.preventDefault();
    const updatedSkills = {
      ...resumeInfo,
      skills: techList,
    };
    setResumeInfo(updatedSkills);
    localStorage.setItem("ResumeInfo", JSON.stringify(updatedSkills));
    toast({
      variant: "destructive",
      description: "Data saved successfully...",
    });
    console.log(JSON.parse(localStorage.getItem("ResumeInfo")));
  };

  const GenerateFromAI = async () => {
    setLoad(true);

    try {
      const res = await fetch(
        `/api/resume/skill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: jobDesc,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Error at Generating Project Description");
        return;
      }

      setAiRes(data.response);

      setTimeout(() => {
        toast({
          title: "AI Suggestion",
          description: "You must add this keywords in your skills...",
        });
      }, [5000]);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: techList,
    });
  }, [techList]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-2 border-black">
      <div className="flex justify-between">
        <div>
          <h2 className="flex gap-x-2 text-lg font-bold">
            <ShieldCheckIcon />
            Skills Section
          </h2>
        </div>
        <div>
          <Lightbulb
            className="cursor-pointer"
            onClick={() => {
              toast({
                title: "AI Suggestion",
                description:
                  "Include specific tools, languages, or technologies relevant to the role you're applying for.",
              });
            }}
          />
        </div>
      </div>

      <form
        className="flex flex-col gap-y-3 mt-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="text-sm">Job Description</label>
          <Textarea
            placeholder="Copy the Job Description from LinkedIn or the company career portal and paste it here..."
            rows={5}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>

        {!load && aiRes !== "" ? (
          <div className="bg-yellow-100 border-2 rounded-lg border-yellow-500 px-2 pt-1 text-sm">
            {aiRes}
          </div>
        ) : (
          ""
        )}

        <div>
          <div className="flex justify-between my-1">
            <label className="text-sm">Technologies and Skills</label>
            {load ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Brain
                className="cursor-pointer"
                onClick={() => {
                  GenerateFromAI();
                }}
              />
            )}
          </div>
          {techList.map((tech, index) => (
            <div key={index} className="flex items-center space-x-2 mb-3">
              <Input
                placeholder="Frontend"
                value={tech.key}
                onChange={(e) =>
                  handleInputChange(index, "key", e.target.value)
                }
                className="w-1/3"
              />
              <Input
                placeholder="Next.js, React, Angular"
                value={tech.value}
                onChange={(e) =>
                  handleInputChange(index, "value", e.target.value)
                }
                className="w-2/3"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveField(index)}
                className="flex-shrink-0"
                type="button"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
          <div className="flex justify-between mt-5">
            <Button onClick={handleAddField} size="sm" type="button">
              Add
            </Button>
            <Button onClick={handleOnSave} size="sm" type="button">
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SkillsForm;
