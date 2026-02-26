// app/cart/_components/CustomBouquetPlaceholder.tsx

export default function CustomBouquetPlaceholder() {
    return (
        <div className="custom-bouquet-preview">
            <svg
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "88%", height: "88%", position: "relative", zIndex: 1 }}
            >
                <img src="/images/placeholder.jpg" alt="Custom Bouquet" style={{ width: "88%", height: "88%", position: "relative", zIndex: 1 }} />
                {/* Wrap / cone */}
                <path
                    d="M38 78 L60 112 L82 78 Z"
                    fill="#D4956A"
                    opacity="0.6"
                />
                <path
                    d="M38 78 L60 112 L71 78 Z"
                    fill="#C4876A"
                    opacity="0.5"
                />
                {/* Wrap texture lines */}
                <path d="M47 88 Q60 84 73 88" stroke="#A8674F" strokeWidth="0.8" opacity="0.4" fill="none" />
                <path d="M44 95 Q60 91 76 95" stroke="#A8674F" strokeWidth="0.8" opacity="0.3" fill="none" />

                {/* Ribbon bow */}
                <ellipse cx="52" cy="78" rx="9" ry="4" fill="#C4876A" opacity="0.8" transform="rotate(-20 52 78)" />
                <ellipse cx="68" cy="78" rx="9" ry="4" fill="#C4876A" opacity="0.8" transform="rotate(20 68 78)" />
                <circle cx="60" cy="78" r="4.5" fill="#A8674F" opacity="0.9" />

                {/* Stems */}
                <path d="M60 78 L58 58" stroke="#7A9E7E" strokeWidth="2" strokeLinecap="round" />
                <path d="M60 78 L50 55" stroke="#7A9E7E" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M60 78 L70 56" stroke="#7A9E7E" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M60 78 L43 62" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M60 78 L77 63" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />

                {/* Leaves */}
                <path d="M53 68 Q46 63 44 56 Q51 58 53 68Z" fill="#7A9E7E" opacity="0.7" />
                <path d="M67 69 Q74 64 76 57 Q69 59 67 69Z" fill="#7A9E7E" opacity="0.7" />

                {/* Center large rose */}
                <circle cx="58" cy="46" r="12" fill="#E8A0A0" opacity="0.25" />
                <path d="M58 38 Q62 40 63 45 Q62 50 58 52 Q54 50 53 45 Q54 40 58 38Z" fill="#D4788A" opacity="0.9" />
                <path d="M52 40 Q54 44 54 48 Q57 52 60 50 Q56 46 58 40 Q55 38 52 40Z" fill="#C4627A" opacity="0.8" />
                <path d="M64 40 Q62 44 62 48 Q59 52 56 50 Q60 46 58 40 Q61 38 64 40Z" fill="#C4627A" opacity="0.8" />
                <path d="M55 36 Q58 33 61 36 Q62 41 58 43 Q54 41 55 36Z" fill="#E8909A" opacity="0.9" />
                <circle cx="58" cy="44" r="4" fill="#B85070" opacity="0.6" />

                {/* Left flower – pink */}
                <circle cx="43" cy="55" r="8" fill="#F0B8C8" opacity="0.2" />
                <path d="M43 49Q46 51 46 55Q46 59 43 61Q40 59 40 55Q40 51 43 49Z" fill="#F0A0BC" opacity="0.85" />
                <path d="M37 52Q40 53 41 56Q40 59 43 60Q40 57 37 57Q35 55 37 52Z" fill="#E890AC" opacity="0.8" />
                <path d="M49 52Q46 53 45 56Q46 59 43 60Q46 57 49 57Q51 55 49 52Z" fill="#E890AC" opacity="0.8" />
                <circle cx="43" cy="55" r="3" fill="#C4607A" opacity="0.7" />

                {/* Right flower – peach/coral */}
                <circle cx="73" cy="56" r="8" fill="#F5C8A0" opacity="0.2" />
                <path d="M73 50Q76 52 76 56Q76 60 73 62Q70 60 70 56Q70 52 73 50Z" fill="#F0B080" opacity="0.85" />
                <path d="M67 53Q70 54 71 57Q70 60 73 61Q70 58 67 58Q65 56 67 53Z" fill="#E09A70" opacity="0.8" />
                <path d="M79 53Q76 54 75 57Q76 60 73 61Q76 58 79 58Q81 56 79 53Z" fill="#E09A70" opacity="0.8" />
                <circle cx="73" cy="56" r="3" fill="#C07040" opacity="0.7" />

                {/* Small accent flowers */}
                {/* Far left – white */}
                <circle cx="34" cy="65" r="5.5" fill="#FDE8E0" opacity="0.5" />
                <path d="M34 60Q37 62 37 65Q37 68 34 70Q31 68 31 65Q31 62 34 60Z" fill="#FDF0E8" opacity="0.9" />
                <circle cx="34" cy="65" r="2.5" fill="#E8C0A0" opacity="0.7" />

                {/* Far right – lavender */}
                <circle cx="82" cy="66" r="5.5" fill="#E8D8F8" opacity="0.5" />
                <path d="M82 61Q85 63 85 66Q85 69 82 71Q79 69 79 66Q79 63 82 61Z" fill="#EDE0F8" opacity="0.9" />
                <circle cx="82" cy="66" r="2.5" fill="#C0A0D8" opacity="0.7" />

                {/* Baby's breath dots */}
                {[
                    [46, 40], [53, 32], [63, 33], [70, 42], [48, 50], [68, 50],
                    [56, 30], [40, 48], [76, 49], [60, 28]
                ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="1.8" fill="white" opacity="0.85" />
                ))}
                {[
                    [46, 40], [53, 32], [63, 33], [70, 42]
                ].map(([cx, cy], i) => (
                    <circle key={`g${i}`} cx={cx} cy={cy} r="1.2" fill="#D8F0D8" opacity="0.6" />
                ))}
            </svg>
            <div className="bouquet-shimmer" />
        </div>
    );
}