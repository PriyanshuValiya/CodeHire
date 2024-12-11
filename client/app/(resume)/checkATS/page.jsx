"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Home, LoaderCircle, Upload } from "lucide-react";
import Image from "next/image";

function CheckATS() {
  const [dialogBox, setDialogBox] = useState(false);
  const [resumeDialogBox, setResumeDialogBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [file, setFile] = useState(null);
  const [jobData, setJobData] = useState({
    jobPosition: "",
    jobDesc: "",
  });
  const [aiFeedback, setAIFeedback] = useState({
    atsScore: 0,
    feedbackMsg: "",
    improvment: "",
  });
  const [resumeImg, setResumeImg] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const file2 = e.target.files?.[0];
    setResumeImg(file2 ? URL.createObjectURL(file2) : undefined);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobPosition", jobData.jobPosition);
    formData.append("jobDesc", jobData.jobDesc);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/resume/checkats`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch ATS data.");
      }

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      setAIFeedback({
        atsScore: data?.parsedResponse.ATS_score,
        feedbackMsg: data?.parsedResponse.feedback,
        improvment: data?.parsedResponse.area_of_improvement,
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
      setDialogBox(false);
      setFlag(true);
    }
  };

  return (
    <div>
      <Link href={"/dashboard"}>
        <Home />
      </Link>
      <div className="flex flex-col items-center gap-y-2 ml-18 mt-2">
        <h2 className="text-4xl font-bold">Check Your Resume's ATS Score</h2>
        <h5 className="w-1/2 text-center text-gray-600">
          Bridge the gap between talent and opportunity with our AI-powered ATS
          score checker. Align your resume to job descriptions and boost your
          chances of landing your dream role effortlessly.
        </h5>

        <Button onClick={() => setDialogBox(true)} className="mt-2">
          <Upload /> Upload Resume
        </Button>

        <Dialog open={dialogBox} onOpenChange={setDialogBox}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Upload Resume</DialogTitle>
              <DialogDescription>
                <form onSubmit={handleOnSubmit}>
                  <div className="flex flex-col gap-4 text-black my-7">
                    <div className="flex flex-col gap-1">
                      <label>Resume Photo in .jpg/.png format</label>
                      <Input
                        type="file"
                        name="file"
                        required
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label>Job Position / Role Name</label>
                      <Input
                        name="jobPosition"
                        value={jobData.jobPosition}
                        placeholder="Full Stack Developer"
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label>Job Description</label>
                      <Textarea
                        name="jobDesc"
                        value={jobData.jobDesc}
                        placeholder="Assist in designing, developing, and maintaining websites..."
                        onChange={handleOnChange}
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      className="bg-gray-200 hover:bg-gray-300 text-black"
                      onClick={() => setDialogBox(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isLoading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Analyze Resume"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {flag && (
          <div className="flex justify-between w-full mt-5">
            <div className="w-1/2 px-32">
              {resumeImg && (
                <Image
                  src={resumeImg}
                  alt="Resume Image"
                  className="border-2 cursor-pointer"
                  width={400}
                  height={450}
                  onClick={() => setResumeDialogBox(!resumeDialogBox)}
                />
              )}
            </div>
            <div className="flex flex-col gap-y-3 p-5 border-l-2 w-1/2">
              <h2>
                <b>ATS Score : </b>
                {aiFeedback.atsScore}%
              </h2>
              <h2>
                <b>Area Of Improvement : </b>
                {aiFeedback.improvment}
              </h2>
              <h2>
                <b>Feedback : </b>
                {aiFeedback.feedbackMsg}
              </h2>
            </div>
          </div>
        )}

        <Dialog open={resumeDialogBox} onOpenChange={setResumeDialogBox}>
          <DialogContent className="max-w-2xl">
            <Image
              src={resumeImg}
              alt="Resume Image"
              className="border-2 cursor-pointer mx-14"
              width={500}
              height={550}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CheckATS;
