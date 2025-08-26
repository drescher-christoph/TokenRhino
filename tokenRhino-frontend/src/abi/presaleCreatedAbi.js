export const presaleCreatedEventAbi = {
  name: "PresaleCreated",
  type: "event",
  inputs: [
    { type: "address", name: "creator", indexed: true },
    { type: "address", name: "presale", indexed: false },
    { type: "address", name: "token", indexed: false },
  ],
};