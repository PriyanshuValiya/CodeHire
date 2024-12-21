import React from "react";
import PricingCard from "./_component/PricingCard";
import { Home } from "lucide-react"
import Link from "next/link";

function UpgradePage() {
  return (
    <>
    <Link href={"/dashboard"}><Home /></Link>
      <div className="mt-5 px-4">
        <h3 className="text-3xl font-bold mb-12">Upgrade Plan</h3>
        <div className="flex justify-center gap-x-10">
          <PricingCard
            title="CodeHire Plus"
            price="49"
            duration="per month"
            features={[
              "5 AI interviews per month",
              "7 Resume parsing",
              "Basic voice analysis",
              "Priority support",
              "AI Chat Bot",
            ]}
            link="https://buy.stripe.com/test_cN27uk5h950fdyg288"
          />
          <PricingCard
            title="CodeHire Pro"
            price="499"
            duration="per year"
            features={[
              "Unlimited AI interviews",
              "Unlimited Resume parsing",
              "Personalized question bank",
              "Advanced Code Editor",
              "AI Chat Bot",
              "Email support",
            ]}
            link="https://buy.stripe.com/test_28o2a07phfET51K289"
          />
        </div>
      </div>
    </>
  );
}

export default UpgradePage;
