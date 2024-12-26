"use client";
import React, { useContext, useEffect, useState } from "react";
import { Lightbulb, Wrench, Brain, LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResumeContext } from "@/app/(context)/ResumeContext";

const formField = {
  title: "",
  techstack: "",
  description: "",
};

function ProjectForm() {
  const { toast } = useToast();
  const [projectList, setProjectList] = useState([formField]);
  const [load, setLoad] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);

  const handleOnChange = (e, index) => {
    const newEntries = [...projectList];
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setProjectList(newEntries);
  };

  const handleAddProject = () => {
    setProjectList([...projectList, { ...formField }]);
  };

  const handleRemoveProject = (index) => {
    const updatedList = projectList.filter((_, idx) => idx !== index);
    setProjectList(updatedList);
  };

  const handleOnSave = () => {
    const updatedResumeInfo = {
      ...resumeInfo,
      projects: projectList,
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
        `/api/resume/project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project: projectList[index],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Error at Generating Project Description");
        return;
      }

      const updatedList = [...projectList];
      updatedList[index].description = data.response;
      setProjectList(updatedList);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      projects: projectList,
    });
  }, [projectList]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-2 border-black">
      <div className="flex justify-between">
        <div>
          <h2 className="flex gap-x-2 text-lg font-bold">
            <Wrench />
            Project Section
          </h2>
        </div>
        <div>
          <Lightbulb
            className="cursor-pointer"
            onClick={() => {
              toast({
                title: "AI Suggestion",
                description: "Describe Your Top 2-3 Job Relevant Projects...",
              });
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        {projectList?.map((item, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <div className="flex flex-col mb-3">
              <label className="text-sm">Project Title</label>
              <Input
                name="title"
                value={item.title}
                onChange={(e) => handleOnChange(e, index)}
                placeholder="Full Stack Web Application"
              />
            </div>
            <div className="flex flex-col mb-3">
              <label className="text-sm">Tech Stack</label>
              <Input
                name="techstack"
                value={item.techstack}
                onChange={(e) => handleOnChange(e, index)}
                placeholder="Next.js, Express, Node, MongoDB, Open AI"
              />
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex justify-between my-1">
                <label className="text-sm">Project Summary</label>
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
                placeholder="Write your project in short and generate its professional version by AI..."
                rows={4}
              />
            </div>
            <div className="flex justify-end mt-3">
              <Button
                className="float-right"
                variant="destructive"
                onClick={() => handleRemoveProject(index)}
                size="sm"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={handleAddProject} size="sm">
          Add Project
        </Button>
        <Button onClick={handleOnSave} size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}

export default ProjectForm;
