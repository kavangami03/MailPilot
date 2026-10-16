// The entry loader resolves this as it starts to open, so the hero's entrance plays as it's revealed.
let resolve!: () => void;
const loaded = new Promise<void>((r) => (resolve = r));

export const whenLoaded = () => loaded;
export const markLoaded = () => resolve();
