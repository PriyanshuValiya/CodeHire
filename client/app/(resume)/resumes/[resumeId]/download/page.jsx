"use client";
import React, { useEffect, useState } from "react";
import { ResumeContext } from "@/app/(context)/ResumeContext";
import { Button } from "@/components/ui/button";
import { Download, Undo2 } from "lucide-react";
import PreviewSection from "../../_components/PreviewSection";
import Link from "next/link";

function page() {
  const [resumeInfo, setResumeInfo] = useState();

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("ResumeInfo")));
    setResumeInfo(JSON.parse(localStorage.getItem("ResumeInfo")));
  }, []);

  return (
    <ResumeContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div>
        <div className="flex justify-between">
            <Link href={"/resumes/123"}>
          <Button>
            <Undo2 />
            Go Back
          </Button></Link>
          <Button>
            <Download />
            Download
          </Button>
        </div>

        <div className="flex align-middle">
            <PreviewSection />
        </div>
      </div>
    </ResumeContext.Provider>
  );
}

export default page;
