import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckIcon,
  MenuIcon,
  MicIcon,
  UserIcon,
  VideoIcon,
  FileTextIcon,
  BarChartIcon,
  File,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="border-b border-gray-200 px-9">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <img className="h-12 w-48" src="./Logo.jpg" alt="logo" />
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-gray-700">
              Features
            </a>
            <a href="#pricing" className="hover:text-gray-700">
              Pricing
            </a>
            <a href="#footer" className="hover:text-gray-700">
              About Us
            </a>
          </nav>
          <Button variant="outline" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="px-5">
        <section className="py-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            AI-Powered Interview Practice
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Prepare for your next job interview with our cutting-edge AI
            technology. Get real-time feedback and improve your skills.
          </p>
          <Link href={"/dashboard"}>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Start With Free Trial
            </Button>
          </Link>
        </section>

        <section id="features" className="px-5 py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MicIcon className="h-10 w-10" />}
                title="Voice Analysis"
                description="Our AI analyzes your tone, pace, and clarity to provide actionable feedback."
              />
              <FeatureCard
                icon={<VideoIcon className="h-10 w-10" />}
                title="Video Assessment"
                description="Get insights on your body language and facial expressions during the interview."
              />
              <FeatureCard
                icon={<UserIcon className="h-10 w-10" />}
                title="Personalized Questions"
                description="Experience tailored interview questions based on your industry and experience level."
              />
              <FeatureCard
                icon={<FileTextIcon className="h-10 w-10" />}
                title="AI Resume Generator"
                description="Craft an impressive, ATS-friendly resume with our AI-powered tool."
              />
              <FeatureCard
                icon={<BarChartIcon className="h-10 w-10" />}
                title="ATS Score Checker"
                description="Ensure your resume scores high on ATS algorithms for targeted job roles."
              />
              <FeatureCard
                icon={<File className="h-10 w-10" />}
                title="Report Card"
                description="Our AI analyzes responses, code, and clarity to provide highly accurate report card."
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="px-5 py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">
              Simple Pricing
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Link href={"/upgrade"}>
              <PricingCard
                title="CodeHire Plus"
                price="₹49"
                features={[
                  "5 AI interviews per month",
                  "7 Resume parsing",
                  "Basic voice analysis",
                  "Priority support",
                  "AI Chat Bot",
                ]}
              />
              </Link>
              <Link href={"/upgrade"}>
              <PricingCard
                title="CodeHire Pro"
                price="₹499"
                features={[
                  "Unlimited AI interviews",
                  "Unlimited Resume parsing",
                  "Personalized question bank",
                  "Advanced Code Editor",
                  "AI Chat Bot",
                  "Email support",
                ]}
                highlighted={true}
              />
              </Link>
              <PricingCard
                title="Enterprise"
                price="Custom"
                features={[
                  "All Pro features",
                  "Custom integration",
                  "Dedicated account manager",
                  "Onboarding training",
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">intervue</h4>
              <p className="text-sm text-gray-400">
                Empowering job seekers with AI-driven interview practice.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Other Products</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="https://youtube-clone-swart-eight.vercel.app/"
                    className="hover:text-white"
                    target="_blank"
                  >
                    Youtube
                  </a>
                </li>
                <li>
                  <a
                    href="https://threads-b9qr.onrender.com/"
                    className="hover:text-white"
                    target="_blank"
                  >
                    Threads
                  </a>
                </li>
                <li>
                  <a
                    href="https://google-notes.onrender.com/"
                    className="hover:text-white"
                    target="_blank"
                  >
                    Google Notes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Contact Me</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="https://www.linkedin.com/in/priyanshu-valiya19012006/"
                    className="hover:text-white"
                    target="_blank"
                  >
                    Linkedin
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/PriyanshuValiya"
                    className="hover:text-white"
                    target="_blank"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/priyanshu_valiya/"
                    className="hover:text-white"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=100093844835271"
                    className="hover:text-white"
                    target="_blank"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2024 intervue. All rights reserved by Priyanshu Valiya.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="text-center hover:scale-105 hover:shadow-md transition-all">
      <CardHeader>
        <div className="mx-auto bg-gray-100 rounded-full p-3 inline-block">
          {icon}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function PricingCard({ title, price, features, highlighted = false }) {
  return (
    <Card
      className={`hover:scale-105 hover:shadow-md transition-all text-center ${
        highlighted ? "border-2 border-black" : ""
      }`}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-3xl font-bold">{price}</p>
        {price !== "Custom" && (
          <p className="text-sm text-gray-600">per month</p>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center">
              <CheckIcon className="h-5 w-5 mr-2 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className={`mt-6 w-full ${
            highlighted
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-black border border-black hover:bg-gray-100"
          }`}
        >
          {price === "Custom" ? "Contact Sales" : "Get Started"}
        </Button>
      </CardContent>
    </Card>
  );
}
