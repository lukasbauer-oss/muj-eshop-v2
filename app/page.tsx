"use client";
import { useState } from "react";

type Produkt = {
  id: string;
  nazev: string;
  cena: number;
  popis: string;
  obrazek: string;
};

type PolozkaKosiku = {
  produkt: Produkt;
  mnozstvi: number;
};

export default function Eshop() {
  const [pohled, setPohled] = useState<"obchod" | "detail" | "kosik">("obchod");
  const [vybranyProdukt, setVybranyProdukt] = useState<Produkt | null>(null);
  const [kosik, setKosik] = useState<PolozkaKosiku[]>([]);
  const [doprava, setDoprava] = useState<"zasilkovna" | "kuryr" | null>(null);

  // ZDE SI UPRAVÍŠ SVÉ PRODUKTY
  const produkty: Produkt[] = [
    {
      id: "prod-1",
      nazev: "Minimalistický kryt na iPhone",
      cena: 249,
      popis: "Matný silikonový kryt. Dokonale chrání telefon a skvěle padne do ruky.",
      obrazek: "https://images.unsplash.com/photo-1603313011701-df9a15b37f42?w=800&q=80",
    },
    {
      id: "prod-2",
      nazev: "Sneaker klíčenka",
      cena: 129,
      popis: "Detailní 3D model tenisek na tvoje klíče nebo batoh.",
      obrazek: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    }
  ];

  const pridatDoKosiku = (produkt: Produkt) => {
    setKosik((predchozi) => {
      const existuje = predchozi.find((p) => p.produkt.id === produkt.id);
      if (existuje) {
        return predchozi.map((p) =>
          p.produkt.id === produkt.id ? { ...p, mnozstvi: p.mnozstvi + 1 } : p
        );
      }
      return [...predchozi, { produkt, mnozstvi: 1 }];
    });
    setPohled("kosik");
  };

  const odstranitZKosiku = (id: string) => {
    setKosik((predchozi) => predchozi.filter((p) => p.produkt.id !== id));
  };

  const cenaZbozi = kosik.reduce((sum, polozka) => sum + polozka.produkt.cena * polozka.mnozstvi, 0);
  const cenaDopravy = doprava === "zasilkovna" ? 79 : doprava === "kuryr" ? 99 : 0;
  const celkem = cenaZbozi + cenaDopravy;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#000", backgroundColor: "#fff", minHeight: "100vh" }}>
      
      {/* HLAVIČKA */}
      <header style={{ display: "flex", justifyContent: "space-between", padding: "24px 40px", borderBottom: "1px solid #eaeaea", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}>
        <button onClick={() => setPohled("obchod")} style={{ background: "none", border: "none", fontSize: "20px", fontWeight: "800", cursor: "pointer", letterSpacing: "-0.5px" }}>
          LUKAS / SUPPLY
        </button>
        <button onClick={() => setPohled("kosik")} style={{ background: "none", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
          KOŠÍK ({kosik.reduce((sum, p) => sum + p.mnozstvi, 0)})
        </button>
      </header>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* HLAVNÍ STRÁNKA - GRID PRODUKTŮ */}
        {pohled === "obchod" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "40px" }}>
            {produkty.map((p) => (
              <div 
                key={p.id} 
                style={{ cursor: "pointer" }} 
                onClick={() => { setVybranyProdukt(p); setPohled("detail"); }}
              >
                <div style={{ backgroundColor: "#f5f5f7", aspectRatio: "1/1", overflow: "hidden", marginBottom: "16px" }}>
                  <img src={p.obrazek} alt={p.nazev} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h2 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0" }}>{p.nazev}</h2>
                <p style={{ margin: 0, color: "#666", fontSize: "15px" }}>{p.cena} Kč</p>
              </div>
            ))}
          </div>
        )}

        {/* DETAIL PRODUKTU */}
        {pohled === "detail" && vybranyProdukt && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
            <div style={{ backgroundColor: "#f5f5f7", aspectRatio: "1/1" }}>
              <img src={vybranyProdukt.obrazek} alt={vybranyProdukt.nazev} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <button onClick={() => setPohled("obchod")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", marginBottom: "20px", padding: 0 }}>← Zpět</button>
              <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 16px 0", letterSpacing: "-1px" }}>{vybranyProdukt.nazev}</h1>
              <p style={{ fontSize: "24px", margin: "0 0 32px 0" }}>{vybranyProdukt.cena} Kč</p>
              <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.6", margin: "0 0 40px 0" }}>{vybranyProdukt.popis}</p>
              <button 
                onClick={() => pridatDoKosiku(vybranyProdukt)}
                style={{ width: "100%", padding: "20px", backgroundColor: "#000", color: "#fff", border: "none", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
              >
                PŘIDAT DO KOŠÍKU
              </button>
            </div>
          </div>
        )}

        {/* KOŠÍK A DOPRAVA */}
        {pohled === "kosik" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "40px" }}>KOŠÍK</h1>
            
            {kosik.length === 0 ? (
              <p>Váš košík je prázdný.</p>
            ) : (
              <div>
                {/* Položky */}
                <div style={{ marginBottom: "40px" }}>
                  {kosik.map((polozka) => (
                    <div key={polozka.produkt.id} style={{ display: "flex", gap: "20px", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid #eaeaea" }}>
                      <img src={polozka.produkt.obrazek} alt={polozka.produkt.nazev} style={{ width: "100px", height: "100px", objectFit: "cover", backgroundColor: "#f5f5f7" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{polozka.produkt.nazev}</h3>
                          <span style={{ fontWeight: "600" }}>{polozka.produkt.cena * polozka.mnozstvi} Kč</span>
                        </div>
                        <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "14px" }}>Množství: {polozka.mnozstvi}</p>
                        <button onClick={() => odstranitZKosiku(polozka.produkt.id)} style={{ background: "none", border: "none", color: "#999", fontSize: "13px", cursor: "pointer", padding: 0 }}>Odstranit</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Výběr dopravy */}
                <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Doprava</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "20px", border: doprava === "zasilkovna" ? "2px solid #000" : "1px solid #eaeaea", cursor: "pointer" }}>
                    <span><input type="radio" name="doprava" onChange={() => setDoprava("zasilkovna")} style={{ marginRight: "12px" }}/>Zásilkovna</span>
                    <span>79 Kč</span>
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "20px", border: doprava === "kuryr" ? "2px solid #000" : "1px solid #eaeaea", cursor: "pointer" }}>
                    <span><input type="radio" name="doprava" onChange={() => setDoprava("kuryr")} style={{ marginRight: "12px" }}/>Kurýr na adresu</span>
                    <span>99 Kč</span>
                  </label>
                </div>

                {/* Shrnutí a platba */}
                <div style={{ borderTop: "2px solid #000", paddingTop: "24px", marginBottom: "32px", display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "800" }}>
                  <span>CELKEM</span>
                  <span>{celkem} Kč</span>
                </div>

                <button 
                  onClick={() => doprava ? alert("Zde se napojí Stripe / Comgate") : alert("Vyberte prosím dopravu")}
                  style={{ width: "100%", padding: "20px", backgroundColor: "#000", color: "#fff", border: "none", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
                >
                  PŘEJÍT K PLATBĚ
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}