"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bot, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Page() {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [load, setLoad] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "bot",
      text: "Hello there! How can I help you today ?",
    },
  ]);

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

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { type: "user", text: message }]);
      setMessage("");

      let PROMPT = `Act like a chatbot for my project CodeHire with features : User can generate highly accurate resume using AI and check their resume's score, User can take AI coding test and get highly accurate feedback report card, User can take AI mock interview of Aptitude, Behavioral and Technical Rounds and get highly accurate feedback report card. Avoid some irelevant questions and ask only relevant questions, give answer Sorry, I can't help for this question for irrelevant questions. Give answer of user message: ${message} from given details`;
      console.log(PROMPT);

      setLoad(true);
      const result = await model.generateContent(PROMPT);
      setLoad(false);

      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          text: result.response.text(),
        },
      ]);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-y-2 ml-36 mt-5">
        <h2 className="text-4xl font-bold">
          Generate High ATS Scored Resume With AI
        </h2>
        <p className="w-3/4 text-center text-gray-600">
          Empower careers with precision. Our AI-powered resume generator crafts
          tailored resumes, unlocking opportunities and redefining the future of
          hiring for many companies.
        </p>
        <div className="flex gap-x-3 mt-3">
          <Link href={"/resumes/190106"}>
            <Button>Generate Resume</Button>
          </Link>
          <Link href={"/checkATS"}>
            <Button variant="outline">Check ATS Score</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-y-2 ml-36 mt-16">
        <h2 className="text-4xl font-bold">
          Crack Your Next Interview with AI-Powered Precision
        </h2>
        <p className="w-3/4 text-center text-gray-600">
          Revolutionize your interview prep with our AI-powered SaaS. Master
          every round, from coding to communication, and step confidently into
          your dream tech role. Success starts here!
        </p>
        <div className="flex gap-x-3 mt-3">
          <Link href={"/interviews"}>
            <Button>Get Started</Button>
          </Link>
          <Link href={"/interviews/previous"}>
            <Button variant="outline">Previous Interviews</Button>
          </Link>
        </div>
      </div>

      <div>
        <div className="fixed bottom-6 right-6">
          <div
            className="flex justify-center items-center h-12 w-12 bg-gray-300 rounded-full cursor-pointer"
            aria-label="Open Chatbot"
            onClick={() => setSheet(true)}
          >
            <Bot className="h-7 w-7 transition-all hover:h-8 hover:w-8" />
          </div>
        </div>

        <Sheet open={sheet} onOpenChange={setSheet}>
          <SheetContent className="h-[90vh] flex flex-col pb-5 mr-3 mt-[5%] rounded-2xl">
            <SheetHeader>
              <SheetTitle>{getGreeting()}, How are you?</SheetTitle>
              <SheetDescription>
                Feel free to ask any questions or get assistance.
              </SheetDescription>
            </SheetHeader>

            {/* Chat History */}
            <div className="h-[570px] overflow-y-auto mt-4 flex flex-col gap-y-3">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${
                    chat.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-1 rounded-lg ${
                      chat.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    } max-w-[75%]`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))}

              {load && <Skeleton className="w-[75%] h-[60px] rounded-xl" />}
            </div>

            <SheetFooter className="absolute bottom-5 mt-4 flex items-center">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-[280px] z-10 border-2 border-black flex-1 outline-none"
              />
              <Button onClick={handleSendMessage}>
                <Send />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default Page;
