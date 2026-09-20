"use client";
import { useState } from "react";

type Varianta = {
  id: string;
  nazev: string;
  cena: number;
};

type Produkt = {
  id: string;
  nazev: string;
  kratkyPopis: string;
  detailniPopis: string;
  obrazek: string;
  varianty: Varianta[];
};

type PolozkaKosiku = {
  idPolozky: string; // Unikátní ID kombinující produkt a variantu
  produkt: Produkt;
  varianta: Varianta;
  mnozstvi: number;
};

export default function Eshop() {
  const [pohled, setPohled] = useState<"obchod" | "detail" | "kosik">("obchod");
  const [vybranyProdukt, setVybranyProdukt] = useState<Produkt | null>(null);
  const [vybranaVarianta, setVybranaVarianta] = useState<Varianta | null>(null);
  const [kosik, setKosik] = useState<PolozkaKosiku[]>([]);
  const [doprava, setDoprava] = useState<"zasilkovna" | "kuryr" | null>(null);

  // TVOJE PRODUKTY
  const produkty: Produkt[] = [
    {
      id: "wc-kartac-01",
      nazev: "Hygienický WC kartáč (nalepovací)",
      kratkyPopis: "Revoluční čistění bez vrtání. Nalepovací držák a jednorázové čistící hlavice.",
      detailniPopis: "Moderní nástěnný WC kartáč, který zcela mění pravidla úklidu. Balení využívá jednorázové čistící houbičky, které už obsahují účinný čistící prostředek – nepotřebuješ tak žádnou další chemii. Ohebná hlavice se dostane do každého záhybu (čištění bez slepých úhlů). Držák jednoduše nalepíš na zeď bez nutnosti vrtání. Po použití houbičku jednoduše uvolníš dotykem tlačítka rovnou do koše. Maximálně čisté a hygienické řešení.",
      obrazek: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      varianty: [
        { id: "var-1", nazev: "Bílý kartáč + 6 náhradních hlavic", cena: 129.90 },
        { id: "var-2", nazev: "Pouze 6 náhradních hlavic (Refill)", cena: 24.90 }
      ]
    }
  ];

  const otevritDetail = (produkt: Produkt) => {
    setVybranyProdukt(produkt);
    setVybranaVarianta(null); // Při otevření nového produktu resetujeme výběr
    setPohled("detail");
  };

  const pridatDoKosiku = () => {
    if (!vybranyProdukt || !vybranaVarianta) return;

    const idPolozky = `${vybranyProdukt.id}-${vybranaVarianta.id}`;

    setKosik((predchozi) => {
      const existuje = predchozi.find((p) => p.idPolozky === idPolozky);
      if (existuje) {
        return predchozi.map((p) =>
          p.idPolozky === idPolozky ? { ...p, mnozstvi: p.mnozstvi + 1 } : p
        );
      }
      return [...predchozi, { idPolozky, produkt: vybranyProdukt, varianta: vybranaVarianta, mnozstvi: 1 }];
    });
    
    setPohled("kosik");
  };

  const odstranitZKosiku = (idPolozky: string) => {
    setKosik((predchozi) => predchozi.filter((p) => p.idPolozky !== idPolozky));
  };

  const cenaZbozi = kosik.reduce((sum, polozka) => sum + polozka.varianta.cena * polozka.mnozstvi, 0);
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
                onClick={() => otevritDetail(p)}
              >
                <div style={{ backgroundColor: "#f5f5f7", aspectRatio: "1/1", overflow: "hidden", marginBottom: "16px" }}>
                  <img src={p.obrazek} alt={p.nazev} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
                </div>
                <h2 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0" }}>{p.nazev}</h2>
                <p style={{ margin: 0, color: "#666", fontSize: "15px" }}>Od {Math.min(...p.varianty.map(v => v.cena)).toFixed(2).replace('.', ',')} Kč</p>
              </div>
            ))}
          </div>
        )}

        {/* DETAIL PRODUKTU */}
        {pohled === "detail" && vybranyProdukt && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
            <div style={{ backgroundColor: "#f5f5f7", aspectRatio: "1/1", position: "sticky", top: "100px" }}>
              <img src={vybranyProdukt.obrazek} alt={vybranyProdukt.nazev} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            
            <div>
              <button onClick={() => setPohled("obchod")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", marginBottom: "20px", padding: 0, fontSize: "14px", fontWeight: "600" }}>← Zpět na produkty</button>
              
              <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 16px 0", letterSpacing: "-1px" }}>{vybranyProdukt.nazev}</h1>
              
              {/* Zobrazení dynamické ceny podle toho, co je vybráno */}
              <p style={{ fontSize: "24px", margin: "0 0 32px 0", fontWeight: "600" }}>
                {vybranaVarianta ? `${vybranaVarianta.cena.toFixed(2).replace('.', ',')} Kč` : "Vyberte variantu"}
              </p>
              
              <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.6", margin: "0 0 40px 0" }}>{vybranyProdukt.detailniPopis}</p>

              {/* VÝBĚR VARIANT */}
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", color: "#666" }}>Dostupné varianty</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {vybranyProdukt.varianty.map((varianta) => (
                    <label 
                      key={varianta.id}
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        padding: "20px", 
                        border: vybranaVarianta?.id === varianta.id ? "2px solid #000" : "1px solid #eaeaea", 
                        cursor: "pointer",
                        backgroundColor: vybranaVarianta?.id === varianta.id ? "#fafafa" : "#fff",
                        transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>
                        <input 
                          type="radio" 
                          name="varianta" 
                          checked={vybranaVarianta?.id === varianta.id}
                          onChange={() => setVybranaVarianta(varianta)} 
                          style={{ marginRight: "12px" }}
                        />
                        {varianta.nazev}
                      </span>
                      <span style={{ fontWeight: "600", color: "#666" }}>{varianta.cena.toFixed(2).replace('.', ',')} Kč</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={pridatDoKosiku}
                disabled={!vybranaVarianta}
                style={{ 
                  width: "100%", 
                  padding: "20px", 
                  backgroundColor: vybranaVarianta ? "#000" : "#e5e5e5", 
                  color: vybranaVarianta ? "#fff" : "#a3a3a3", 
                  border: "none", 
                  fontSize: "16px", 
                  fontWeight: "700", 
                  cursor: vybranaVarianta ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s"
                }}
              >
                {vybranaVarianta ? "PŘIDAT DO KOŠÍKU" : "VYBERTE VARIANTU"}
              </button>
            </div>
          </div>
        )}

        {/* KOŠÍK A DOPRAVA */}
        {pohled === "kosik" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0 }}>KOŠÍK</h1>
              <button onClick={() => setPohled("obchod")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontWeight: "600" }}>Pokračovat v nákupu</button>
            </div>
            
            {kosik.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#f9f9f9" }}>
                <p style={{ color: "#666", marginBottom: "20px" }}>Váš košík je zatím prázdný.</p>
                <button onClick={() => setPohled("obchod")} style={{ padding: "12px 24px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600" }}>Zpět do obchodu</button>
              </div>
            ) : (
              <div>
                {/* Položky v košíku */}
                <div style={{ marginBottom: "40px" }}>
                  {kosik.map((polozka) => (
                    <div key={polozka.idPolozky} style={{ display: "flex", gap: "20px", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid #eaeaea" }}>
                      <img src={polozka.produkt.obrazek} alt={polozka.produkt.nazev} style={{ width: "100px", height: "100px", objectFit: "cover", backgroundColor: "#f5f5f7" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>{polozka.produkt.nazev}</h3>
                          <span style={{ fontWeight: "700" }}>{(polozka.varianta.cena * polozka.mnozstvi).toFixed(2).replace('.', ',')} Kč</span>
                        </div>
                        <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "14px" }}>{polozka.varianta.nazev}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>Množství: {polozka.mnozstvi} ks</span>
                          <button onClick={() => odstranitZKosiku(polozka.idPolozky)} style={{ background: "none", border: "none", color: "#ff4444", fontSize: "13px", cursor: "pointer", padding: 0, fontWeight: "600" }}>Odstranit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Výběr dopravy */}
                <h3 style={{ fontSize: "18px", marginBottom: "16px", fontWeight: "700" }}>Doprava</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "20px", border: doprava === "zasilkovna" ? "2px solid #000" : "1px solid #eaeaea", cursor: "pointer", backgroundColor: doprava === "zasilkovna" ? "#fafafa" : "#fff" }}>
                    <span style={{ fontWeight: "600" }}><input type="radio" name="doprava" onChange={() => setDoprava("zasilkovna")} style={{ marginRight: "12px" }}/>Zásilkovna</span>
                    <span style={{ fontWeight: "600" }}>79 Kč</span>
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", padding: "20px", border: doprava === "kuryr" ? "2px solid #000" : "1px solid #eaeaea", cursor: "pointer", backgroundColor: doprava === "kuryr" ? "#fafafa" : "#fff" }}>
                    <span style={{ fontWeight: "600" }}><input type="radio" name="doprava" onChange={() => setDoprava("kuryr")} style={{ marginRight: "12px" }}/>Kurýr na adresu</span>
                    <span style={{ fontWeight: "600" }}>99 Kč</span>
                  </label>
                </div>

                {/* Shrnutí a platba */}
                <div style={{ borderTop: "2px solid #000", paddingTop: "24px", marginBottom: "32px", display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "800" }}>
                  <span>CELKEM</span>
                  <span>{celkem.toFixed(2).replace('.', ',')} Kč</span>
                </div>

                <button 
                  onClick={() => doprava ? alert("Zde se napojí Stripe / Comgate") : alert("Vyberte prosím dopravu")}
                  style={{ width: "100%", padding: "20px", backgroundColor: "#000", color: "#fff", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
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