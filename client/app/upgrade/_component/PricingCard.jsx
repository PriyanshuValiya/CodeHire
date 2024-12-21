"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function PricingCard({ title, price, duration, features, link }) {
  const { user } = useUser();

  return (
    <Card className="w-[350px] hover:scale-105 hover:shadow-md transition-all text-center">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-3xl font-bold">&#8377; {price}</p>
        {price !== "Custom" && (
          <p className="text-sm text-gray-600">{duration}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <ul className="h-[190px] space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center justify-center">
                <CheckIcon className="h-5 w-5 mr-2 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href={`${link}?prefilled_email=${user?.primaryEmailAddress.emailAddress}`}
            target="_blank"
          >
            <Button className="mt-6 w-full">Upgrade Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default PricingCard;
