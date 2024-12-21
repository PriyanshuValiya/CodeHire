"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AptitudeFeedback() {
  const { interviewID } = useParams();
  const [feedbackData, setFeedbackData] = useState([]);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const getFeedback = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/api/interview/saveaptitude?id=${interviewID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setFeedbackData(data.data);
          calculateTotalScore(data.data);
        } else {
          console.error("Failed to fetch feedback");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    getFeedback();
  }, [interviewID]);

  const normalizeScore = (rating, maxRating) => {
    return (rating / maxRating) * 25;
  };

  const calculateTotalScore = (data) => {
    let totalScore = 0;
    if (data && data.length > 0) {
      totalScore = data.reduce((acc, item) => {
        const maxRating = item.roundType === "aptitude" ? 5 : 10;
        return acc + normalizeScore(item.rating, maxRating);
      }, 0);
      totalScore /= data.length;
    }
    setRate(totalScore.toFixed(1));
  };

  const getFeedbackMessage = (score) => {
    if (score > 21)
      return {
        text: "Excellent Score, Congratulations !!",
        color: "text-green-600",
      };
    if (score >= 17) return { text: "Good Score !!", color: "text-blue-600" };
    if (score >= 13)
      return { text: "Average Score !", color: "text-yellow-600" };
    return { text: "Need to Improve Score", color: "text-red-600" };
  };

  const feedbackMessage = getFeedbackMessage(rate);

  return (
    <div className="max-w-screen-2xl p-9">
      <div>
        <h2 className={`text-4xl font-semibold ${feedbackMessage.color}`}>
          {feedbackMessage.text}
        </h2>
        <h2 className="text-xl mt-3">
          Your overall interview rating is: <strong>{rate} / 25</strong>
        </h2>
        <h3 className="font-sm text-gray-700 mt-8">
          Below are the interview questions, your answers, and feedback for
          improvement.
        </h3>
      </div>

      <div className="mt-4 rounded-lg">
        {feedbackData.length > 0 ? (
          feedbackData.map((feedback, index) => (
            <div
              className={`border-2 border-black rounded-lg mt-5 p-3 ${
                feedback.rating > 2.5
                  ? feedback.rating > 4
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
              key={index}
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-xl">
                    <b>{feedback.question}</b>
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    <p>
                      <strong>Rating : </strong> {feedback.rating}
                    </p>
                    <p>
                      <strong>Your Answer : </strong> {feedback.userAnswer}
                    </p>
                    {feedback.correctAnswer && (
                      <p>
                        <strong>Improved Answer : </strong>{" "}
                        {feedback.correctAnswer}
                      </p>
                    )}
                    <p>
                      <strong>Feedback : </strong> {feedback.feedback}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))
        ) : (
          <p>No feedback available yet.</p>
        )}
      </div>

      <Link href={"/interviews/previous"}>
        <Button className="flex float-right mt-5">Back Home</Button>
      </Link>
    </div>
  );
}

export default AptitudeFeedback;
