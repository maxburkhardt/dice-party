import React from "react";
import PartyApi from "./partyApi";

const PartyApiContext = React.createContext<PartyApi | null>(null);

export default PartyApiContext;
