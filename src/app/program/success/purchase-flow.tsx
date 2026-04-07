"use client";

import { PurchaseVerifier } from "./purchase-verifier";
import { SuccessContent } from "./success-content";

export function PurchaseFlow() {
  return (
    <PurchaseVerifier>
      {(status) => <SuccessContent status={status} />}
    </PurchaseVerifier>
  );
}
