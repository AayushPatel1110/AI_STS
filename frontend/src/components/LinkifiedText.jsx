import React from 'react';

const LinkifiedText = ({ text }) => {
  if (!text) return null;

  // Regex to match URLs starting with http:// or https://
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split text by regex, keeping the matches in the array
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:text-primary/80 hover:no-underline break-all transition-all bg-primary/20 px-1 rounded-md"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
};

export default LinkifiedText;
