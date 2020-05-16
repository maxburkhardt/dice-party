import React from "react";
import { PlayerState, getPlayerState } from "../localState";

export type Props = {
  visible: boolean;
  setPlayerStateCallback: (newState: PlayerState) => void;
};

function LeaveForm(props: Props) {
  function leave(event: React.SyntheticEvent) {
    event.preventDefault();
    window.localStorage.clear();
    props.setPlayerStateCallback(getPlayerState());
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
