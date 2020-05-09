import React from "react";

export type Props = {
  visible: boolean;
  partyId: string;
  name: string;
};

function RollForm(props: Props) {
  if (props.visible) {
    return (
      <form>
        <p>
          Current party: {props.partyId}
          <br />
          Your name: {props.name}
        </p>
        <input
          name="description"
          type="text"
          maxLength={280}
          placeholder="Roll description"
          autoFocus={true}
        />
        <button type="submit">Roll!</button>
      </form>
    );
  } else {
    return <div></div>;
  }
}

export default RollForm;
