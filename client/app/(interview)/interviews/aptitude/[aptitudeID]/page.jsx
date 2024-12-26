"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, FileText, LoaderCircle, TimerIcon, Undo2 } from "lucide-react";
import Webcam from "react-webcam";
import Timer from "@/app/(interview)/_componets/Timer";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { chatSession } from "@/utils/GeminiAIModel";
import { useParams, useRouter } from "next/navigation";

function AptitudePage({ params }) {
  const { user } = useUser();
  const router = useRouter();
  const { aptitudeID } = useParams();
  const { toast } = useToast();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiQuestion, setAiQuestion] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [load, setLoad] = useState(false);
  const [aiData, setAiData] = useState({
    company: "",
    position: "",
    experience: 0,
  });

  useEffect(() => {
    const getAiQuestions = async () => {
      const res = await fetch(
        `/api/interview/aptitude?id=${aptitudeID}`,
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
  }, [aptitudeID]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();

      const scale = window.devicePixelRatio;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;

      ctx.scale(scale, scale);
      ctx.lineCap = "round";
      ctx.lineWidth = 3;
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleOnSave = async () => {
    setLoad(true);

    const PROMPT = `Question: ${aiQuestion[activeIdx]?.question}, User Answer: ${answer}. Depends on question and user answer please give us rating for answer out of 5, Topic name in Data Structure and feedback like (Weak topic, Medium topic or Strong topic) as area of improvment to improve it in JSON format with rating field, topic feild and feedback field`;

    try {
      const result = await chatSession.sendMessage(PROMPT);
      const finalResult = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      const jsonFeedbackResp = JSON.parse(finalResult);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/interview/saveaptitude`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: aptitudeID,
            question: aiQuestion[activeIdx]?.question,
            correctAnswer: aiQuestion[activeIdx]?.answer,
            userAnswer: answer,
            feedback: jsonFeedbackResp?.feedback,
            topic: jsonFeedbackResp?.topic,
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
        setAnswer("");
      } else {
        console.error("Error at recieving data");
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoad(false);
    }
  };

  const handleOnEnd = () => {
    const isConfirmed = window.confirm("Are You Sure To End Interview ?");
    if (isConfirmed) {
      router.push(`/interviews/${aptitudeID}/feedback`);
    }
  };

  return (
    <div className="flex">
      {/* Left Panel */}
      <div className="flex flex-col w-3/4 h-[700px] border-r-2 border-black">
        <div className="flex items-center justify-between px-3 h-[60px] border-b-2 border-black">
          <div className="px-3 bg-green-200 border-2 rounded-lg font-mono border-green-600">
            Aptitude Round
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

        <div className="h-[220px] border-b-2 border-black">
          <div className="flex pt-4">
            <div className="w-[190px] text-center bg-yellow-200 border-2 rounded-lg border-yellow-600 font-mono">
              Question : {activeIdx + 1} / {aiQuestion?.length}
            </div>
            <div className="w-[930px] pl-3">
              {aiQuestion[activeIdx]?.question}
            </div>
          </div>

          <div className="pt-4 pr-3">
            <Textarea
              value={answer}
              rows={4}
              placeholder="Write your main answer here..."
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4 pr-3">
            <Button size="sm" onClick={() => setAnswer("")}>
              Clear
            </Button>
            <Button size="sm" onClick={handleOnSave}>
              {load ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>

        <div className="h-[380px] pt-2 pr-3">
          <Tabs defaultValue="editor">
            <TabsList className="">
              <TabsTrigger value="editor" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Text Editor
              </TabsTrigger>
              <TabsTrigger value="whiteboard" className="flex items-center">
                <Edit3 className="mr-2 h-4 w-4" />
                Whiteboard
              </TabsTrigger>
            </TabsList>

            {/* Text Editor */}
            <TabsContent value="editor">
              <Textarea
                placeholder="Use this space for rough work or drawing..."
                className="min-h-[360px] font-mono"
              />
            </TabsContent>

            {/* Whiteboard */}
            <TabsContent value="whiteboard">
              <div className="flex justify-end">
                <Button onClick={resetCanvas} size="sm">
                  <Undo2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative bg-white border-2 border-gray-300 rounded-md w-full h-[340px]">
                <canvas
                  className="absolute top-0 left-0 w-full h-full cursor-pointer"
                  ref={canvasRef}
                  id="canvas"
                  onMouseDown={startDrawing}
                  onMouseOut={stopDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col w-1/4">
        <div className="h-[450px] p-5">
          <div className="flex justify-between">
            <div className="flex justify-around w-[120px] pt-1 pr-1 bg-yellow-200 border-2 rounded-lg border-yellow-600 font-mono">
              <TimerIcon />
              <Timer time={35} />
            </div>
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

export default AptitudePage;
