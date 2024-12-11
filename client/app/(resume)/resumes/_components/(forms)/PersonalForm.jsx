"use client";
import React, { useContext, useEffect } from "react";
import { ResumeContext } from "@/app/(context)/ResumeContext";
import { Lightbulb, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

function PersonalForm() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setResumeInfo((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user, setResumeInfo]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setResumeInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSave = (e) => {
    e.preventDefault();
    localStorage.setItem("ResumeInfo", JSON.stringify(resumeInfo));
    toast({
      variant: "destructive",
      description: "Data saved successfully...",
    });
    console.log(JSON.parse(localStorage.getItem("ResumeInfo")));
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-2 border-black">
      <div className="flex justify-between">
        <h2 className="flex gap-x-2 text-lg font-bold">
          <User />
          Personal Details
        </h2>
        <Lightbulb
          className="cursor-pointer"
          onClick={() =>
            toast({
              title: "AI Suggestion",
              description:
                "Default theme color is professional for tech industries.",
            })
          }
        />
      </div>

      <form className="flex flex-col gap-y-3 mt-5" onSubmit={handleOnSave}>
        <div className="flex gap-x-3">
          <div className="w-1/2">
            <label className="text-sm">First Name</label>
            <Input
              name="firstName"
              type="text"
              value={resumeInfo?.firstName || ""}
              placeholder="Priyanshu"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              type="text"
              value={resumeInfo?.lastName || ""}
              placeholder="Valiya"
              onChange={handleOnChange}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input
            name="email"
            type="email"
            value={resumeInfo?.email || ""}
            placeholder="priyanshuvaliya@gmail.com"
            onChange={handleOnChange}
            required
          />
        </div>
        <div>
          <label className="text-sm">Phone</label>
          <Input
            name="phone"
            type="text"
            value={resumeInfo?.phone || ""}
            placeholder="(+91) 6351597276"
            onChange={handleOnChange}
            required
          />
        </div>
        <div>
          <label className="text-sm">Github ID</label>
          <Input
            name="github"
            type="text"
            value={resumeInfo?.github || ""}
            placeholder="github.com/PriyanshuValiya"
            onChange={handleOnChange}
            required
          />
        </div>
        <div>
          <label className="text-sm">LinkedIn ID</label>
          <Input
            name="linkedin"
            type="text"
            value={resumeInfo?.linkedin || ""}
            placeholder="linkedin.com/in/priyanshu-valiya"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-1/6"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalForm;
