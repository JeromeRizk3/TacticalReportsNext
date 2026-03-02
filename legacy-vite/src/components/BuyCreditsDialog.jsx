import { CREDIT_PACKS } from "../data/creditPacks.js";

export function BuyCreditsDialog({ open, onClose, onBuy }) {
  if (!open) return null;

  return (
    <div
      className="modal__backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal">
        <div className="modal__top">
          <div>
            <div className="modal__title">Buy credits</div>
          </div>
          <button className="btn btn--ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="packs">
          {CREDIT_PACKS.map((p) => (
            <button
              key={p.id}
              className="pack"
              onClick={() => {
                onBuy?.(p.credits);
                onClose?.();
              }}
            >
              <div className="pack__name">{p.name}</div>
              <div className="pack__credits">{p.credits} credits</div>
              <div className="pack__price">${p.price}</div>
            </button>
          ))}
        </div>

        <div className="modal__bottom">
          <button className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
