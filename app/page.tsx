"use client";
import { useState } from "react";

type Produkt = {
  id: number;
  nazev: string;
  cena: number;
  kategorie: "sneakers" | "apparel" | "tech";
  popis: string;
  tag: string;
  obrazekUrl: string;
  velikosti?: string[];
};

type KosikPolozka = {
  produkt: Produkt;
  pocet: number;
  vybranaVelikost?: string;
};

type DopravaTyp = "zasilkovna" | "ppl" | "osobne" | null;

export default function Home() {
  const [zalozka, setZalozka] = useState<"obchod" | "kosik">("obchod");
  const [kategorie, setKategorie] = useState<"vse" | "sneakers" | "apparel" | "tech">("vse");
  const [kosik, setKosik] = useState<KosikPolozka[]>([]);
  const [animovanyId, setAnimovanyId] = useState<number | null>(null);
  const [zvolenaDoprava, setZvolenaDoprava] = useState<DopravaTyp>(null);
  const [zpracovavam, setZpracovavam] = useState(false);

  const produkty: Produkt[] = [
    {
      id: 1,
      nazev: "Air Jordan 4 Retro 'Military Black'",
      cena: 9490,
      kategorie: "sneakers",
      popis: "Jeden z nejžádanějších releasů. Klasická silueta v čistém černobílém provedení.",
      tag: "HYPE",
      obrazekUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
      velikosti: ["41", "42", "42.5", "43", "44", "45"],
    },
    {
      id: 2,
      nazev: "Nike Dunk Low 'Panda'",
      cena: 3290,
      kategorie: "sneakers",
      popis: "Absolutní streetwearový základ. Univerzální design ke každému outfitu.",
      tag: "RESTOCK",
      obrazekUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
      velikosti: ["38", "39", "40", "41", "44"],
    },
    {
      id: 3,
      nazev: "Supreme Box Logo Hoodie (Black)",
      cena: 6890,
      kategorie: "apparel",
      popis: "Ikonická heavyweight mikina s vyšitým Box Logem na hrudi.",
      tag: "RARE",
      obrazekUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      velikosti: ["M", "L", "XL"],
    },
    {
      id: 4,
      nazev: "Sony WH-1000XM5 Black",
      cena: 7490,
      kategorie: "tech",
      popis: "Nejlepší sluchátka s aktivním potlačením hluku na trhu v matně černém designu.",
      tag: "TECH",
      obrazekUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    },
    {
      id: 5,
      nazev: "Yeezy Slide 'Onyx'",
      cena: 2890,
      kategorie: "sneakers",
      popis: "Extrémně pohodlné letní slides z EVA pěny v temně černé barvě.",
      tag: "SUMMER",
      obrazekUrl: "https://images.unsplash.com/photo-1646740375084-25e1a3b1a20b?w=800&q=80",
      velikosti: ["42", "43", "44.5", "46"],
    },
    {
      id: 6,
      nazev: "Essential Oversized Tee",
      cena: 1190,
      kategorie: "apparel",
      popis: "Basic tričko z těžké bavlny (240 GSM). Dropped shoulders a boxy fit.",
      tag: "BASIC",
      obrazekUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
      velikosti: ["S", "M", "L", "XL"],
    },
  ];

  const cenyDopravy = {
    zasilkovna: 79,
    ppl: 99,
    osobne: 0,
  };

  const pridatDoKosiku = (produkt: Produkt) => {
    setAnimovanyId(produkt.id);
    setTimeout(() => setAnimovanyId(null), 500);

    const vychoziVelikost = produkt.velikosti ? produkt.velikosti[0] : undefined;

    setKosik((puvodni) => {
      const existuje = puvodni.find((p) => p.produkt.id === produkt.id);
      if (existuje) {
        return puvodni.map((p) =>
          p.produkt.id === produkt.id ? { ...p, pocet: p.pocet + 1 } : p
        );
      }
      return [...puvodni, { produkt, pocet: 1, vybranaVelikost: vychoziVelikost }];
    });
  };

  const odstranitZKosiku = (id: number) => {
    setKosik((puvodni) => puvodni.filter((p) => p.produkt.id !== id));
  };

  const cenaZbozi = kosik.reduce((sum, p) => sum + p.produkt.cena * p.pocet, 0);
  const cenaDopravyKc = zvolenaDoprava ? cenyDopravy[zvolenaDoprava] : 0;
  const celkovaCena = cenaZbozi + cenaDopravyKc;

  const filtrovaneProdukty = kategorie === "vse" ? produkty : produkty.filter((p) => p.kategorie === kategorie);

  const checkout = () => {
    if (!zvolenaDoprava) {
      alert("Prosím vyberte způsob dopravy před platbou.");
      return;
    }
    setZpracovavam(true);
    // Zde se v budoucnu napojí reálná platební brána (Stripe)
    setTimeout(() => {
      setKosik([]);
      setZvolenaDoprava(null);
      setZpracovavam(false);
      setZalozka("obchod");
      alert("Přesměrovávám na platební bránu...");
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh", margin: 0 }}>
      {/* HEADER */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", letterSpacing: "2px" }}>AURA <span style={{ color: "#666" }}>/ STUDIO</span></h1>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => setZalozka("obchod")} style={{ background: "none", border: "none", color: zalozka === "obchod" ? "#fff" : "#666", cursor: "pointer", fontWeight: "600" }}>CATALOG</button>
          <button onClick={() => setZalozka("kosik")} style={{ background: "#fff", color: "#000", border: "none", padding: "8px 16px", cursor: "pointer", fontWeight: "700" }}>CART ({kosik.length})</button>
        </div>
      </header>

      <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {zalozka === "obchod" && (
          <div>
            {/* KATEGORIE */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "40px" }}>
              {["vse", "sneakers", "apparel", "tech"].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKategorie(kat as any)}
                  style={{ backgroundColor: "transparent", color: kategorie === kat ? "#fff" : "#666", border: kategorie === kat ? "1px solid #fff" : "1px solid #333", padding: "8px 16px", cursor: "pointer", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* PRODUKTY */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px" }}>
              {filtrovaneProdukty.map((p) => (
                <div key={p.id} style={{ border: "1px solid #1a1a1a", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ position: "relative", height: "300px", overflow: "hidden", backgroundColor: "#111" }}>
                    <img src={p.obrazekUrl} alt={p.nazev} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(20%)" }} />
                    <span style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#000", color: "#fff", padding: "4px 8px", fontSize: "10px", letterSpacing: "1px" }}>{p.tag}</span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>{p.nazev}</h3>
                    <p style={{ color: "#888", fontSize: "13px", margin: "0 0 15px 0" }}>{p.popis}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>{p.cena} Kč</span>
                      <button
                        onClick={() => pridatDoKosiku(p)}
                        style={{ backgroundColor: animovanyId === p.id ? "#fff" : "transparent", color: animovanyId === p.id ? "#000" : "#fff", border: "1px solid #fff", padding: "8px 16px", cursor: "pointer", fontWeight: "600", fontSize: "12px", transition: "all 0.2s" }}
                      >
                        {animovanyId === p.id ? "ADDED" : "BUY"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KOŠÍK A CHECKOUT */}
        {zalozka === "kosik" && (
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
            
            {/* POLOŽKY V KOŠÍKU */}
            <div>
              <h2 style={{ fontSize: "20px", borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>NÁKUPNÍ KOŠÍK</h2>
              {kosik.length === 0 ? (
                <p style={{ color: "#666" }}>Košík je prázdný.</p>
              ) : (
                kosik.map((item) => (
                  <div key={item.produkt.id} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid #1a1a1a" }}>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <img src={item.produkt.obrazekUrl} alt={item.produkt.nazev} style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "14px" }}>{item.produkt.nazev}</h4>
                        <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "12px" }}>Počet: {item.pocet} {item.vybranaVelikost && `| Velikost: ${item.vybranaVelikost}`}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <span style={{ fontWeight: "bold" }}>{item.produkt.cena * item.pocet} Kč</span>
                      <button onClick={() => odstranitZKosiku(item.produkt.id)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* VÝBĚR DOPRAVY A SOUHRN (Zobrazí se jen pokud je něco v košíku) */}
            {kosik.length > 0 && (
              <div style={{ backgroundColor: "#0a0a0a", padding: "30px", border: "1px solid #1a1a1a" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", textTransform: "uppercase" }}>Způsob dopravy</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "15px", border: zvolenaDoprava === "zasilkovna" ? "1px solid #fff" : "1px solid #333", cursor: "pointer" }}>
                    <div><input type="radio" name="doprava" onChange={() => setZvolenaDoprava("zasilkovna")} /> Zásilkovna (Výdejní místo)</div>
                    <span>{cenyDopravy.zasilkovna} Kč</span>
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "15px", border: zvolenaDoprava === "ppl" ? "1px solid #fff" : "1px solid #333", cursor: "pointer" }}>
                    <div><input type="radio" name="doprava" onChange={() => setZvolenaDoprava("ppl")} /> Kurýr PPL (Na adresu)</div>
                    <span>{cenyDopravy.ppl} Kč</span>
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "15px", border: zvolenaDoprava === "osobne" ? "1px solid #fff" : "1px solid #333", cursor: "pointer" }}>
                    <div><input type="radio" name="doprava" onChange={() => setZvolenaDoprava("osobne")} /> Osobní odběr</div>
                    <span>Zdarma</span>
                  </label>
                </div>

                <div style={{ borderTop: "1px solid #333", paddingTop: "20px", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <span style={{ fontSize: "14px", color: "#888" }}>Mezisoučet</span>
                  <span>{cenaZbozi} Kč</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontSize: "20px", fontWeight: "bold" }}>
                  <span>CELKEM</span>
                  <span>{celkovaCena} Kč</span>
                </div>

                <button
                  onClick={checkout}
                  disabled={zpracovavam}
                  style={{ width: "100%", padding: "15px", backgroundColor: "#fff", color: "#000", border: "none", fontSize: "14px", fontWeight: "bold", cursor: "pointer", textTransform: "uppercase" }}
                >
                  {zpracovavam ? "PŘESMĚROVÁNÍ..." : "ZAPLATIT ONLINE"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}