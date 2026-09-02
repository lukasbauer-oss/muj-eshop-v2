"use client";
import { useState } from "react";

type Produkt = {
  id: number;
  nazev: string;
  cena: number;
  kategorie: "obleceni" | "elektronika" | "gadgety";
  popis: string;
  emoji: string;
};

type KosikPolozka = {
  produkt: Produkt;
  pocet: number;
};

export default function Home() {
  const [zalozka, setZalozka] = useState<"obchod" | "kosik">("obchod");
  const [kategorie, setKategorie] = useState<"vse" | "obleceni" | "elektronika" | "gadgety">("vse");
  const [kosik, setKosik] = useState<KosikPolozka[]>([]);
  const [animovanyId, setAnimovanyId] = useState<number | null>(null);
  const [platbaProbehla, setPlatbaProbehla] = useState(false);

  const produkty: Produkt[] = [
    { id: 1, nazev: "Stylová mikina", cena: 1190, kategorie: "obleceni", popis: "Pohodlná bavlněná mikina s kapucí.", emoji: "🧥" },
    { id: 2, nazev: "Oversize tričko", cena: 490, kategorie: "obleceni", popis: "Kvalitní gramáž, moderní střih.", emoji: "👕" },
    { id: 3, nazev: "Bezdrátová sluchátka", cena: 1890, kategorie: "elektronika", popis: "Špičkový zvuk a potlačení hluku.", emoji: "🎧" },
    { id: 4, nazev: "Chytré hodinky", cena: 3490, kategorie: "elektronika", popis: "Sledování aktivit a zdravotních funkcí.", emoji: "⌚" },
    { id: 5, nazev: "Mini Dron 4K", cena: 4500, kategorie: "gadgety", popis: "Kompaktní dron s dlouhou výdrží baterie.", emoji: "🚁" },
    { id: 6, nazev: "LED Páska RGB", cena: 390, kategorie: "gadgety", popis: "Chytré osvětlení ovládané přes aplikaci.", emoji: "💡" },
  ];

  const pridatDoKosiku = (produkt: Produkt) => {
    setAnimovanyId(produkt.id);
    setTimeout(() => setAnimovanyId(null), 600);

    setKosik((puvodni) => {
      const existuje = puvodni.find((p) => p.produkt.id === produkt.id);
      if (existuje) {
        return puvodni.map((p) =>
          p.produkt.id === produkt.id ? { ...p, pocet: p.pocet + 1 } : p
        );
      }
      return [...puvodni, { produkt, pocet: 1 }];
    });
  };

  const zmenitPocet = (id: number, zmena: number) => {
    setKosik((puvodni) =>
      puvodni
        .map((p) => {
          if (p.produkt.id === id) {
            const novyPocet = p.pocet + zmena;
            return novyPocet > 0 ? { ...p, pocet: novyPocet } : null;
          }
          return p;
        })
        .filter(Boolean) as KosikPolozka[]
    );
  };

  const celkovaCena = kosik.reduce((sum, p) => sum + p.produkt.cena * p.pocet, 0);
  const celkovyPocetKusu = kosik.reduce((sum, p) => sum + p.pocet, 0);

  const filtrovaneProdukty = kategorie === "vse" 
    ? produkty 
    : produkty.filter((p) => p.kategorie === kategorie);

  const zaplatit = () => {
    setPlatbaProbehla(true);
    setTimeout(() => {
      setKosik([]);
      setPlatbaProbehla(false);
      setZalozka("obchod");
      alert("Platba byla úspěšně zpracována! Děkujeme za nákup v Obchod pro tebe.");
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", margin: 0 }}>
      <style>{`
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .animatovat { animation: pop 0.4s ease-in-out; }
        .karta { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .karta:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3); }
        .tlacitko { transition: all 0.2s ease; }
        .tlacitko:active { transform: scale(0.96); }
      `}</style>

      {/* HEADER */}
      <header style={{ backgroundColor: "#1e293b", borderBottom: "1px solid #334155", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", sticky: "top", position: "sticky", top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", background: "linear-gradient(to right, #3b82f6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Obchod pro tebe
        </h1>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <button onClick={() => setZalozka("obchod")} style={{ background: "none", border: "none", color: zalozka === "obchod" ? "#60a5fa" : "#94a3b8", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
            Obchod
          </button>
          <button onClick={() => setZalozka("kosik")} className={`tlacitko ${animovanyId ? "animatovat" : ""}`} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            🛒 Košík ({celkovyPocetKusu})
          </button>
        </div>
      </header>

      {/* OBSAH */}
      <main style={{ padding: "40px 20px", maxWidth: "1100px", margin: "0 auto" }}>
        {zalozka === "obchod" && (
          <div>
            {/* KATEGORIE ZÁLOŽKY */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
              {[
                { id: "vse", label: "Všechny produkty" },
                { id: "obleceni", label: "👕 Oblečení" },
                { id: "elektronika", label: "🎧 Elektronika" },
                { id: "gadgety", label: "🚁 Gadgety" },
              ].map((kat) => (
                <button
                  key={kat.id}
                  onClick={() => setKategorie(kat.id as any)}
                  style={{
                    backgroundColor: kategorie === kat.id ? "#3b82f6" : "#1e293b",
                    color: kategorie === kat.id ? "white" : "#94a3b8",
                    border: "1px solid #334155",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  {kat.label}
                </button>
              ))}
            </div>

            {/* KATALOG */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
              {filtrovaneProdukty.map((p) => (
                <div key={p.id} className="karta" style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "48px", marginBottom: "15px" }}>{p.emoji}</div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{p.nazev}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>{p.popis}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#38bdf8", marginBottom: "15px" }}>{p.cena} Kč</div>
                    <button
                      onClick={() => pridatDoKosiku(p)}
                      className={`tlacitko ${animovanyId === p.id ? "animatovat" : ""}`}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: animovanyId === p.id ? "#10b981" : "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700"
                      }}
                    >
                      {animovanyId === p.id ? "✓ Přidáno!" : "Přidat do košíku"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {zalozka === "kosik" && (
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "25px" }}>Nákupní košík</h2>
            {kosik.length === 0 ? (
              <div style={{ backgroundColor: "#1e293b", padding: "40px", borderRadius: "16px", textAlign: "center", border: "1px solid #334155" }}>
                <p style={{ color: "#94a3b8", fontSize: "18px" }}>Košík je prázdný.</p>
                <button onClick={() => setZalozka("obchod")} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
                  Prohlédnout produkty
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: "#1e293b", padding: "30px", borderRadius: "16px", border: "1px solid #334155" }}>
                {kosik.map((item) => (
                  <div key={item.produkt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", padding: "15px 0" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "18px" }}>{item.produkt.emoji} {item.produkt.nazev}</h4>
                      <p style={{ margin: "4px 0 0 0", color: "#94a3b8" }}>{item.produkt.cena} Kč / ks</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button onClick={() => zmenitPocet(item.produkt.id, -1)} style={{ backgroundColor: "#334155", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "6px", cursor: "pointer" }}>-</button>
                      <span style={{ fontWeight: "bold" }}>{item.pocet}</span>
                      <button onClick={() => zmenitPocet(item.produkt.id, 1)} style={{ backgroundColor: "#334155", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "6px", cursor: "pointer" }}>+</button>
                    </div>
                  </div>
                ))}

                {/* SUMÁŘ A SIMULACE PLATEBNÍ BRÁNY */}
                <div style={{ marginTop: "30px", borderTop: "2px solid #334155", paddingTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <span style={{ fontSize: "20px", color: "#94a3b8" }}>Celkem k úhradě:</span>
                    <span style={{ fontSize: "28px", fontWeight: "800", color: "#38bdf8" }}>{celkovaCena} Kč</span>
                  </div>

                  <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #334155" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8" }}>Simulace platební brány</h4>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Kliknutím na tlačítko níže nasimulujete dokončení transakce.</p>
                  </div>

                  <button
                    onClick={zaplatit}
                    disabled={platbaProbehla}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: platbaProbehla ? "#10b981" : "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "18px",
                      fontWeight: "800",
                      cursor: "pointer",
                    }}
                  >
                    {platbaProbehla ? "Zpracovávám platbu..." : "Zaplatit kartou"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}