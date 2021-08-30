import Router from "next/router";

import { useEffect } from "react";

export default function Auction() {
  useEffect(() => {
    Router.push({
      pathname: "/teams",
    });
  }, []);

  return null;
}
