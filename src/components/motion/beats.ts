// Shared by the server-rendered case study and the client rail; a constant exported from a "use client" module would
// reach server code as a client reference instead of the array.
export const BEATS = ["Problem", "Build", "Proof"] as const;
