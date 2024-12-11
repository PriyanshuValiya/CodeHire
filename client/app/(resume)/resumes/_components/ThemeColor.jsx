"use client";
import React, { useState, useContext } from "react";
import { ResumeContext } from "@/app/(context)/ResumeContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const colors = [
  "#FF5733",
  "#1CFF03",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#FF7133",
  "#000000",
  "#FC0303",
  "#7133FF",
  "#666666",
];

function ThemeColor() {
  const [selectedColor, setSelectedColor] = useState();
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);

  const onColorSelect = (color) => {
    setSelectedColor(color);
    setResumeInfo({
      ...resumeInfo,
      themeColor: color,
    });
    localStorage.setItem("ResumeInfo", JSON.stringify(resumeInfo));
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button size="sm">
            <Palette />
            Theme
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <h2 className="mb-2 text-sm">
            <b>Select Theme Color</b>
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {colors.map((item, index) => (
              <div
                key={index}
                onClick={() => onColorSelect(item)}
                className={`h-5 w-5 rounded-full cursor-pointer
             hover:border-black border
             ${selectedColor == item && "border border-black"}
             `}
                style={{
                  background: item,
                }}
              ></div>
            ))}
          </div>
        </PopoverContent>{" "}
      </Popover>
    </div>
  );
}

export default ThemeColor;
