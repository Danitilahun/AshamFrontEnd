// CircularProgressChart.js
import { useTheme } from "@mui/material";
import React from "react";

const CircularProgressChart = ({ activePercentage }) => {
  const theme = useTheme();
  return (
    <div className="circle-holder">
      <div className="circle-container">
        <div className="outer-circle">
          <div
            className="inner-circle"
            style={{
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <div id="number-circle">
              <p>{activePercentage}%</p>
            </div>
          </div>
        </div>

        <svg
          style={{
            position: "absolute",
            display: "flex",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            rotate: "-90deg",
          }}
        >
          <defs>
            <linearGradient id="BarCircleGradient">
              <stop offset="0%" stopColor="#da14e5dc" />
              <stop offset="100%" stopColor="#673ab7" />
            </linearGradient>
          </defs>
          <circle
            className="circle-1"
            cx="50%"
            cy="50%"
            r="73"
            strokeLinecap="round"
            style={{
              strokeDashoffset: (100 - activePercentage) * 4.3,
            }}
            fill="none"
            stroke="url(#BarCircleGradient)"
            strokeWidth="27px"
            strokeDasharray="445"
          />
        </svg>
      </div>
    </div>
  );
};

export default CircularProgressChart;
