"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUser } from "@clerk/nextjs";
import { Home, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/GeminiAIModel";

function Interviews() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [dialogBox, setDialogBox] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [round, setRound] = useState("");
  const [load, setLoad] = useState(false);

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const handleExperienceChange = (value) => {
    setExperience(value);
  };

  const handleRoundChange = (value) => {
    setRound(value);
  };

  const questionNumber = (round) => {
    if (round == "aptitude") {
      return 20;
    } else if (round == "behavioral") {
      return 10;
    } else if (round == "technical") {
      return 6;
    } else {
      return 0;
    }
  };

  const handleOnClick = async () => {
    setLoad(true);

    toast({
      variant: "destructive",
      description: "All The Best For Interview 👍",
    });

    try {
      const PROMPT =
        round == "technical"
          ? `Company: ${company}, Position: ${position}, Years of experience: ${experience}. Provide ${questionNumber(
              round
            )} medium or hard-level Data Structures and Algorithms (DSA) coding questions in JSON format. Each question should include:
              question: A clear problem explanation statement.
              examples: An array of 3 objects, each containing:
                  input: Example input for the problem.
                  output: Expected output for the given input.`
          : `Company: ${company}, Position: ${position}, Years of experience: ${experience}, Round: ${round}. Provide ${questionNumber(
              round
            )} interview questions with answers in JSON format, with 'question' and 'answer' fields.`;

      const result = await chatSession.sendMessage(PROMPT);

      const finalResult = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      const parsedResponse = JSON.parse(finalResult);

      // if (!Array.isArray(parsedResponse.interviewQuestions)) {
      //   throw new Error("Response format invalid. Expected an array.");
      // }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/interview/${round}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company,
            position,
            selectedExperience: experience,
            selectedRound: round,
            jsonResponse:
              parsedResponse.interviewQuestions ||
              parsedResponse.interview_questions ||
              parsedResponse.questions,
            user: user?.primaryEmailAddress?.emailAddress,
          }),
        }
      );

      if (response.ok) {
        toast({
          description: "Please wait a moment...",
        });
        const result = await response.json();
        router.push(`/interviews/${round}/${result.id}`);
      } else {
        console.error("Error saving data: ", response.statusText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div>
      <Link href={"/dashboard"}>
        <Home />
      </Link>
      <div className="text-3xl font-bold pt-6 pl-12">
        <h2>
          {getGreeting()}, {user?.fullName}
        </h2>
      </div>

      <div
        className="w-1/3 mt-10 ml-16 p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setDialogBox(true)}
      >
        <h2 className="text-lg font-semibold text-center">
          + Add New Interview
        </h2>
      </div>

      <Dialog open={dialogBox} onOpenChange={setDialogBox}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell Us About Your Dream Job
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Enter your dream company, position, and the interview round you
              want to prepare for.
              <div className="text-black mt-4">
                <label>Company</label>
                <Input
                  value={company}
                  placeholder="Google"
                  required
                  onChange={(e) => setCompany(e.target.value)}
                />

                <div className="mt-3">
                  <label>Position</label>
                  <Input
                    value={position}
                    placeholder="Software Engineer Intern"
                    required
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label>Experience Level</label>
                  <Select onValueChange={handleExperienceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="2 to 3 years">2 - 3 Years</SelectItem>
                      <SelectItem value="more than 4 years">
                        &gt; 4 Years
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4">
                  <label>Interview Round</label>
                  <Select onValueChange={handleRoundChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Interview Round" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aptitude">Aptitude Round</SelectItem>
                      {/* <SelectItem value="system design">
                        System Design
                      </SelectItem> */}
                      <SelectItem value="behavioral">
                        Behavioral Round
                      </SelectItem>
                      <SelectItem value="technical">Technical Round</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="flex float-right mt-5"
                size="sm"
                onClick={handleOnClick}
                disabled={load}
              >
                {load ? <LoaderCircle className="animate-spin" /> : "Start"}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="ml-16 mt-10">
        <h2 className="text-xl font-semibold">Important Notes</h2>
        <div className="flex flex-col gap-y-3 ml-2 mt-4">
          <div className="flex">
            <b className="w-[220px]">Aptitude Round : </b>
            <h2>
              The aptitude round assesses problem-solving, mathematical, logical
              reasoning, and analytical skills. You will have 20 questions with
              a 35 minute timer. This section is worth 25 marks.
            </h2>
          </div>
          <div className="flex">
            <b className="w-[230px]">System Design Round : </b>
            <h2>
              This round evaluates your ability to design scalable and efficient
              systems, considering trade-offs. You will have one system design
              question with a 30 minute timer. This section is worth 20 marks.
            </h2>
          </div>
          <div className="flex">
            <b className="w-[200px]">Behavioral Round : </b>
            <h2>
              The behavioral round assesses your soft skills, teamwork,
              problem-solving, and communication. You will have 10 questions.
              This section is worth 15 marks.
            </h2>
          </div>
          <div className="flex">
            <b className="w-[215px]">Technical Round : </b>
            <h2>
              This round evaluates your coding skills, problem-solving
              abilities, algorithms, and data structures. You will have 6
              questions with a 80 minute timer. This section is worth 30 marks.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interviews;
