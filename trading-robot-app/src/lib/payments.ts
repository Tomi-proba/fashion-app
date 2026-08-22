// Every place money changes hands (robot purchase fee, capital top-up) goes
// through here — right now both are mocked, instant, play-money operations.
// This is the single swap point for turning this into a real payment flow:
// replace the body of these two functions with a real provider call (e.g. a
// Stripe PaymentIntent confirmed by a backend webhook), keep the same
// PaymentResult shape, and every caller (lib/useGame.ts) keeps working
// unchanged. Note that a *real* version cannot stay client-only: you'd need a
// backend to create/confirm charges and to hold the operator's revenue and
// users' balances server-side instead of in localStorage.

export interface PaymentResult {
  ok: boolean;
  message?: string;
}

// Charges the one-time, non-refundable robot fee. In the real product this
// is the operator's revenue for "selling" the robot.
export async function purchaseRobotFee(_amount: number): Promise<PaymentResult> {
  return { ok: true };
}

// Charges the capital the user wants the robot to trade with.
export async function depositCapital(_amount: number): Promise<PaymentResult> {
  return { ok: true };
}
