import React, { useState, useEffect, useRef } from "react";
import { useMidtrans } from "../hooks/useMidtrans";

/* ─────────────────────────────────────────────
   Order data
────────────────────────────────────────────── */
const ORDER_PAYLOAD = {
  order_id: `ORDER-${Date.now()}`,
  amount: 150000,
  customer_name: "Budi Santoso",
  customer_email: "budi@example.com",
  customer_phone: "08123456789",
  items: [
    { id: "ITEM-1", name: "Kaos Polos", price: 75000, quantity: 1, category: "Atasan" },
    { id: "ITEM-2", name: "Celana Chino", price: 75000, quantity: 1, category: "Bawahan" },
  ],
};

/* ─────────────────────────────────────────────
   Inline styles (no external CSS deps)
────────────────────────────────────────────── */
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0b0a09;
    --surface:  #141210;
    --card:     #1c1a17;
    --border:   #2e2b26;
    --gold:     #c9a84c;
    --gold-dim: #8a6e2e;
    --text:     #f0ebe2;
    --muted:    #6b6357;
    --danger:   #d96c4a;
    --success:  #5c9e6e;
    --pending:  #c8943a;
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .45; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .page { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── NAV ── */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 48px;
    border-bottom: 1px solid var(--border);
    animation: fadeUp .5s ease both;
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; letter-spacing: .12em;
    color: var(--text);
    display: flex; align-items: center; gap: 10px;
  }
  .nav-logo-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0;
  }
  .nav-right { display: flex; align-items: center; gap: 20px; }
  .demo-badge {
    font-size: 10px; font-weight: 700; letter-spacing: .15em;
    text-transform: uppercase; color: var(--gold);
    border: 1px solid var(--gold-dim); border-radius: 2px;
    padding: 4px 10px;
  }
  .cart-icon {
    display: flex; align-items: center; gap: 7px;
    color: var(--muted); font-size: 13px;
  }
  .cart-count {
    background: var(--gold); color: #000;
    font-size: 10px; font-weight: 700;
    border-radius: 50%; width: 18px; height: 18px;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── MAIN ── */
  .main {
    flex: 1; display: flex; align-items: flex-start;
    justify-content: center;
    padding: 64px 48px;
    gap: 40px;
  }

  /* ── LEFT PANEL ── */
  .panel-left {
    flex: 1; max-width: 560px;
    animation: fadeUp .55s ease .1s both;
  }
  .section-label {
    font-size: 10px; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 28px;
    display: flex; align-items: center; gap: 14px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── CART ITEMS ── */
  .cart-items { display: flex; flex-direction: column; gap: 2px; }

  .cart-item {
    display: flex; align-items: center; gap: 20px;
    padding: 20px; background: var(--card);
    border: 1px solid var(--border);
    transition: border-color .2s, transform .2s;
    position: relative; overflow: hidden;
  }
  .cart-item:first-child { border-radius: 10px 10px 2px 2px; }
  .cart-item:last-child  { border-radius: 2px 2px 10px 10px; }
  .cart-item:hover { border-color: var(--gold-dim); transform: translateX(2px); }

  .item-thumb {
    width: 70px; height: 70px; border-radius: 6px;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
    position: relative; overflow: hidden;
  }
  .item-thumb::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(201,168,76,.08));
  }

  .item-info { flex: 1; }
  .item-cat  { font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .item-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400; color: var(--text); }
  .item-qty  { font-size: 12px; color: var(--muted); margin-top: 4px; }

  .item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600;
    color: var(--text); text-align: right;
  }
  .item-price span { font-size: 12px; font-family: 'Syne', sans-serif; color: var(--muted); font-weight: 400; }

  /* ── RIGHT PANEL ── */
  .panel-right {
    width: 340px; flex-shrink: 0;
    animation: fadeUp .55s ease .2s both;
  }

  .order-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .order-header {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .order-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: var(--text);
  }
  .order-id { font-size: 11px; color: var(--muted); letter-spacing: .05em; }

  .order-lines { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }

  .order-line { display: flex; align-items: center; justify-content: space-between; }
  .order-line-label { font-size: 13px; color: var(--muted); }
  .order-line-value { font-size: 13px; color: var(--text); }

  .order-divider { height: 1px; background: var(--border); margin: 4px 0; }

  .order-total {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px 24px;
  }
  .order-total-label { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .order-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 600; color: var(--gold);
  }
  .order-total-value sup { font-size: 14px; vertical-align: super; margin-right: 3px; }

  /* ── CHECKOUT BTN ── */
  .checkout-wrap { padding: 0 24px 24px; }

  .btn-checkout {
    width: 100%; padding: 16px 24px;
    background: var(--gold);
    color: #0b0a09;
    border: none; border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background .2s, transform .15s, box-shadow .2s;
    position: relative; overflow: hidden;
  }
  .btn-checkout::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    background-size: 400px 100%;
    opacity: 0;
    transition: opacity .3s;
  }
  .btn-checkout:hover { background: #d4b45c; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,.25); }
  .btn-checkout:hover::before { opacity: 1; animation: shimmer 1.2s infinite; }
  .btn-checkout:active { transform: translateY(0); }
  .btn-checkout:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-loading-ring {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(0,0,0,.3);
    border-top-color: #0b0a09;
    animation: spin .7s linear infinite;
  }

  /* ── STATUS STATES ── */
  .status-card {
    padding: 24px; text-align: center;
    animation: slideIn .3s ease;
  }
  .status-icon { font-size: 36px; margin-bottom: 12px; }
  .status-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; margin-bottom: 8px;
  }
  .status-meta { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
  .status-meta strong { color: var(--text); }

  .btn-back {
    margin-top: 16px; width: 100%;
    padding: 11px; border-radius: 6px;
    border: 1px solid var(--border); background: transparent;
    color: var(--muted); font-family: 'Syne', sans-serif;
    font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .btn-back:hover { border-color: var(--gold-dim); color: var(--text); }

  /* ── ERROR ── */
  .error-bar {
    margin: 0 24px 12px;
    padding: 10px 14px; border-radius: 6px;
    background: rgba(217,108,74,.1); border: 1px solid rgba(217,108,74,.3);
    font-size: 12px; color: #e8846a;
    display: flex; align-items: flex-start; gap: 8px;
    animation: slideIn .25s ease;
  }

  /* ── SECURE BADGE ── */
  .secure-row {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 0 24px 20px;
    font-size: 11px; color: var(--muted);
  }

  /* ── FOOTER NOTE ── */
  .footer-note {
    text-align: center; padding: 32px 48px;
    border-top: 1px solid var(--border);
    font-size: 11px; color: var(--muted); letter-spacing: .05em;
    animation: fadeUp .5s ease .4s both;
  }
  .footer-note a { color: var(--gold-dim); text-decoration: none; }

  @media (max-width: 820px) {
    .main { flex-direction: column; align-items: center; padding: 40px 20px; }
    .panel-right { width: 100%; max-width: 560px; }
    .nav { padding: 18px 20px; }
  }
`;

/* ─────────────────────────────────────────────
   CheckoutButton — restyled, logic preserved
────────────────────────────────────────────── */
function CheckoutButton() {
  const { pay, status, result, error, reset } = useMidtrans();

  if (status === "success") {
    return (
      <div className="status-card">
        <div className="status-icon">✅</div>
        <div className="status-title" style={{ color: "var(--success)" }}>Payment Successful</div>
        <p className="status-meta">Order ID: <strong>{result?.orderId}</strong></p>
        <p className="status-meta">Method: <strong>{result?.paymentType}</strong></p>
        <button className="btn-back" onClick={reset}>Make Another Payment</button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="status-card">
        <div className="status-icon">⏳</div>
        <div className="status-title" style={{ color: "var(--pending)" }}>Payment Pending</div>
        <p className="status-meta">Order ID: <strong>{result?.orderId}</strong></p>
        <p className="status-meta">Complete via <strong>{result?.paymentType}</strong></p>
        <button className="btn-back" onClick={reset}>Back</button>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="error-bar">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
      <div className="checkout-wrap">
        <button
          className="btn-checkout"
          onClick={() => pay(ORDER_PAYLOAD)}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <span className="btn-loading-ring" />
              Processing…
            </>
          ) : (
            <>
              <span>Proceed to Payment</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </div>
      <div className="secure-row">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L2 3.5v4C2 11 5 14 8 15c3-1 6-4 6-7.5v-4L8 1z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        Secured by Midtrans · SSL Encrypted
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Page
────────────────────────────────────────────── */
export default function CheckoutDemo() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const fmt = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
      .format(n).replace("Rp", "IDR");

  const subtotal = ORDER_PAYLOAD.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 0;
  const total    = subtotal + shipping;

  const itemEmoji = ["👕", "👖"];

  if (!mounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fonts }} />

      <div className="page">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-dot" />
            WARUNG DIGITAL
          </div>
          <div className="nav-right">
            <span className="demo-badge">Live Demo</span>
            <div className="cart-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="cart-count">2</span>
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <main className="main">
          {/* LEFT — Cart Items */}
          <div className="panel-left">
            <div className="section-label">Your Cart · 2 Items</div>

            <div className="cart-items">
              {ORDER_PAYLOAD.items.map((item, i) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-thumb">{itemEmoji[i]}</div>
                  <div className="item-info">
                    <div className="item-cat">{item.category}</div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">
                    <span>IDR </span>{(item.price).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="panel-right">
            <div className="section-label">Order Summary</div>

            <div className="order-card">
              <div className="order-header">
                <div className="order-title">Invoice</div>
                <div className="order-id">{ORDER_PAYLOAD.order_id.slice(0, 18)}…</div>
              </div>

              <div className="order-lines">
                {ORDER_PAYLOAD.items.map((item) => (
                  <div className="order-line" key={item.id}>
                    <span className="order-line-label">{item.name} ×{item.quantity}</span>
                    <span className="order-line-value">
                      {item.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="order-divider" />
                <div className="order-line">
                  <span className="order-line-label">Subtotal</span>
                  <span className="order-line-value">{subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="order-line">
                  <span className="order-line-label">Shipping</span>
                  <span className="order-line-value" style={{ color: "var(--success)" }}>Free</span>
                </div>
              </div>

              <div className="order-total">
                <span className="order-total-label">Total</span>
                <span className="order-total-value">
                  <sup>IDR</sup>{total.toLocaleString("id-ID")}
                </span>
              </div>

              <CheckoutButton />
            </div>

            {/* Customer info hint */}
            <div style={{ marginTop: 16, padding: "14px 18px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                </svg>
                <span style={{ color: "var(--text)", fontWeight: 600, letterSpacing: ".06em" }}>Demo Customer</span>
              </div>
              <div>{ORDER_PAYLOAD.customer_name} · {ORDER_PAYLOAD.customer_email}</div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="footer-note">
          Portfolio demo by <a href="#">Taufiq</a> — Midtrans Payment Gateway Integration ·
          Built with React + TypeScript
        </footer>
      </div>
    </>
  );
}