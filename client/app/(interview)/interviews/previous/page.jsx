"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function PreviousInterviews() {
  const { user } = useUser();
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [load, setLoad] = useState(true);
  const [interviewHistory, setInterviewHistory] = useState([]);

  const getColor = (round) => {
    if (round == "aptitude") {
      return { color: "bg-green-200", border: "border-green-800" };
    } else if (round == "technical") {
      return { color: "bg-orange-200", border: "border-orange-800" };
    } else if (round == "behavioral") {
      return { color: "bg-blue-200", border: "border-blue-800" };
    } else {
      return { color: "bg-yellow-200", border: "border-yellow-800" };
    }
  };

  useEffect(() => {
    toast({
      variant: "destructive",
      description: "Refresh the page to get latest data...",
    });
  }, []);

  useEffect(() => {
    setUserId(user?.primaryEmailAddress.emailAddress);
  }, [user]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/api/interview/gethistory?mail=${userId}`,
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
        setInterviewHistory(
          data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoad(false);
      }
    };

    getHistory();
  }, [userId]);

  return (
    <div className="p-5">
      <Link href={"/dashboard"}>
        <Home />
      </Link>
      <div className="text-3xl font-semibold mt-5">Previous Interviews</div>

      {load ? (
        <div className="flex gap-x-4 mt-8 ml-5">
          <Skeleton className="h-40 w-96" />
          <Skeleton className="h-40 w-96" />
          <Skeleton className="h-40 w-96" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mt-8">
          {interviewHistory.map((interview, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>
                    <h2 className="text-xl">{interview.company}</h2>
                  </CardTitle>
                  <CardDescription>
                    <div
                      className={`text-black font-mono w-24 text-center ${
                        getColor(interview.selectedRound).color
                      } border-2 ${
                        getColor(interview.selectedRound).border
                      } rounded-lg`}
                    >
                      {interview.selectedRound}
                    </div>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <h2 className="text-black">
                    <b>Position : </b>
                    {interview.position}
                  </h2>
                  <h2 className="text-black">
                    <b>Experience : </b>
                    {interview.selectedExperience}
                  </h2>
                </CardDescription>
                <div className="flex justify-between mt-5">
                  <h2>{moment(interview.createdAt).fromNow()}</h2>
                  <Link href={`${interview._id}/feedback`}>
                    <Button className="flex justify-end" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PreviousInterviews;
