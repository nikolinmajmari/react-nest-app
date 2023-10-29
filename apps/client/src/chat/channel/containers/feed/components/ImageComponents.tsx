import React from "react";


export function MessageContentImage(props: React.HTMLProps<HTMLImageElement>) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img loading={'lazy'} {...props} className="w-56 md:w-64 lg:w-72 z-0 object-cover h-32 rounded-lg"/>;
}
