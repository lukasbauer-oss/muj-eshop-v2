"use client";
import { useState } from "react";
import { useForm, ValidationError } from '@formspree/react';
import Script from "next/script";

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
  idPolozky: string;
  produkt: Produkt;
  varianta: Varianta;
  mnozstvi: number;
};

// Pomocná deklarace pro TypeScript, aby věděl o widgetu Zásilkovny
declare global {
  interface Window {
    Packeta: any;
  }
}

export default function Eshop() {
  const [formState, handleSubmit] = useForm('mnpnjdyw');

  const [pohled, setPohled] = useState<"obchod" | "detail" | "kosik">("obchod");
  const [vybranyProdukt, setVybranyProdukt] = useState<Produkt | null>(null);
  const [vybranaVarianta, setVybranaVarianta] = useState<Varianta | null>(null);
  const [kosik, setKosik] = useState<PolozkaKosiku[]>([]);
  const [doprava, setDoprava] = useState<"zasilkovna" | "kuryr" | null>(null);
  
  // Stav pro uložení vybrané pobočky Zásilkovny
  const [vybranaPobocka, setVybranaPobocka] = useState<any>(null);

  // Funkce pro otevření mapy Zásilkovny
  const otevriMapuZasilkovny = () => {
    // Zde můžeš později nahradit svým reálným API klíčem ze Zásilkovny, 
    // pro testování funguje i výchozí demo klíč níže:
    const apiKey = "1234567890abcdef"; 

    if (window.Packeta && window.Packeta.Widget) {
      window.Packeta.Widget.pick(apiKey, (point: any) => {
        if (point) {
          setVybranaPobocka(point);
        }
      }, { country: "cz", language: "cs" });
    } else {
      alert("Mapa Zásilkovny se ještě načítá, zkuste to za chvíli prosím znovu.");
    }
  };

  if (formState.succeeded) {
    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", textAlign: "center", padding: "120px 20px", color: "#000" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "16px", letterSpacing: "-1px" }}>Díky za objednávku! 🎉</h1>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "40px" }}>Vše jsme v pořádku přijali a brzy se ti ozveme na zadaný e-mail.</p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "16px 32px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "16px" }}
        >
          Zpět do obchodu
        </button>
      </div>
    );
  }

  const produkty: Produkt[] = [
    {
      id: "wc-kartac-01",
      nazev: "Hygienický WC kartáč (nalepovací)",
      kratkyPopis: "Revoluční čistění bez vrtání.",
      detailniPopis: "Moderní nástěnný WC kartáč, který zcela mění pravidla úklidu...",
      obrazek: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      varianty: [
        { id: "var-1", nazev: "Bílý kartáč + 6 náhradních hlavic", cena: 129.90 },
        { id: "var-2", nazev: "Pouze 6 náhradních hlavic (Refill)", cena: 24.90 }
      ]
    }
  ];

  const otevritDetail = (produkt: Produkt) => {
    setVybranyProdukt(produkt);
    setVybranaVarianta(null);
    setPohled("detail");
  };

  const pridatDoKosiku = () => {
    if (!vybranyProdukt || !vybranaVarianta) return;
    const idPolozky = `${vybranyProdukt.id}-${vybranaVarianta.id}`;
    setKosik((predchozi) => {
      const existuje = predchozi.find((p) => p.idPolozky === idPolozky);
      if (existuje) {
        return predchozi.map((p) => p.idPolozky === idPolozky ? { ...p, mnozstvi: p.mnozstvi + 1 } : p);
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

  const prehledObjednavky = kosik.map(p => `${p.mnozstvi}x ${p.produkt.nazev} (${p.varianta.nazev}) - ${(p.mnozstvi * p.varianta.cena).toFixed(2)} Kč`).join('\n');
  const styleVstupu = { width: "100%", padding: "16px", marginBottom: "16px", border: "1px solid #eaeaea", fontSize: "16px", boxSizing: "border-box" as const };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#000", backgroundColor: "#fff", minHeight: "100vh" }}>

      {/* Načtení skriptu widgetu Zásilkovny */}
      <Script src="https://widget.packeta.com/v6/www/js/library.js" strategy="lazyOnload" />

      <header style={{ display: "flex", justifyContent: "space-between", padding: "24px 40px", borderBottom: "1px solid #eaeaea", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}>
        <button onClick={() => setPohled("obchod")} style={{ background: "none", border: "none", fontSize: "20px", fontWeight: "800", cursor: "pointer", letterSpacing: "-0.5px" }}>LUKAS / SUPPLY</button>
        <button onClick={() => setPohled("kosik")} style={{ background: "none", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>KOŠÍK ({kosik.reduce((sum, p) => sum + p.mnozstvi, 0)})</button>
      </header>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>

        {pohled === "obchod" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "40px" }}>
            {produkty.map((p) => (
              <div key={p.id} style={{ cursor: "pointer" }} onClick={() => otevritDetail(p)}>
                <div style={{ backgroundColor: "#f5f5f7", aspectRatio: "1/1", overflow: "hidden", marginBottom: "16px" }}>
                  <img src={p.obrazek} alt={p.nazev} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
                </div>
                <h2 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0" }}>{p.nazev}</h2>
                <p style={{ margin: 0, color: "#666", fontSize: "15px" }}>Od {Math.min(...p.varianty.map(v => v.cena)).toFixed(2).replace('.', ',')} Kč</p>
              </div>
            ))}
          </div>
        )}

        {pohled === "detail" && vybranyProdukt && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
            <div style={{ backgroundColor: "#f5f5f7", aspectRatio: "1/1", position: "sticky", top: "100px" }}>
              <img src={vybranyProdukt.obrazek} alt={vybranyProdukt.nazev} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div>
              <button onClick={() => setPohled("obchod")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", marginBottom: "20px", padding: 0, fontSize: "14px", fontWeight: "600" }}>← Zpět na produkty</button>
              <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 16px 0", letterSpacing: "-1px" }}>{vybranyProdukt.nazev}</h1>
              <p style={{ fontSize: "24px", margin: "0 0 32px 0", fontWeight: "600" }}>{vybranaVarianta ? `${vybranaVarianta.cena.toFixed(2).replace('.', ',')} Kč` : "Vyberte variantu"}</p>
              <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.6", margin: "0 0 40px 0" }}>{vybranyProdukt.detailniPopis}</p>

              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", color: "#666" }}>Dostupné varianty</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {vybranyProdukt.varianty.map((varianta) => (
                    <label key={varianta.id} style={{ display: "flex", justifyContent: "space-between", padding: "20px", border: vybranaVarianta?.id === varianta.id ? "2px solid #000" : "1px solid #eaeaea", cursor: "pointer", backgroundColor: vybranaVarianta?.id === varianta.id ? "#fafafa" : "#fff", transition: "all 0.2s" }}>
                      <span style={{ fontWeight: "600" }}>
                        <input type="radio" name="varianta" checked={vybranaVarianta?.id === varianta.id} onChange={() => setVybranaVarianta(varianta)} style={{ marginRight: "12px" }}/>
                        {varianta.nazev}
                      </span>
                      <span style={{ fontWeight: "600", color: "#666" }}>{varianta.cena.toFixed(2).replace('.', ',')} Kč</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={pridatDoKosiku} disabled={!vybranaVarianta} style={{ width: "100%", padding: "20px", backgroundColor: vybranaVarianta ? "#000" : "#e5e5e5", color: vybranaVarianta ? "#fff" : "#a3a3a3", border: "none", fontSize: "16px", fontWeight: "700", cursor: vybranaVarianta ? "pointer" : "not-allowed", transition: "background-color 0.2s" }}>
                {vybranaVarianta ? "PŘIDAT DO KOŠÍKU" : "VYBERTE VARIANTU"}
              </button>
            </div>
          </div>
        )}

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

                <form onSubmit={handleSubmit}>
                  {/* Skrytá data košíku pro Formspree */}
                  <input type="hidden" name="Objednané_zboží" value={prehledObjednavky} />
                  <input type="hidden" name="Celková_cena" value={`${celkem.toFixed(2).replace('.', ',')} Kč`} />
                  
                  {/* Skryté pole pro vybranou pobočku Zásilkovny */}
                  {vybranaPobocka && (
                    <input type="hidden" name="Vybraná_pobočka_Zásilkovny" value={`${vybranaPobocka.name} (${vybranaPobocka.nameStreet}, ID: ${vybranaPobocka.id})`} />
                  )}

                  <h3 style={{ fontSize: "18px", marginBottom: "16px", fontWeight: "700" }}>Kontaktní údaje</h3>
                  <div style={{ marginBottom: "40px" }}>
                    <input type="text" name="Jméno" placeholder="Jméno a příjmení" required style={styleVstupu} />
                    <input type="email" name="Email" placeholder="E-mail" required style={styleVstupu} />
                    <ValidationError prefix="Email" field="Email" errors={formState.errors} />
                    <input type="tel" name="Telefon" placeholder="Telefon (např. +420 123 456 789)" required style={styleVstupu} />
                  </div>

                  <h3 style={{ fontSize: "18px", marginBottom: "16px", fontWeight: "700" }}>Doprava</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                    <label style={{ display: "flex", justifyContent: "space-between", padding: "20px", border: doprava === "zasilkovna" ? "2px solid #000" : "1px solid #eaeaea", cursor: "pointer", backgroundColor: doprava === "zasilkovna" ? "#fafafa" : "#fff" }}>
                      <span style={{ fontWeight: "600" }}>
                        <input type="radio" name="Doprava" value="Zásilkovna (79 Kč)" required onChange={() => { setDoprava("zasilkovna"); setVybranaPobocka(null); }} style={{ marginRight: "12px" }}/>
                        Zásilkovna
                      </span>
                      <span style={{ fontWeight: "600" }}>79 Kč</span>
                    </label>

                    {/* Pokud je vybraná Zásilkovna, zobrazíme tlačítko pro výběr pobočky z mapy */}
                    {doprava === "zasilkovna" && (
                      <div style={{ padding: "16px", backgroundColor: "#f9f9f9", border: "1px dashed #ccc", marginBottom: "12px" }}>
                        <button type="button" onClick={otevriMapuZasilkovny} style={{ width: "100%", padding: "12px", backgroundColor: "#333", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }}>
                          {vybranaPobocka ? "Změnit pobočku Zásilkovny" : "Vybrat pobočku na mapě 🗺️"}
                        </button>
                        {vybranaPobocka && (
                          <p style={{ marginTop: "12px", fontSize: "14px", color: "#333", fontWeight: "500" }}>
                            ✅ Vybráno: <strong>{vybranaPobocka.name}</strong> ({vybranaPobocka.nameStreet})
                          </p>
                        )}
                      </div>
                    )}

                    <label style={{ display: "flex", justifyContent: "space-between", padding: "20px", border: doprava === "kuryr" ? "2px solid #000" : "1px solid #eaeaea", cursor: "pointer", backgroundColor: doprava === "kuryr" ? "#fafafa" : "#fff" }}>
                      <span style={{ fontWeight: "600" }}>
                        <input type="radio" name="Doprava" value="Kurýr na adresu (99 Kč)" required onChange={() => { setDoprava("kuryr"); setVybranaPobocka(null); }} style={{ marginRight: "12px" }}/>
                        Kurýr na adresu
                      </span>
                      <span style={{ fontWeight: "600" }}>99 Kč</span>
                    </label>
                  </div>

                  <div style={{ borderTop: "2px solid #000", paddingTop: "24px", marginBottom: "32px", display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "800" }}>
                    <span>CELKEM</span>
                    <span>{celkem.toFixed(2).replace('.', ',')} Kč</span>
                  </div>

                  <button 
                    type="submit"
                    disabled={formState.submitting || (doprava === "zasilkovna" && !vybranaPobocka)}
                    style={{ 
                      width: "100%", 
                      padding: "20px", 
                      backgroundColor: (doprava === "zasilkovna" && !vybranaPobocka) ? "#ccc" : (formState.submitting ? "#666" : "#000"), 
                      color: "#fff", 
                      border: "none", 
                      fontSize: "16px", 
                      fontWeight: "700", 
                      cursor: (doprava === "zasilkovna" && !vybranaPobocka) ? "not-allowed" : "pointer" 
                    }}
                  >
                    {doprava === "zasilkovna" && !vybranaPobocka ? "NEJPRVE VYBERTE POBOČKU ZÁSILKOVNY" : (formState.submitting ? "ODESÍLÁM..." : "ODESLAT OBJEDNÁVKU (ZÁVAZNĚ)")}
                  </button>
                  <ValidationError errors={formState.errors} />
                </form>

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}