import React from "react";

export type Props = {
  visible: boolean;
};

function leave() {
  window.localStorage.clear();
}

function LeaveForm(props: Props) {
  if (props.visible) {
    return (
      <form id="leaveForm">
        <button type="submit" onClick={leave}>
          Leave Party
        </button>
      </form>
    );
  } else {
    return <div></div>;
  }
}

export default LeaveForm;
