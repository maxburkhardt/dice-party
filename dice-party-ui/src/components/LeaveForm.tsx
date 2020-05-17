import React from "react";

export type Props = {
  visible: boolean;
  leavePartyCallback: () => void;
};

function LeaveForm(props: Props): JSX.Element {
  function leave(event: React.SyntheticEvent): void {
    event.preventDefault();
    props.leavePartyCallback();
  }

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
