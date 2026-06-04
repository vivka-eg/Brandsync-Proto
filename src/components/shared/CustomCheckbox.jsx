"use client";

import { Checkbox, useTheme } from "@mui/material";
import { Check, Minus } from "phosphor-react";

const CustomCheckbox = ({ 
  checked, 
  onChange, 
  disabled, 
  error, 
  indeterminate = false 
}) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      indeterminate={indeterminate}
      disableRipple
      icon={<SquareBox />}
      checkedIcon={<SquareBox checked />}
      indeterminateIcon={<SquareBox indeterminate />}
      sx={(theme) => ({
        p: 0,
        color: error
          ? "#D92D20"
          : theme.palette.mode === "dark"
          ? "#667085"
          : "#D0D5DD",
        "&:hover": {
          backgroundColor: "transparent",
          color: error
            ? "#D92D20"
            : theme.palette.mode === "dark"
            ? "#344054"
            : "#98A2B3",
        },
        "&.Mui-checked, &.MuiCheckbox-indeterminate": {
          color: error ? "#D92D20" : theme.palette.grey[900],
          "&:hover": {
            backgroundColor: "transparent",
            color: error ? "#D92D20" : theme.palette.grey[800],
          },
        },
        "&.Mui-disabled": {
          color: error ? "#D92D20" : theme.palette.grey[400],
        },
        "&.Mui-focusVisible": {
          outline: `2px solid ${
            error ? "#D92D20" : theme.palette.primary.main
          }`,
          outlineOffset: "3px",
        },
      })}
    />
  );
};

const SquareBox = ({ checked, indeterminate }) => {
  const theme = useTheme();
  
  const isActive = checked || indeterminate;
  
  return (
    <span
      style={{
        display: "inline-flex",
        width: 20,
        height: 20,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isActive 
          ? theme.palette.action.active 
          : "transparent",
        border: isActive 
          ? "none" 
          : "1.5px solid currentColor",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      {checked && (
        <Check 
          size={14} 
          color="#fff" 
          weight="bold"
          style={{
            animation: "checkIn 0.2s ease-in-out",
          }}
        />
      )}
      {indeterminate && (
        <Minus 
          size={12} 
          color="#fff" 
          weight="bold"
          style={{
            animation: "minusIn 0.2s ease-in-out",
          }}
        />
      )}
      
      <style jsx>{`
        @keyframes checkIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes minusIn {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
};

export default CustomCheckbox;