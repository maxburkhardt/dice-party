import React from "react";

type Props = {
  visible: boolean;
  message: string;
};

function Alert(props: Props) {
  if (props.visible) {
    return <div className="alert">{props.message}</div>;
  } else {
    return <div></div>;
  }
}

export default Alert;
