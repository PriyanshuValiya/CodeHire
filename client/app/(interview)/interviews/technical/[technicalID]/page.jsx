"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { chatSession } from "@/utils/GeminiAIModel";
import Timer from "@/app/(interview)/_componets/Timer";
import { LoaderCircle, TimerIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";

const versions = {
  java: "15.0.2",
  cpp: "23",
  python: "3.10.0",
  javascript: "18.15.0",
};

function TechnicalPage() {
  const { user } = useUser();
  const { technicalID } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const editorRef = useRef();
  const [loadRun, setLoadRun] = useState(false);
  const [load, setLoad] = useState(false);
  const [aiQuestion, setAiQuestion] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [code, setCode] = useState("// Write your code function here ...");
  const [aiData, setAiData] = useState({
    company: "",
    position: "",
    experience: 0,
  });

  const handlOnChange = (value) => {
    setLanguage(value);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleRunCode = async () => {
    setLoadRun(true);
    const srcCode = editorRef.current.getValue();
    if (!srcCode) {
      return;
    }

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language,
          version: versions[language],
          files: [{ content: srcCode }],
        }),
      });

      const result = await res.json();
      setOutput(result?.run.output.split("\n"));
      result?.run.stderr ? setError(true) : setError(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadRun(false);
    }
  };

  const handleOnSave = async () => {
    setLoad(true);

    const PROMPT = `Question: ${
      aiQuestion[activeIdx]?.question
    }, Code: ${editorRef.current.getValue()}. Analyze Code for given Question and give me feedback and rate out of 10 in JSON format with 'feedback' ans 'rate' as a feild.`;

    try {
      const result = await chatSession.sendMessage(PROMPT);
      const finalResult = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      const jsonFeedbackResp = JSON.parse(finalResult);

      const response = await fetch(
        `/api/interview/savetechnical`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: technicalID,
            question: aiQuestion[activeIdx]?.question,
            correctAnswer: aiQuestion[activeIdx]?.answer,
            userAnswer: editorRef.current.getValue(),
            feedback: jsonFeedbackResp?.feedback,
            rating: jsonFeedbackResp?.rate,
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
      } else {
        console.error("Error at recieving data");
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
      router.push(`/interviews/${technicalID}/feedback`);
    }
  };

  useEffect(() => {
    const getAiQuestions = async () => {
      const res = await fetch(
        `/api/interview/technical?id=${technicalID}`,
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
  }, [technicalID]);

  return (
    <div className="flex h-[700px]">
      <div className="flex flex-col w-[600px] border-r-2 border-black">
        <div className="flex items-center justify-between h-[50px] px-3 border-b-2 border-black">
          <div className="px-3 bg-orange-200 border-2 rounded-lg font-mono border-orange-600">
            Technical Round
          </div>
          <div className="flex gap-x-3">
            {activeIdx > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveIdx(activeIdx - 1);
                  setCode("// Write your code function here ...");
                }}
              >
                Previous
              </Button>
            ) : (
              ""
            )}

            {activeIdx < aiQuestion?.length - 1 ? (
              <Button
                size="sm"
                onClick={() => {
                  setActiveIdx(activeIdx + 1);
                  setCode("// Write your code function here ...");
                }}
              >
                Next
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="h-[464px] pb-3 border-b-2 border-black">
          <div className="flex gap-x-2 mt-3 pr-3">
            <h2 className="text-2xl font-bold">{activeIdx + 1}.</h2>
            <h2 className="text-lg">{aiQuestion[activeIdx]?.question}</h2>
          </div>

          <div className="mt-3 pl-7">
            <h2 className="text-lg font-bold">Examples</h2>
            {aiQuestion[activeIdx]?.examples.map((ele, idx) => (
              <div className="mt-2 pl-2" key={idx}>
                <h2>
                  <b>Input : </b>
                  {ele.input}
                </h2>
                <h2>
                  <b>Output : </b>
                  {ele.output}
                </h2>
              </div>
            ))}
          </div>
        </div>
        <div className="pl-3 mt-10">
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
      <div className="flex flex-col w-[900px]">
        <div className="flex justify-between pl-5 items-center h-[50px] border-b-2 border-black">
          <div className="flex justify-around w-[120px] pt-[4px] pr-1 bg-yellow-200 border-2 rounded-lg border-yellow-600 font-mono">
            <TimerIcon />
            <Timer time={80} />
          </div>
          <Button variant="destructive" onClick={handleOnEnd}>
            End Interview
          </Button>
        </div>
        <div className="mt-4 pl-5 border-b-2 border-black">
          <div className="pb-3">
            <Select defaultValue={language} onValueChange={handlOnChange}>
              <SelectTrigger className="w-1/6">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="java">Java</SelectItem>
                {/* <SelectItem value="c++">C++</SelectItem> */}
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Editor
              height="55vh"
              theme="vs-dark"
              value={code}
              defaultLanguage={language}
              onMount={onMount}
              onChange={(val) => setCode(val)}
            />
          </div>
        </div>
        <div className="mt-3 pl-5">
          <div className="flex justify-between">
            <div className="flex items-center text-xl font-semibold">
              Output Window
            </div>
            <div className="flex gap-x-3">
              <Button variant="outline" onClick={handleRunCode}>
                {loadRun ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Run Code"
                )}
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleOnSave}
              >
                {load ? <LoaderCircle className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
          <div
            className={`${
              error ? "text-red-600" : "text-black"
            } mt-2 min-h-[130px] border-2 border-black rounded-xl pt-2 pl-3 text-lg`}
          >
            {output ? (
              output.map((ele, idx) => (
                <div className="" key={idx}>
                  {ele}
                </div>
              ))
            ) : (
              <h2 className="text-base text-gray-400">
                Hit 'Run Code' to get output...
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnicalPage;
