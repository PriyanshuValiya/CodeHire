"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { LoaderCircle, Mic, Volume2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import useSpeechToText from "react-hook-speech-to-text";
import { chatSession } from "@/utils/GeminiAIModel";

function BehavioralPage() {
  const { user } = useUser();
  const { behavioralID } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [activeIdx, setActiveIdx] = useState(0);
  const [aiQuestion, setAiQuestion] = useState([]);
  const [load, setLoad] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [aiData, setAiData] = useState({
    company: "",
    position: "",
    experience: 0,
  });

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const handleOnVolume = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      toast({
        description: "Sorry, Your browser does't support text to speech !!",
      });
    }
  };

  const handleOnSave = async () => {
    if (userAnswer.length < 10) {
      toast({
        description: "Your answer is too short, please try again !!",
      });
      return;
    }

    setLoad(true);
    const PROMPT = `Question: ${aiQuestion[activeIdx]?.question}, User Answer: ${userAnswer}. Depends on question and user answer please give us rating for answer out of 10 and feedback as area of improvment if any in just 3 to 5 lines to improve it depends in STAR format in JSON format with rating field and feedback field`;

    try {
      const result = await chatSession.sendMessage(PROMPT);
      const finalResult = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      const jsonFeedbackResp = JSON.parse(finalResult);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/interview/savebehavioral`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: behavioralID,
            question: aiQuestion[activeIdx]?.question,
            correctAnswer: aiQuestion[activeIdx]?.answer,
            userAnswer: userAnswer,
            feedback: jsonFeedbackResp?.feedback,
            rating: jsonFeedbackResp?.rating,
            userEmail:
              user?.primaryEmailAddress?.emailAddress || "demo@gmail.com",
          }),
        }
      );

      if (response.ok) {
        toast({
          variant: "destructive",
          description: "Your answer saved successfully...",
        });
        setUserAnswer("");
      } else {
        console.error("Error at recieving data");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          "An error occurred while saving your answer. Please try again...",
      });
      console.error(err);
    } finally {
      setLoad(false);
    }
  };

  const handleOnEnd = () => {
    const isConfirmed = window.confirm("Are You Sure To End Interview ?");
    if (isConfirmed) {
      router.push(`/interviews/${behavioralID}/feedback`);
    }
  };

  useEffect(() => {
    const getAiQuestions = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/interview/behavioral?id=${behavioralID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Data Not Found in Database");
        return;
      }

      const data = await res.json();
      setAiQuestion(data.data.jsonResponse);
      setAiData({
        company: data.data.company,
        position: data.data.position,
        experience: data.data.selectedExperience,
      });
    };

    try {
      getAiQuestions();
    } catch (err) {
      console.error(err);
    }
  }, [behavioralID]);

  useEffect(() => {
    results.map((result) => setUserAnswer((prev) => prev + result.transcript));
  }, [results]);

  return (
    <div className="flex">
      {/* Left Panel */}
      <div className="flex flex-col w-3/4 h-[700px] border-r-2 border-black">
        <div className="flex items-center justify-between px-3 h-[60px] border-b-2 border-black">
          <div className="px-3 bg-green-200 border-2 rounded-lg font-mono border-green-600">
            Behavioral Round
          </div>
          <div className="flex gap-x-3">
            {activeIdx > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveIdx(activeIdx - 1)}
              >
                Previous
              </Button>
            ) : (
              ""
            )}

            {activeIdx < aiQuestion?.length - 1 ? (
              <Button size="sm" onClick={() => setActiveIdx(activeIdx + 1)}>
                Next
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="">
          <div className="flex pt-4">
            <div className="w-[190px] text-center bg-yellow-200 border-2 rounded-lg border-yellow-600 font-mono">
              Question : {activeIdx + 1} / {aiQuestion?.length}
            </div>
            <div className="w-[930px] pl-3">
              {aiQuestion[activeIdx]?.question}
            </div>
          </div>

          <div className="flex justify-between pt-4 pr-3">
            <div className="flex gap-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  handleOnVolume(aiQuestion[activeIdx]?.question);
                }}
              >
                <Volume2 />
              </Button>
              <Button
                variant="outline"
                onClick={isRecording ? stopSpeechToText : startSpeechToText}
              >
                {isRecording ? (
                  <div className="text-red-600 flex gap-x-2">
                    <Mic />
                    Stop Recording...
                  </div>
                ) : (
                  <div className="flex gap-x-2">Record Answer</div>
                )}
              </Button>
            </div>
            <Button onClick={handleOnSave}>
              {load ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>

          <div className="mt-5 mx-4 px-4">{userAnswer}</div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col w-1/4">
        <div className="h-[450px] p-5">
          <div className="flex justify-end">
            <Button variant="destructive" onClick={handleOnEnd}>
              End Interview
            </Button>
          </div>
          <div className="mt-5">
            <h2>
              <b>Company : </b>
              {aiData.company}
            </h2>
            <h2>
              <b>Position : </b>
              {aiData.position}
            </h2>
            <h2>
              <b>Experience : </b>
              {aiData.experience}
            </h2>
            <h2>
              <b>Email : </b>
              {user?.primaryEmailAddress?.emailAddress}
            </h2>
          </div>
        </div>
        <div className="pl-6 h-[250px]">
          <Webcam
            className="h-[250px] border-2 border-black rounded-2xl"
            mirrored
          />
        </div>
      </div>
    </div>
  );
}

export default BehavioralPage;
