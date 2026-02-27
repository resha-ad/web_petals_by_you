// app/cart/_components/CheckoutModal.tsx
"use client";

import { useState } from "react";

export interface CheckoutFormData {
    recipientName: string;
    recipientPhone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    paymentMethod: "cash_on_delivery";
    notes: string;
}

interface Props {
    user: { firstName?: string; lastName?: string; email?: string } | null;
    grandTotal: number;
    onConfirm: (data: CheckoutFormData) => void;
    onClose: () => void;
    isSubmitting: boolean;
}

const NEPAL_CITIES = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar",
    "Birgunj", "Butwal", "Dharan", "Hetauda", "Bharatpur",
    "Itahari", "Janakpur", "Nepalgunj", "Dhangadhi", "Tulsipur",
];

type Step = "recipient" | "address" | "confirm";

const STEPS: { key: Step; label: string }[] = [
    { key: "recipient", label: "Recipient" },
    { key: "address", label: "Address" },
    { key: "confirm", label: "Confirm" },
];

// ─── SVG icon set ─────────────────────────────────────────────────────────────

const Ico = {
    user: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    ),
    phone: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
    ),
    mail: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
    ),
    pin: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    ),
    locate: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6V9.75A6 6 0 0 0 6 9.75v3a6 6 0 0 0 6 6Zm0 0v2.25M9.75 12H7.5m9 0H14.25M12 9.75V7.5" />
        </svg>
    ),
    lock: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    ),
    cash: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
    ),
    truck: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    ),
    check: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    ),
    arrow: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    ),
    warn: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
    ),
    note: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
    ),
};

// ─── Validation helpers ───────────────────────────────────────────────────────

const ONLY_NUMBERS = /^\d+$/;
const HAS_LETTER = /[a-zA-Z\u0900-\u097F]/; // latin + Devanagari letters
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+977[\s-]?)?[0-9]{9,10}$/;

function validateRecipient(form: CheckoutFormData) {
    const e: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!form.recipientName.trim())
        e.recipientName = "Full name is required";
    else if (ONLY_NUMBERS.test(form.recipientName.trim()))
        e.recipientName = "Name cannot be numbers only";
    else if (!HAS_LETTER.test(form.recipientName))
        e.recipientName = "Name must contain letters";
    else if (form.recipientName.trim().length < 2)
        e.recipientName = "Name is too short";

    if (!form.recipientPhone.trim())
        e.recipientPhone = "Phone number is required";
    else if (!PHONE_RE.test(form.recipientPhone.replace(/\s/g, "")))
        e.recipientPhone = "Enter a valid Nepal number (e.g. 9812345678)";

    if (!form.email.trim())
        e.email = "Email is required";
    else if (!EMAIL_RE.test(form.email))
        e.email = "Enter a valid email address";

    return e;
}

function validateAddress(form: CheckoutFormData) {
    const e: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!form.street.trim())
        e.street = "Street address is required";
    else if (ONLY_NUMBERS.test(form.street.trim()))
        e.street = "Street cannot be numbers only — include the street name";

    if (!form.city.trim())
        e.city = "City is required";
    else if (ONLY_NUMBERS.test(form.city.trim()))
        e.city = "City cannot be numbers only";
    else if (!HAS_LETTER.test(form.city))
        e.city = "City must contain letters";

    if (form.state.trim() && ONLY_NUMBERS.test(form.state.trim()))
        e.state = "Province/state name cannot be numbers only";

    if (form.zip.trim() && !/^[0-9]{4,6}$/.test(form.zip.trim()))
        e.zip = "Enter a valid ZIP/postal code (4–6 digits)";

    return e;
}

// ─── Input style helper ───────────────────────────────────────────────────────

function inpStyle(hasError?: boolean): React.CSSProperties {
    return {
        width: "100%", padding: "10px 13px",
        border: `1.5px solid ${hasError ? "#FCA5A5" : "#E8D4D4"}`,
        borderRadius: 10, fontSize: "0.875rem", fontFamily: "inherit",
        outline: "none", boxSizing: "border-box", color: "#3D2314",
        background: "white", transition: "border-color 0.15s",
    };
}

