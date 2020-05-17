import React from "react";

export type Props = {
  visible: boolean;
  currentParty?: string;
  linkParty: string | null;
  dismissCallback: () => void;
  leavePartyCallback: () => void;
  setPartyIdInUrlCallback: (partyId: string) => void;
};

function ChangePartyModal(props: Props): JSX.Element {
  function handleDismiss(event: React.SyntheticEvent): void {
    event.preventDefault();
    props.setPartyIdInUrlCallback(props.currentParty || "");
    props.dismissCallback();
  }

  function handleLeaveParty(event: React.SyntheticEvent): void {
    event.preventDefault();
    props.leavePartyCallback();
  }

  if (props.visible) {
    return (
      <div className="changePartyModalBackground">
        <div className="changePartyModal">
          <p>
            Your current party is {props.currentParty}, but you just followed a
            link to join {props.linkParty}. Would you like to leave your current
            party to join the new one?
          </p>
          <form>
            <button
              type="submit"
              id="stayInPartyModalButton"
              onClick={handleDismiss}
            >
              Stay In Current Party
            </button>
            <button
              type="submit"
              id="leavePartyModalButton"
              onClick={handleLeaveParty}
            >
              Leave Party
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default ChangePartyModal;
