"use client";
import React, { useEffect, useState, useRef } from "react";
import { Home, Send, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import moment from "moment";
import { useParams } from "next/navigation";
import Chart from "chart.js/auto";

function ProfilePage() {
  const { profileId } = useParams();
  const [dialogBox, setDialogBox] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubData, setGithubData] = useState({});
  const [githubRepoData, setGithubRepoData] = useState([]);
  const [userSkills, setUserSkills] = useState({});
  const chartRef = useRef(null);

  const extractSkills = (repos) => {
    const skillsMap = repos.reduce((acc, repo) => {
      if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {});
    setUserSkills(skillsMap);
  };

  useEffect(() => {
    if (chartRef.current && Object.keys(userSkills).length > 0) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(userSkills),
          datasets: [
            {
              label: "",
              data: Object.values(userSkills),
              backgroundColor: [
                "#4CAF50",
                "#2196F3",
                "#FF5722",
                "#FFC107",
                "#E91E63",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
          },
          scales: {
            x: { title: { display: true, text: "Skills" } },
            y: {
              title: { display: true, text: "Repository Count" },
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [userSkills]);

  useEffect(() => {
    const fetchData = async () => {
      if (!profileId) {
        return;
      }
      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCALHOST}/api/profile/getuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await res.json();
        if (!data.success) {
          setDialogBox(true);
        } else {
          setGithubData(data.data);
          const sortedRepos = data.data2.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setGithubRepoData(sortedRepos);
          extractSkills(sortedRepos);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileId]);

  const handleOnChange = (e) => setUserName(e.target.value.trim());

  const handleOnSubmit = async () => {
    setDialogBox(false);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCALHOST}/api/profile/createuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, githubId: userName }),
      });

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      await res.json();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto pt-6 px-4">
      <Dialog open={dialogBox} onOpenChange={setDialogBox}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your GitHub ID</DialogTitle>
            <DialogDescription className="flex gap-x-3">
              <Input
                className="mt-3 text-black"
                placeholder="https://github.com/YourUsername"
                onChange={handleOnChange}
              />
              <Button className="mt-3" onClick={handleOnSubmit}>
                <Send />
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Link href="/dashboard" className="inline-block mb-6">
        <Home />
      </Link>

      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      {loading ? (
        <p className="text-center text-xl font-medium">Loading Profile...</p>
      ) : (
        <div>
          <div className="flex flex-wrap md:flex-nowrap gap-6">
            <div className="md:w-1/3 text-center md:text-left">
              <Image
                src={githubData.avatar_url || "/placeholder-avatar.png"}
                alt="Github Avatar"
                className="rounded-full mx-auto"
                height={230}
                width={230}
              />
            </div>
            <div className="mt-5 md:w-2/3">
              <h2 className="text-3xl font-semibold">{githubData.login}</h2>
              <p className="text-gray-600 mt-2">{githubData.bio}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <p>
                  <b>Repos :</b> {githubData.public_repos}
                </p>
                <p>
                  <b>Gists :</b> {githubData.public_gists}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <p>
                  <b>Followers:</b> {githubData.followers}
                </p>
                <p>
                  <b>Following:</b> {githubData.following}
                </p>
                <p>
                  <b>Location:</b> {githubData.location}
                </p>
              </div>
              <Link href={githubData.html_url || ""} target="_blank">
                <Button className="mt-6 float-right" variant="outline">
                  <SquareArrowOutUpRight /> Visit Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              Skills Based on Repositories
            </h2>
            <div className="flex gap-6">
              <ul className="w-2/6">
                {Object.entries(userSkills).map(([skill, count]) => (
                  <li
                    key={skill}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2 shadow-sm"
                  >
                    <span>{skill}</span>
                    <span className="text-sm text-gray-500">{count} repos</span>
                  </li>
                ))}
              </ul>
              <div className="relative w-4/6">
                <canvas ref={chartRef} />
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold mt-10">Your Repositories</div>
          <div className="mt-8 grid grid-cols-4 gap-4">
            {githubRepoData && githubRepoData.length > 0 ? (
              githubRepoData.map((repo, idx) => (
                <div key={idx}>
                  <Card className="">
                    <CardHeader>
                      <CardTitle>{repo.name}</CardTitle>
                      <CardDescription>
                        {moment(repo.created_at).fromNow()}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link href={`${repo.html_url}`} target="_blank">
                        <Button variant="outline" size="sm">
                          Visit Repo
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              ))
            ) : (
              <p>No repositories available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
