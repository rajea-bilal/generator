import React from "react";

export default function Plunk(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img src="/plunk.png" alt="Plunk logo" className="h-8 w-auto" {...props} />
  );
} 