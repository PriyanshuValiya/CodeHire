"use client";

import { Home, Send, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import moment from "moment";

function ProfilePage({ params }) {
  const [dialogBox, setDialogBox] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [userName, setUserName] = useState("");
  const [load, setLoad] = useState(false);
  const [githubData, setGithubData] = useState({});
  const [githubRepoData, setGithubRepoData] = useState({});

  useEffect(() => {
    if (params?.profileId) {
      setProfileId(params.profileId);
    }
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      if (!profileId) {
        console.log("Profile ID is not available");
        return;
      }

      setLoad(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCALHOST}/api/profile/getuser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ profileId }),
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch profile data");
          return;
        }

        const data = await res.json();

        if (!data.success) {
          setDialogBox(true);
        } else {
          console.log("Repositories Data:", data.data2);

          setGithubData(data.data);
          setGithubRepoData(data.data2);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, [profileId]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setUserName(e.target.value.trim());
  };

  const handleOnSubmit = async () => {
    setDialogBox(false);
    setLoad(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCALHOST}/api/profile/createuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileId,
            githubId: userName,
          }),
        }
      );

      if (!res.ok) {
        alert("Error while fetching data from GitHub");
        return;
      }

      const data = await res.json();
      console.log("GitHub Data:", data);
    } catch (err) {
      console.error("Error on submit:", err);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto pt-3">
      <Dialog open={dialogBox} onOpenChange={setDialogBox}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your GitHub ID</DialogTitle>
            <DialogDescription className="flex gap-x-3">
              <Input
                className="mt-3 text-black"
                placeholder="https://github.com/PriyanshuValiya"
                onChange={handleOnChange}
                require
              />
              <Button className="mt-3" onClick={handleOnSubmit}>
                <Send />
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Link href={"/dashboard"}>
        <Home />
      </Link>

      <h2 className="text-3xl font-bold mt-6 ml-12">My Profile</h2>

      {load ? (
        <h2>Load</h2>
      ) : (
        <div className="">
          <div className="flex pt-6">
            {/* Placeholder for Profile Photo */}
            <div className="w-2/6 pl-28 border-r-2">
              <Image
                src={githubData.avatar_url}
                alt="Github Image"
                className="rounded-full"
                height={250}
                width={250}
              />
            </div>

            {/* Placeholder for Profile Info */}
            <div className="w-4/6 pt-5 pl-10">
              <div className="flex justify-between">
                <h2 className="text-3xl font-semibold">{githubData.login}</h2>
                <h4>{githubData.type}</h4>
              </div>
              <h3 className="mt-5">
                <b>Bio : </b>
                {githubData.bio}
              </h3>
              <div className="flex gap-x-6 mt-3">
                <h2>
                  <b>Reops : </b>
                  {githubData.public_repos}
                </h2>
                <h2>
                  <b>Gists : </b>
                  {githubData.public_gists}
                </h2>
              </div>
              <div className="flex gap-x-6 mt-3">
                <h2>
                  <b>Followers : </b>
                  {githubData.followers}
                </h2>
                <h2>
                  <b>Following : </b>
                  {githubData.following}
                </h2>
                <h2>
                  <b>Profile : </b>
                  {githubData.user_view_type}
                </h2>
                <h2>
                  <b>Location : </b>
                  {githubData.location}
                </h2>
              </div>

              <Link href={`${githubData.html_url}`} target="_blank">
                <Button className="mt-6 float-right" variant="outline">
                  <SquareArrowOutUpRight />
                  Visit Profile
                </Button>
              </Link>
            </div>
          </div>
          <div>
            {githubRepoData && githubRepoData.length > 0 ? (
              githubRepoData.map((repo) => (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{repo.name}</CardTitle>
                      <CardDescription>
                        {moment(repo.created_at).format("MMMM Do YYYY")}
                      </CardDescription>
                      {/* {repo.languages_url && <CardDescription>{repo.languages_url((ele) => (<h3>{ele}</h3>))}</CardDescription>} */}
                    </CardHeader>
                    <CardContent>
                      <p></p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`${repo.html_url}`} target="_blank">
                        <Button variant="outline">Visit Repo</Button>
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
