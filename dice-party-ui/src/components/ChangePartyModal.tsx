import React from "react";

export type Props = {
  visible: boolean;
  modalText: string;
};

function ChangePartyModal(props: Props) {
  if (props.visible) {
    return (
      <div className="changePartyModalBackground">
        <div className="changePartyModal">
          <p>{props.modalText}</p>
          <form>
            <button type="submit" id="stayInPartyModalButton">
              Stay In Current Party
            </button>
            <button type="submit" id="leavePartyModalButton">
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