const lbl: React.CSSProperties = {
    fontSize: "0.72rem", fontWeight: 600, color: "#9A7A7A",
    display: "block", marginBottom: 5,
    textTransform: "uppercase", letterSpacing: "0.05em",
};
const err: React.CSSProperties = { fontSize: "0.7rem", color: "#EF4444", marginTop: 3 };

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutModal({ user, grandTotal, onConfirm, onClose, isSubmitting }: Props) {
    const [step, setStep] = useState<Step>("recipient");
    const [locating, setLocating] = useState(false);
    const [locErr, setLocErr] = useState<string | null>(null);
    const [showCountryWarn, setShowCountryWarn] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

    const [form, setForm] = useState<CheckoutFormData>({
        recipientName: user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "",
        recipientPhone: "",
        email: user?.email ?? "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "Nepal",
        paymentMethod: "cash_on_delivery",
        notes: "",
    });

    const set = (k: keyof CheckoutFormData, v: string) => {
        setForm(f => ({ ...f, [k]: v }));
        setErrors(e => ({ ...e, [k]: undefined }));
    };

    // ── Geolocation ──────────────────────────────────────────────────────
    const handleLocate = () => {
        if (!navigator.geolocation) { setLocErr("Geolocation not supported by your browser."); return; }
        setLocating(true); setLocErr(null);
        navigator.geolocation.getCurrentPosition(
            async pos => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`,
                        { headers: { "Accept-Language": "en" } }
                    );
                    const data = await res.json();
                    const a = data.address ?? {};
                    if (a.country_code !== "np") {
                        setLocErr("Your location appears to be outside Nepal. We only deliver within Nepal.");
                        return;
                    }
                    const road = a.road ?? a.pedestrian ?? a.footway ?? "";
                    const suburb = a.suburb ?? a.neighbourhood ?? a.hamlet ?? "";
                    setForm(f => ({
                        ...f,
                        street: [road, suburb].filter(Boolean).join(", ") || f.street,
                        city: a.city ?? a.town ?? a.village ?? a.municipality ?? f.city,
                        state: a.state ?? a.province ?? f.state,
                        zip: a.postcode ?? f.zip,
                        country: "Nepal",
                    }));
                    setErrors(e => ({ ...e, street: undefined, city: undefined }));
                    setLocErr(null);
                } catch { setLocErr("Could not resolve your address. Please fill in manually."); }
                finally { setLocating(false); }
            },
            err => {
                setLocating(false);
                setLocErr(err.code === 1
                    ? "Location access denied. Allow location access or fill in the address manually."
                    : "Could not get your location. Please fill in the address manually.");
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    // ── Navigation ───────────────────────────────────────────────────────
    const handleNext = () => {
        if (step === "recipient") {
            const e = validateRecipient(form);
            if (Object.keys(e).length) { setErrors(e); return; }
            setStep("address");
        } else if (step === "address") {
            const e = validateAddress(form);
            if (Object.keys(e).length) { setErrors(e); return; }
            setStep("confirm");
        }
    };

    const handleBack = () => {
        if (step === "address") setStep("recipient");
        else if (step === "confirm") setStep("address");
    };

    const stepIdx = STEPS.findIndex(s => s.key === step);

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(20,10,5,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 16, backdropFilter: "blur(2px)",
        }}>
            <div style={{
                background: "white", borderRadius: 20, width: "100%", maxWidth: 480,
                boxShadow: "0 32px 80px rgba(107,63,42,0.22)",
                display: "flex", flexDirection: "column", maxHeight: "92vh", overflow: "hidden",
            }}>

                {/* ── Header ── */}
                <div style={{ padding: "22px 24px 0", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h2 style={{ margin: 0, fontFamily: "Georgia, serif", color: "#3D2314", fontSize: "1.2rem" }}>
                            Place Order
                        </h2>
                        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9A7A7A", lineHeight: 1, padding: 4, fontSize: "1.1rem" }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Step progress */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
                        {STEPS.map((s, i) => (
                            <div key={s.key} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: i < stepIdx ? "#6B3F2A" : i === stepIdx ? "#E8B4B8" : "#F3E6E6",
                                        transition: "all 0.2s",
                                    }}>
                                        {i < stepIdx
                                            ? <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                            : <span style={{ fontSize: "0.7rem", fontWeight: 700, color: i === stepIdx ? "white" : "#C0A090" }}>{i + 1}</span>
                                        }
                                    </div>
                                    <span style={{ fontSize: "0.58rem", color: i === stepIdx ? "#6B3F2A" : "#B0A0A0", fontWeight: i === stepIdx ? 700 : 400 }}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ flex: 1, height: 1.5, background: i < stepIdx ? "#6B3F2A" : "#F3E6E6", margin: "0 6px", marginBottom: 16, transition: "background 0.2s" }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Scrollable body ── */}
                <div style={{ padding: "0 24px", overflowY: "auto", flex: 1 }}>

                    {/* Step 1 — Recipient */}
                    {step === "recipient" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
                            <Field label="Full Name" icon={Ico.user} error={errors.recipientName}>
                                <input
                                    value={form.recipientName}
                                    onChange={e => set("recipientName", e.target.value)}
                                    placeholder="Who will receive this order?"
                                    style={inpStyle(!!errors.recipientName)}
                                />
                            </Field>
                            <Field label="Phone Number" icon={Ico.phone} error={errors.recipientPhone}>
                                <input
                                    value={form.recipientPhone}
                                    onChange={e => set("recipientPhone", e.target.value)}
                                    placeholder="98XXXXXXXX"
                                    type="tel"
                                    style={inpStyle(!!errors.recipientPhone)}
                                />
                            </Field>
                            <Field label="Email Address" icon={Ico.mail} error={errors.email}>
                                <input
                                    value={form.email}
                                    onChange={e => set("email", e.target.value)}
                                    placeholder="Order confirmation will be sent here"
                                    type="email"
                                    style={inpStyle(!!errors.email)}
                                />
                            </Field>
                        </div>
                    )}

                    {/* Step 2 — Address */}
                    {step === "address" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
                            {/* Locate button */}
                            <button type="button" onClick={handleLocate} disabled={locating} style={{
                                width: "100%", padding: "11px", borderRadius: 10,
                                border: "1.5px dashed #E8B4B8", background: "#FBF6F4",
                                color: "#6B3F2A", cursor: locating ? "wait" : "pointer",
                                fontSize: "0.85rem", fontFamily: "inherit", fontWeight: 500,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            }}>
                                {locating
                                    ? <><Spinner /> Detecting location…</>
                                    : <>{Ico.locate} Use My Current Location</>
                                }
                            </button>

                            {locErr && (
                                <div style={{ padding: "9px 12px", background: "#FEF2F2", borderRadius: 8, fontSize: "0.78rem", color: "#B91C1C", display: "flex", gap: 6, alignItems: "flex-start" }}>
                                    {Ico.warn} {locErr}
                                </div>
                            )}

                            {/* Country — locked */}
                            <Field label="Country" icon={Ico.pin}>
                                <div style={{ position: "relative" }}>
                                    <input
                                        value="Nepal"
                                        readOnly
                                        onClick={() => { setShowCountryWarn(true); setTimeout(() => setShowCountryWarn(false), 3500); }}
                                        style={{ ...inpStyle(), background: "#F9F5F3", color: "#9A7A7A", cursor: "default" }}
                                    />
                                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#C0A090", display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem" }}>
                                        {Ico.lock} Nepal only
                                    </span>
                                </div>
                                {showCountryWarn && (
                                    <div style={{ marginTop: 6, padding: "8px 12px", background: "#FEF3C7", borderRadius: 8, fontSize: "0.78rem", color: "#92400E", display: "flex", gap: 6, alignItems: "flex-start", border: "1px solid #FDE68A" }}>
                                        {Ico.warn} We currently deliver within Nepal only. International shipping is coming soon.
                                    </div>
                                )}
                            </Field>

                            <Field label="Street Address" icon={Ico.pin} error={errors.street}>
                                <input
                                    value={form.street}
                                    onChange={e => set("street", e.target.value)}
                                    placeholder="House no., street name, tole..."
                                    style={inpStyle(!!errors.street)}
                                />
                            </Field>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <Field label="City" error={errors.city}>
                                    <input
                                        list="np-cities"
                                        value={form.city}
                                        onChange={e => set("city", e.target.value)}
                                        placeholder="Kathmandu"
                                        style={inpStyle(!!errors.city)}
                                    />
                                    <datalist id="np-cities">{NEPAL_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                                </Field>
                                <Field label="Province / State" error={errors.state}>
                                    <input
                                        value={form.state}
                                        onChange={e => set("state", e.target.value)}
                                        placeholder="Bagmati"
                                        style={inpStyle(!!errors.state)}
                                    />
                                </Field>
                            </div>

                            <Field label="ZIP / Postal Code" error={errors.zip}>
                                <input
                                    value={form.zip}
                                    onChange={e => set("zip", e.target.value)}
                                    placeholder="44600"
                                    style={inpStyle(!!errors.zip)}
                                />
                            </Field>
                        </div>
                    )}

                    {/* Step 3 — Confirm */}
                    {step === "confirm" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
                            {/* Summary card */}
                            <div style={{ background: "#FBF6F4", borderRadius: 12, padding: "14px 16px" }}>
                                <p style={{ margin: "0 0 10px", fontSize: "0.68rem", fontWeight: 700, color: "#9A7A7A", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                    Delivering to
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.85rem", color: "#3D2314" }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <span style={{ color: "#9A7A7A" }}>{Ico.user}</span>
                                        <strong>{form.recipientName}</strong>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <span style={{ color: "#9A7A7A" }}>{Ico.phone}</span>
                                        {form.recipientPhone}
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <span style={{ color: "#9A7A7A" }}>{Ico.mail}</span>
                                        {form.email}
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 4, paddingTop: 10, borderTop: "1px solid #EDD8CC" }}>
                                        <span style={{ color: "#9A7A7A", marginTop: 1 }}>{Ico.pin}</span>
                                        <span>{form.street}, {form.city}{form.state ? `, ${form.state}` : ""}, Nepal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment — COD only */}
                            <div style={{ border: "2px solid #6B3F2A", borderRadius: 12, padding: "14px 16px", background: "#FBF0EE", display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ color: "#6B3F2A" }}>{Ico.cash}</span>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.875rem", color: "#3D2314" }}>Cash on Delivery</p>
                                    <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#9A7A7A" }}>Pay when your order arrives</p>
                                </div>
                                <span style={{ color: "#6B3F2A" }}>{Ico.check}</span>
                            </div>

                            {/* Notes */}
                            <Field label="Order Notes" icon={Ico.note}>
                                <textarea
                                    value={form.notes}
                                    onChange={e => set("notes", e.target.value)}
                                    placeholder="Special instructions, e.g. leave at reception"
                                    rows={2}
                                    style={{ ...inpStyle(), resize: "none" }}
                                />
                            </Field>

                            {/* Total */}
                            <div style={{ borderTop: "1.5px solid #F3E6E6", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.875rem", color: "#7A6060" }}>Total to pay on delivery</span>
                                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#3D2314" }}>Rs. {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div style={{ padding: "14px 24px 22px", flexShrink: 0, borderTop: "1px solid #F9F0EE" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                        {step !== "recipient" && (
                            <button onClick={handleBack} style={{
                                padding: "12px 20px", background: "white",
                                border: "1.5px solid #E8D4D4", borderRadius: 100,
                                cursor: "pointer", fontSize: "0.875rem", color: "#6B4E4E", fontFamily: "inherit",
                            }}>
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={step === "confirm" ? () => onConfirm(form) : handleNext}
                            disabled={isSubmitting}
                            style={{
                                flex: 1, padding: "12px",
                                background: isSubmitting ? "#C4A090" : "#6B3F2A",
                                border: "none", borderRadius: 100,
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                fontSize: "0.875rem", fontWeight: 600, color: "white",
                                fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                boxShadow: isSubmitting ? "none" : "0 4px 16px rgba(107,63,42,0.3)",
                            }}
                        >
                            {isSubmitting
                                ? <><Spinner /> Placing Order…</>
                                : step === "confirm"
                                    ? <>{Ico.truck} Place Order · Rs. {grandTotal.toLocaleString()}</>
                                    : <>Continue {Ico.arrow}</>
                            }
                        </button>
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Field({ label, icon, error, children }: {
    label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode;
}) {
    return (
        <div>
            <label style={lbl}>
                {icon && <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4, marginBottom: 1, color: "#C0A090" }}>{icon}</span>}
                {label}
            </label>
            {children}
            {error && <p style={err}>{error}</p>}
        </div>
    );
}

function Spinner() {
    return (
        <span style={{
            width: 13, height: 13,
            border: "2px solid rgba(255,255,255,0.35)",
            borderTopColor: "white", borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
            display: "inline-block", flexShrink: 0,
        }} />
    );
}