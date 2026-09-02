"use client";
import { useState } from "react";

// Definice typů
type Produkt = {
  id: number;
  nazev: string;
  cena: number;
  popis: string;
};

type KosikPolozka = {
  produkt: Produkt;
  pocet: number;
};

export default function Home() {
  const [zalozka, setZalozka] = useState<"produkty" | "kosik">("produkty");
  const [kosik, setKosik] = useState<KosikPolozka[]>([]);

  // Seznam nabízených produktů
  const produkty: Produkt[] = [
    { id: 1, nazev: "Stylové tričko", cena: 490, popis: "100% bavlna, pohodlný střih." },
    { id: 2, nazev: "Mikina s kapucí", cena: 1190, popis: "Teplá a příjemná na nošení." },
    { id: 3, nazev: "Kšiltovka", cena: 350, popis: "Nastavitelná velikost, černá barva." },
    { id: 4, nazev: "Ponožky 3 páry", cena: 190, popis: "Prodyšné sportovní ponožky." },
  ];

  // Přidání do košíku
  const pridatDoKosiku = (produkt: Produkt) => {
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

  // Odebrání položky z košíku
  const odebratZKosiku = (id: number) => {
    setKosik((puvodni) => puvodni.filter((p) => p.produkt.id !== id));
  };

  // Změna počtu kusů
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

  // Celková cena
  const celkovaCena = kosik.reduce((sum, p) => sum + p.produkt.cena * p.pocet, 0);
  const celkovyPocetKusu = kosik.reduce((sum, p) => sum + p.pocet, 0);

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#f3f4f6", minHeight: "100vh", margin: 0 }}>
      {/* HORNÍ LIŠTA / NAVIGACE */}
      <header style={{ backgroundColor: "#111827", color: "white", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "22px" }}>Můj E-shop</h1>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => setZalozka("produkty")}
            style={{ background: "none", border: "none", color: zalozka === "produkty" ? "#3b82f6" : "white", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
          >
            Produkty
          </button>
          <button
            onClick={() => setZalozka("kosik")}
            style={{ background: "#2563eb", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Košík ({celkovyPocetKusu})
          </button>
        </div>
      </header>

      {/* OBSAH */}
      <main style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
        {zalozka === "produkty" && (
          <div>
            <h2 style={{ marginBottom: "20px" }}>Katalog produktů</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              {produkty.map((produkt) => (
                <div key={produkt.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "20px", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ marginTop: 0 }}>{produkt.nazev}</h3>
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>{produkt.popis}</p>
                  <p style={{ fontWeight: "bold", fontSize: "20px", color: "#10b981" }}>{produkt.cena} Kč</p>
                  <button
                    onClick={() => pridatDoKosiku(produkt)}
                    style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Pridat do košíku
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {zalozka === "kosik" && (
          <div>
            <h2 style={{ marginBottom: "20px" }}>Nákupní košík</h2>
            {kosik.length === 0 ? (
              <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "18px", color: "#6b7280" }}>Váš košík je zatím prázdný.</p>
                <button
                  onClick={() => setZalozka("produkty")}
                  style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}
                >
                  Prohlédnout produkty
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                {kosik.map((polozka) => (
                  <div key={polozka.produkt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", padding: "15px 0" }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{polozka.produkt.nazev}</h4>
                      <p style={{ margin: "5px 0 0 0", color: "#6b7280" }}>{polozka.produkt.cena} Kč / ks</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={() => zmenitPocet(polozka.produkt.id, -1)} style={{ padding: "5px 10px", cursor: "pointer" }}>-</button>
                      <span><strong>{polozka.pocet}</strong> ks</span>
                      <button onClick={() => zmenitPocet(polozka.produkt.id, 1)} style={{ padding: "5px 10px", cursor: "pointer" }}>+</button>
                      <button
                        onClick={() => odebratZKosiku(polozka.produkt.id)}
                        style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", marginLeft: "10px" }}
                      >
                        Smazat
                      </button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <h3>Celková cena: <span style={{ color: "#10b981" }}>{celkovaCena} Kč</span></h3>
                  <button
                    onClick={() => alert("Objednávka byla odeslána!")}
                    style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Odeslat objednávku
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