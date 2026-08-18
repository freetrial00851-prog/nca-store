import { Suspense } from "react";
import { CheckoutSuccessContent } from "./success-content";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Processing your order...</p>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
