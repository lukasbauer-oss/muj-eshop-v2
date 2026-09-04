"use client";
import { useState } from "react";

type KategorieTyp = "vse" | "apparel" | "tech" | "lifestyle";

type Produkt = {
  id: number;
  nazev: string;
  cena: number;
  kategorie: "apparel" | "tech" | "lifestyle";
  popis: string;
  tag: string;
  obrazekUrl: string;
  rozmery?: string;
};

type KosikPolozka = {
  produkt: Produkt;
  pocet: number;
};

export default function Home() {
  const [zalozka, setZalozka] = useState<"obchod" | "kosik">("obchod");
  const [kategorie, setKategorie] = useState<KategorieTyp>("vse");
  const [kosik, setKosik] = useState<KosikPolozka[]>([]);
  const [animovanyId, setAnimovanyId] = useState<number | null>(null);
  const [platbaProbehla, setPlatbaProbehla] = useState(false);

  const produkty: Produkt[] = [
    {
      id: 1,
      nazev: "Monochrome Hoodie",
      cena: 1490,
      kategorie: "apparel",
      popis: "Heavyweight 450 GSM bavlna, minimalistický oversize střih v temně černé.",
      tag: "ESSENTIAL",
      obrazekUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      rozmery: "Velikosti: S, M, L, XL",
    },
    {
      id: 2,
      nazev: "AURA Wireless Pods",
      cena: 2890,
      kategorie: "tech",
      popis: "Matně černé tělo, aktivní potlačení hluku a studiová kvalita zvuku.",
      tag: "TECH",
      obrazekUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      rozmery: "Výdrž 32h | USB-C Fast Charge",
    },
    {
      id: 3,
      nazev: "Minimalist Drone 4K",
      cena: 5490,
      kategorie: "tech",
      popis: "Kompaktní 4K dron v matně černé edici s pokročilou gyro-stabilizací.",
      tag: "FEATURED",
      obrazekUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
      rozmery: "Hmotnost 249g | 4K 60fps",
    },
    {
      id: 4,
      nazev: "Aesthetic Oversize Tee",
      cena: 790,
      kategorie: "apparel",
      popis: "Prémiová organická bavlna, dropped-shoulder silueta pro každý den.",
      tag: "NEW",
      obrazekUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
      rozmery: "Velikosti: M, L, XL",
    },
    {
      id: 5,
      nazev: "Matte Black Tumbler",
      cena: 650,
      kategorie: "lifestyle",
      popis: "Nerezová izolovaná termoláhev s dvoustěnným vakuovým pláštěm.",
      tag: "LIFESTYLE",
      obrazekUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      rozmery: "Objem: 750ml",
    },
    {
      id: 6,
      nazev: "Studio Desk Mat",
      cena: 890,
      kategorie: "lifestyle",
      popis: "Voděodolná podložka z mikrovlákna a přírodního kaučuku v monochromatickém tónu.",
      tag: "WORKSPACE",
      obrazekUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      rozmery: "Rozměry: 900 x 400 mm",
    },
  ];

  const pridatDoKosiku = (produkt: Produkt) => {
    setAnimovanyId(produkt.id);
    setTimeout(() => setAnimovanyId(null), 500);

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
        .filter((p): p is KosikPolozka => p !== null)
    );
  };

  const celkovaCena = kosik.reduce((sum, p) => sum + p.produkt.cena * p.pocet, 0);
  const celkovyPocetKusu = kosik.reduce((sum, p) => sum + p.pocet, 0);

  const filtrovaneProdukty =
    kategorie === "vse"
      ? produkty
      : produkty.filter((p) => p.kategorie === kategorie);

  const zaplatit = () => {
    setPlatbaProbehla(true);
    setTimeout(() => {
      setKosik([]);
      setPlatbaProbehla(false);
      setZalozka("obchod");
      alert("Objednávka byla úspěšně zpracována. Děkujeme za nákup v AURA / STUDIO.");
    }, 1200);
  };

  const kategorieSeznam: { id: KategorieTyp; label: string }[] = [
    { id: "vse", label: "ALL PRODUCTS" },
    { id: "apparel", label: "APPAREL" },
    { id: "tech", label: "TECH" },
    { id: "lifestyle", label: "LIFESTYLE" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        minHeight: "100vh",
        margin: 0,
        letterSpacing: "-0.02em",
      }}
    >
      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(1); }
          50% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
        .animovat-tlacitko { animation: scaleUp 0.3s ease-in-out; }
        .karta {
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .karta:hover {
          border-color: #ffffff !important;
          transform: translateY(-4px);
        }
        .img-zoom {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .karta:hover .img-zoom {
          transform: scale(1.05);
        }
        .tab-btn {
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          color: #ffffff !important;
        }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          backgroundColor: "#0a0a0a",
          borderBottom: "1px solid #1a1a1a",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            AURA <span style={{ color: "#555" }}>/ STUDIO</span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <button
            onClick={() => setZalozka("obchod")}
            className="tab-btn"
            style={{
              background: "none",
              border: "none",
              color: zalozka === "obchod" ? "#ffffff" : "#666666",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            CATALOG
          </button>
          <button
            onClick={() => setZalozka("kosik")}
            className={`animovat-tlacitko`}
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "none",
              padding: "10px 20px",
              borderRadius: "2px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            CART ({celkovyPocetKusu})
          </button>
        </div>
      </header>

      {/* HERO BANNER */}
      {zalozka === "obchod" && (
        <section
          style={{
            borderBottom: "1px solid #1a1a1a",
            padding: "80px 40px 60px 40px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            COLLECTION 2026
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: "800",
              lineHeight: "1.05",
              margin: "0 0 20px 0",
              maxWidth: "800px",
            }}
          >
            MONOCHROME ESSENTIALS FOR MODERN LIVING.
          </h2>
        </section>
      )}

      {/* MAIN CONTENT */}
      <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {zalozka === "obchod" && (
          <div>
            {/* KATEGORIE FILTER */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "40px",
                flexWrap: "wrap",
                borderBottom: "1px solid #1a1a1a",
                paddingBottom: "20px",
              }}
            >
              {kategorieSeznam.map((kat) => (
                <button
                  key={kat.id}
                  onClick={() => setKategorie(kat.id)}
                  style={{
                    backgroundColor: kategorie === kat.id ? "#ffffff" : "transparent",
                    color: kategorie === kat.id ? "#000000" : "#666666",
                    border: "1px solid",
                    borderColor: kategorie === kat.id ? "#ffffff" : "#222222",
                    padding: "8px 18px",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.1em",
                  }}
                >
                  {kat.label}
                </button>
              ))}
            </div>

            {/* PRODUCT GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "30px",
              }}
            >
              {filtrovaneProdukty.map((p) => (
                <div
                  key={p.id}
                  className="karta"
                  style={{
                    backgroundColor: "#0d0d0d",
                    border: "1px solid #1a1a1a",
                    borderRadius: "2px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* OBRÁZEK */}
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        aspectRatio: "1 / 1",
                        backgroundColor: "#111",
                      }}
                    >
                      <img
                        src={p.obrazekUrl}
                        alt={p.nazev}
                        className="img-zoom"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "grayscale(100%) contrast(110%)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "16px",
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          padding: "4px 8px",
                          border: "1px solid #333333",
                          fontWeight: "700",
                        }}
                      >
                        {p.tag}
                      </span>
                    </div>

                    {/* POPIS A INFORMACE */}
                    <div style={{ padding: "24px" }}>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "18px",
                          fontWeight: "700",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {p.nazev}
                      </h3>
                      <p
                        style={{
                          color: "#888888",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          margin: "0 0 16px 0",
                        }}
                      >
                        {p.popis}
                      </p>
                      {p.rozmery && (
                        <p
                          style={{
                            color: "#555555",
                            fontSize: "11px",
                            margin: 0,
                            letterSpacing: "0.05em",
                          }}
                        >
                          SPEC: {p.rozmery}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AKCE A CENA */}
                  <div style={{ padding: "0 24px 24px 24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "16px",
                        paddingTop: "16px",
                        borderTop: "1px solid #1a1a1a",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        {p.cena} CZK
                      </span>
                      <button
                        onClick={() => pridatDoKosiku(p)}
                        className={`animovat-tlacitko`}
                        style={{
                          backgroundColor:
                            animovanyId === p.id ? "#ffffff" : "transparent",
                          color: animovanyId === p.id ? "#000000" : "#ffffff",
                          border: "1px solid #ffffff",
                          padding: "10px 16px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "11px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {animovanyId === p.id ? "ADDED" : "ADD TO CART"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KOŠÍK */}
        {zalozka === "kosik" && (
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "30px",
                borderBottom: "1px solid #1a1a1a",
                paddingBottom: "16px",
              }}
            >
              YOUR CART
            </h2>

            {kosik.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#0d0d0d",
                  padding: "60px 20px",
                  textAlign: "center",
                  border: "1px solid #1a1a1a",
                }}
              >
                <p
                  style={{
                    color: "#666666",
                    fontSize: "14px",
                    letterSpacing: "0.1em",
                    marginBottom: "24px",
                  }}
                >
                  YOUR CART IS CURRENTLY EMPTY.
                </p>
                <button
                  onClick={() => setZalozka("obchod")}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                  }}
                >
                  RETURN TO CATALOG
                </button>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#0d0d0d",
                  padding: "30px",
                  border: "1px solid #1a1a1a",
                }}
              >
                {kosik.map((item) => (
                  <div
                    key={item.produkt.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #1a1a1a",
                      padding: "20px 0",
                    }}
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <img
                        src={item.produkt.obrazekUrl}
                        alt={item.produkt.nazev}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          filter: "grayscale(100%)",
                        }}
                      />
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: "700",
                          }}
                        >
                          {item.produkt.nazev}
                        </h4>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            color: "#666666",
                            fontSize: "13px",
                          }}
                        >
                          {item.produkt.cena} CZK
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #222222",
                        }}
                      >
                        <button
                          onClick={() => zmenitPocet(item.produkt.id, -1)}
                          style={{
                            backgroundColor: "transparent",
                            color: "#ffffff",
                            border: "none",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            padding: "0 8px",
                          }}
                        >
                          {item.pocet}
                        </span>
                        <button
                          onClick={() => zmenitPocet(item.produkt.id, 1)}
                          style={{
                            backgroundColor: "transparent",
                            color: "#ffffff",
                            border: "none",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* SUMÁŘ */}
                <div style={{ marginTop: "30px", paddingTop: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "30px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666666",
                        letterSpacing: "0.1em",
                      }}
                    >
                      TOTAL AMOUNT
                    </span>
                    <span style={{ fontSize: "24px", fontWeight: "800" }}>
                      {celkovaCena} CZK
                    </span>
                  </div>

                  <button
                    onClick={zaplatit}
                    disabled={platbaProbehla}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      border: "none",
                      borderRadius: "2px",
                      fontSize: "13px",
                      fontWeight: "800",
                      letterSpacing: "0.15em",
                      cursor: "pointer",
                    }}
                  >
                    {platbaProbehla ? "PROCESSING..." : "CHECKOUT"}
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