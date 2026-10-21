/** Fixed backdrop: neutral canvas, a very faint grid and paper grain. Pure CSS. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div className="canvas-grid absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgb(255_255_255/0.7),transparent_70%)]" />
      <div className="canvas-grain absolute inset-0 opacity-[0.035] mix-blend-multiply" />
    </div>
  );
}
