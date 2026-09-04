"use client";
import { useState } from "react";

type Produkt = {
  id: number;
  nazev: string;
  cena: number;
  kategorie: "doplnky" | "kancelar" | "tech";
  popis: string;
  detailniPopis: string;
  tag: string;
  obrazekUrl: string;
  varianty?: string[];
  nazevVarianty?: string;
};

type KosikPolozka = {
  idVKosiku: string; 
  produkt: Produkt;
  pocet: number;
  vybranaVarianta?: string;
};

type DopravaTyp = "zasilkovna" | "ppl" | null;

export default function Home() {
  const [zalozka, setZalozka] = useState<"obchod" | "kosik">("obchod");
  const [kategorie, setKategorie] = useState<"vse" | "doplnky" | "kancelar" | "tech">("vse");
  const [kosik, setKosik] = useState<KosikPolozka[]>([]);
  const [zvolenaDoprava, setZvolenaDoprava] = useState<DopravaTyp>(null);
  const [zpracovavam, setZpracovavam] = useState(false);
  
  // Stavy pro detail produktu
  const [vybranyProdukt, setVybranyProdukt] = useState<Produkt | null>(null);
  const [vybranaVarianta, setVybranaVarianta] = useState<string>("");
  const [vybranyPocet, setVybranyPocet] = useState<number>(1);
  const [animaceTlacitka, setAnimaceTlacitka] = useState(false);

  const produkty: Produkt[] = [
    {
      id: 1,
      nazev: "Sada estetických gelových propisek (5 ks)",
      cena: 149,
      kategorie: "kancelar",
      popis: "Minimalistické propisky, které nepíšou, ale kloužou po papíře.",
      detailniPopis: "Sada pěti prémiových gelových propisek v matném pastelovém designu. Tloušťka hrotu 0.5mm zaručuje dokonale tenkou a čistou linku. Ideální do školy nebo do kanceláře pro každodenní psaní. Rychleschnoucí inkoust, který se nerozmazává.",
      tag: "BESTSELLER",
      obrazekUrl: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&q=80",
      varianty: ["Černý inkoust", "Modrý inkoust"],
      nazevVarianty: "Barva inkoustu",
    },
    {
      id: 2,
      nazev: "3D Sneaker Klíčenka",
      cena: 129,
      kategorie: "doplnky",
      popis: "Zmenšenina tvých oblíbených tenisek přímo na klíče.",
      detailniPopis: "Vymazli si svazek klíčů nebo batoh s touto detailní 3D klíčenkou ve tvaru hype tenisek. Vyrobeno z odolného silikonu. Skvělý a levný dárek pro každého sneakerheada.",
      tag: "TREND",
      obrazekUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      varianty: ["Panda", "Chicago", "Military Black"],
      nazevVarianty: "Vyberte model",
    },
    {
      id: 3,
      nazev: "Liquid Silicone Kryt na iPhone",
      cena: 199,
      kategorie: "tech",
      popis: "Sametově hebký obal, který spolehlivě ochrání tvůj telefon.",
      detailniPopis: "Prémiový silikonový kryt s vnitřní výstelkou z mikrovlákna. Dokonale tlumí pády, neklouže v ruce a nezanechává otisky prstů. Zvýšené okraje chrání displej i čočky fotoaparátu.",
      tag: "OCHRANA",
      obrazekUrl: "https://images.unsplash.com/photo-1603313011701-df9a15b37f42?w=800&q=80",
      varianty: ["iPhone 13", "iPhone 14", "iPhone 15"],
      nazevVarianty: "Model telefonu",
    },
    {
      id: 4,
      nazev: "RGB LED pásek do pokoje (5 metrů)",
      cena: 299,
      kategorie: "tech",
      popis: "Vytvoř si dokonalou atmosféru s chytrým LED podsvícením.",
      detailniPopis: "Plně nastavitelný 5metrový LED pásek s možností volby z 16 milionů barev. Pásek je samolepicí (3M páska) a lze ho zkrátit podle potřeby. Součástí balení je dálkové ovládání i možnost ovládání přes aplikaci v telefonu pomocí Bluetooth.",
      tag: "MUST-HAVE",
      obrazekUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80",
    }
  ];

  const cenyDopravy = {
    zasilkovna: 79,
    ppl: 99,
  };

  const otevritDetail = (produkt: Produkt) => {
    setVybranyProdukt(produkt);
    setVybranaVarianta(produkt.varianty ? produkt.varianty[0] : "");
    setVybranyPocet(1);
  };

  const pridatZDetailuDoKosiku = () => {
    if (!vybranyProdukt) return;
    setAnimaceTlacitka(true);
    
    const idVKosiku = `${vybranyProdukt.id}-${vybranaVarianta}`;

    setKosik((puvodni) => {
      const existuje = puvodni.find((p) => p.idVKosiku === idVKosiku);
      if (existuje) {
        return puvodni.map((p) =>
          p.idVKosiku === idVKosiku ? { ...p, pocet: p.pocet + vybranyPocet } : p
        );
      }
      return [...puvodni, { 
        idVKosiku, 
        produkt: vybranyProdukt, 
        pocet: vybranyPocet, 
        vybranaVarianta 
      }];
    });

    setTimeout(() => {
      setAnimaceTlacitka(false);
      setVybranyProdukt(null);
    }, 600);
  };

  const odstranitZKosiku = (idVKosiku: string) => {
    setKosik((puvodni) => puvodni.filter((p) => p.idVKosiku !== idVKosiku));
  };

  const cenaZbozi = kosik.reduce((sum, p) => sum + p.produkt.cena * p.pocet, 0);
  const cenaDopravyKc = zvolenaDoprava ? cenyDopravy[zvolenaDoprava] : 0;
  const celkovaCena = cenaZbozi + cenaDopravyKc;

  const filtrovaneProdukty = kategorie === "vse" ? produkty : produkty.filter((p) => p.kategorie === kategorie);

  const checkout = () => {
    if (!zvolenaDoprava) {
      alert("Prosím, vyberte si nejprve způsob dopravy.");
      return;
    }
    setZpracovavam(true);
    setTimeout(() => {
      setKosik([]);
      setZvolenaDoprava(null);
      setZpracovavam(false);
      setZalozka("obchod");
      alert("Přesměrovávám na platební bránu...");
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: "#ffffff", color: "#000000", minHeight: "100vh", margin: 0 }}>
      
      <style>{`
        @keyframes successPop {
          0% { transform: scale(1); background-color: #000; }
          50% { transform: scale(1.05); background-color: #10b981; }
          100% { transform: scale(1); background-color: #10b981; }
        }
        .btn-animace {
          animation: successPop 0.5s ease-in-out forwards !important;
        }
        .karta {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .karta:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <header style={{ borderBottom: "1px solid #e5e7eb", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", letterSpacing: "1px" }}>
          LUKAS <span style={{ color: "#9ca3af", fontWeight: "400" }}>/ SUPPLY</span>
        </h1>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button onClick={() => setZalozka("obchod")} style={{ background: "none", border: "none", color: zalozka === "obchod" ? "#000" : "#6b7280", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>PRODUKTY</button>
          <button onClick={() => setZalozka("kosik")} style={{ background: "#000", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
            KOŠÍK ({kosik.length})
          </button>
        </div>
      </header>

      <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        
        {zalozka === "obchod" && !vybranyProdukt && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
              {["vse", "doplnky", "kancelar", "tech"].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKategorie(kat as any)}
                  style={{ 
                    backgroundColor: kategorie === kat ? "#000" : "#f3f4f6", 
                    color: kategorie === kat ? "#fff" : "#4b5563", 
                    border: "none", 
                    padding: "10px 20px", 
                    borderRadius: "4px",
                    cursor: "pointer", 
                    textTransform: "uppercase", 
                    fontSize: "12px", 
                    fontWeight: "600",
                    letterSpacing: "0.5px" 
                  }}
                >
                  {kat}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
              {filtrovaneProdukty.map((p) => (
                <div 
                  key={p.id} 
                  className="karta"
                  onClick={() => otevritDetail(p)}
                  style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}
                >
                  <div style={{ position: "relative", height: "280px", backgroundColor: "#f9fafb" }}>
                    <img src={p.obrazekUrl} alt={p.nazev} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#000", color: "#fff", padding: "6px 10px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", borderRadius: "2px" }}>
                      {p.tag}
                    </span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700" }}>{p.nazev}</h3>
                    <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 16px 0", lineHeight: "1.5" }}>{p.popis}</p>
                    <span style={{ fontWeight: "800", fontSize: "18px" }}>{p.cena} Kč</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vybranyProdukt && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeIn 0.3s" }}>
            <button 
              onClick={() => setVybranyProdukt(null)}
              style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontWeight: "600", fontSize: "14px", padding: 0 }}
            >
              ← Zpět na produkty
            </button>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", marginTop: "10px" }}>
              <div style={{ backgroundColor: "#f9fafb", borderRadius: "8px", overflow: "hidden", aspectRatio: "1/1" }}>
                <img src={vybranyProdukt.obrazekUrl} alt={vybranyProdukt.nazev} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 style={{ margin: "0 0 10px 0", fontSize: "32px", fontWeight: "800" }}>{vybranyProdukt.nazev}</h2>
                <p style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 20px 0" }}>{vybranyProdukt.cena} Kč</p>
                <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.6", margin: "0 0 30px 0" }}>{vybranyProdukt.detailniPopis}</p>

                {vybranyProdukt.varianty && (
                  <div style={{ marginBottom: "24px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "600" }}>{vybranyProdukt.nazevVarianty}:</p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {vybranyProdukt.varianty.map(vr => (
                        <button 
                          key={vr}
                          onClick={() => setVybranaVarianta(vr)}
                          style={{
                            padding: "10px 16px",
                            border: vybranaVarianta === vr ? "2px solid #000" : "1px solid #d1d5db",
                            backgroundColor: vybranaVarianta === vr ? "#000" : "#fff",
                            color: vybranaVarianta === vr ? "#fff" : "#000",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                        >
                          {vr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: "30px" }}>
                  <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "600" }}>Počet kusů:</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", border: "1px solid #d1d5db", width: "fit-content", padding: "4px", borderRadius: "4px" }}>
                    <button onClick={() => setVybranyPocet(Math.max(1, vybranyPocet - 1))} style={{ width: "30px", height: "30px", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>-</button>
                    <span style={{ fontWeight: "700", width: "20px", textAlign: "center" }}>{vybranyPocet}</span>
                    <button onClick={() => setVybranyPocet(vybranyPocet + 1)} style={{ width: "30px", height: "30px", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>+</button>
                  </div>
                </div>

                <button
                  onClick={pridatZDetailuDoKosiku}
                  className={animaceTlacitka ? "btn-animace" : ""}
                  style={{ backgroundColor: "#000", color: "#fff", border: "none", padding: "16px", borderRadius: "4px", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "background-color 0.2s" }}
                >
                  {animaceTlacitka ? "✓ PŘIDÁNO DO KOŠÍKU" : "PŘIDAT DO KOŠÍKU"}
                </button>
              </div>
            </div>
          </div>
        )}

        {zalozka === "kosik" && (
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
            
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", borderBottom: "2px solid #e5e7eb", paddingBottom: "16px", marginBottom: "24px" }}>VÁŠ KOŠÍK</h2>
              {kosik.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                  <p style={{ color: "#6b7280", margin: "0 0 20px 0" }}>Košík je zatím prázdný.</p>
                  <button onClick={() => setZalozka("obchod")} style={{ backgroundColor: "#000", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>Přejít k nákupu</button>
                </div>
              ) : (
                kosik.map((item) => (
                  <div key={item.idVKosiku} style={{ display: "flex", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <img src={item.produkt.obrazekUrl} alt={item.produkt.nazev} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />
                      <div>
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700" }}>{item.produkt.nazev}</h4>
                        <p style={{ margin: "0", color: "#6b7280", fontSize: "13px" }}>
                          Počet: {item.pocet} ks {item.vybranaVarianta && `• Varianta: ${item.vybranaVarianta}`}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <span style={{ fontWeight: "800", fontSize: "16px" }}>{item.produkt.cena * item.pocet} Kč</span>
                      <button onClick={() => odstranitZKosiku(item.idVKosiku)} style={{ background: "#f3f4f6", border: "none", color: "#ef4444", width: "32px", height: "32px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {kosik.length > 0 && (
              <div style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700" }}>ZPŮSOB DOPRAVY</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "16px", backgroundColor: "#fff", border: zvolenaDoprava === "zasilkovna" ? "2px solid #000" : "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>
                    <div style={{ fontWeight: "600" }}><input type="radio" name="doprava" onChange={() => setZvolenaDoprava("zasilkovna")} style={{ marginRight: "10px" }}/> Zásilkovna (Výdejní místo)</div>
                    <span style={{ fontWeight: "600" }}>{cenyDopravy.zasilkovna} Kč</span>
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "16px", backgroundColor: "#fff", border: zvolenaDoprava === "ppl" ? "2px solid #000" : "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>
                    <div style={{ fontWeight: "600" }}><input type="radio" name="doprava" onChange={() => setZvolenaDoprava("ppl")} style={{ marginRight: "10px" }}/> Kurýr PPL (Na adresu)</div>
                    <span style={{ fontWeight: "600" }}>{cenyDopravy.ppl} Kč</span>
                  </label>
                </div>

                <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "20px", display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "15px", color: "#6b7280" }}>Mezisoučet (bez dopravy)</span>
                  <span style={{ fontWeight: "600" }}>{cenaZbozi} Kč</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontSize: "24px", fontWeight: "800" }}>
                  <span>CELKEM</span>
                  <span>{celkovaCena} Kč</span>
                </div>

                <button
                  onClick={checkout}
                  disabled={zpracovavam}
                  style={{ width: "100%", padding: "18px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "4px", fontSize: "16px", fontWeight: "800", cursor: "pointer", transition: "background-color 0.2s" }}
                >
                  {zpracovavam ? "ZPRACOVÁVÁM..." : "PŘEJÍT K PLATBĚ ONLINE"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}