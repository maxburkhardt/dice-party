import React from "react";

export type Props = {
  entries: JSX.Element[];
};

function RollLog(props: Props) {
  return <div>{props.entries}</div>;
}

export default RollLog;
