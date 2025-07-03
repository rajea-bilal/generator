import React from "react";

export default function Plunk(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="https://favicon.im/www.useplunk.com"
      alt="Plunk logo"
      className="w-8 h-8"
      {...props}
    />
  );
} 