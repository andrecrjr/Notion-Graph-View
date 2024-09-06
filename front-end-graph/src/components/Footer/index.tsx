import React from "react";

type Props = {};

export const Footer = (props: Props) => {
  return (
    <footer className="mt-auto mb-12 text-center ">
      <p className="w-8/12 mx-auto">
         This project was initially developed as an MVP in Alpha Version, so it may be slow and a
        bit buggy due to being hosted on a hobby server. However, it is
        open-source, and contributions are welcome. You can contribute to the
        project on{" "}
        <b className="underline">
          <a href="https://github.com/andrecrjr/Notion-Graph-View">Github</a>
        </b>
        .
      </p>
    </footer>
  );
};
