// Declare the global `window.snap` injected by Snap.js script
interface SnapCallbackResult {
  order_id: string;
  payment_type: string;
  transaction_status: string;
  fraud_status?: string;
}

interface SnapCallbacks {
  onSuccess?: (result: SnapCallbackResult) => void;
  onPending?: (result: SnapCallbackResult) => void;
  onError?: (result: SnapCallbackResult) => void;
  onClose?: () => void;
}

interface Window {
  snap: {
    pay: (snapToken: string, callbacks: SnapCallbacks) => void;
    hide: () => void;
  };
}