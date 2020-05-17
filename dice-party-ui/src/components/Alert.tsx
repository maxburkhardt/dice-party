import React from "react";

type Props = {
  visible: boolean;
  message: string | null;
};

function Alert(props: Props): JSX.Element {
  if (props.visible) {
    return <div className="alert">{props.message}</div>;
  } else {
    return <div></div>;
  }
}

export default Alert;
