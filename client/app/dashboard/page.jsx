import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div>
      {/* Resume Section */}
      <div className="flex flex-col items-center gap-y-2 ml-36 mt-5">
        <h2 className="text-4xl font-bold">
          Generate High ATS Scored Resume With AI
        </h2>
        <p className="w-3/4 text-center text-gray-600">
          Empower careers with precision our AI-powered resume generator crafts
          tailored resumes, unlocking opportunities and redefining the future of
          hiring for many companies.
        </p>
        <div className="flex gap-x-3 mt-3">
          <Link href={"/resumes/123"}>
            <Button>Generate Resume</Button>
          </Link>
          <Link href={"/checkATS"}>
            <Button variant="outline">Check ATS Score</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
