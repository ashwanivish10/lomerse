import React from "react";

interface ThemePreviewProps {
  theme: {
    primary: string;
    accent: string;
    secondary: string;
    name: string;
  } | null;
}

const ThemePre: React.FC<ThemePreviewProps> = ({ theme }) => {
  if (!theme) {
    return (
      <div className="text-center text-gray-400 text-sm py-10">
        Select a theme to preview
      </div>
    );
  }

  return (
    <div
      className="mx-auto rounded-xl border bg-white shadow-lg p-5"
      style={{
        width: "100%",
        maxWidth: "340px",
        transform: "scale(0.85)",
        transformOrigin: "top center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* LOGO + NAME */}
      <div className="text-center mb-5">
        <div
          className="font-extrabold text-xl"
          style={{ color: theme.accent }}
        >
          Lomerse Company
        </div>
        <div
          className="text-[11px] tracking-wide"
          style={{ color: theme.secondary }}
        >
          Invoice Maker
        </div>
      </div>

      {/* TITLE + RIGHT INFO */}
      <div className="flex justify-between items-start">
        <div
          className="font-extrabold text-[17px] leading-5"
          style={{ color: theme.accent }}
        >
          Business <br /> Service Bill
        </div>

        <div className="text-[10px] space-y-1 text-right" style={{ color: theme.primary }}>
          <div>Date: 03/04/22</div>
          <div>Invoice to : Monu</div>
          <div>Invoice no : #0001</div>
        </div>
      </div>

      {/* DOTTED LINE */}
      <div
        className="w-full my-4"
        style={{
          borderBottom: `2px dashed ${theme.accent}`,
        }}
      ></div>

      {/* TABLE HEADER */}
      <div
        className="grid grid-cols-3 font-bold text-[11px] py-2 rounded-full"
        style={{
          backgroundColor: theme.accent + "22",
          color: theme.primary,
        }}
      >
        <div className="pl-4">ITEM</div>
        <div className="text-center">QTY</div>
        <div className="text-right pr-4">PRICE</div>
      </div>

      {/* ITEMS LIST */}
      <div className="mt-4 space-y-3 text-[12px]" style={{ color: theme.primary }}>
        {[
          ["Normal Theme", "1", "$3.99"],
          ["Dark theme", "1", "$5.99"],
          ["Professional theme", "1", "$5.99"],
          ["Curated theme", "1", "$10.09"],
          ["Colourful Theme", "1", "$10.09"],
        ].map(([name, qty, price], i) => (
          <div key={i} className="grid grid-cols-3">
            <span className="pl-1">{name}</span>
            <span className="text-center">{qty}</span>
            <span className="text-right pr-1">{price}</span>
          </div>
        ))}
      </div>

      {/* DOTTED LINE */}
      <div
        className="w-full my-5"
        style={{
          borderBottom: `2px dashed ${theme.accent}`,
        }}
      ></div>

      {/* TOTAL SECTION */}
      <div className="text-center text-[12px] font-semibold space-y-2">
        <div style={{ color: theme.accent }}>
          TOTAL ITEM: <span className="ml-2 text-black">5</span>
        </div>

        <div style={{ color: theme.accent }}>
          AMOUNT PAID: <span className="ml-2 text-black">$2.50</span>
        </div>

        <div style={{ color: theme.accent }}>
          TAX : <span className="ml-2 text-black">0%</span>
        </div>

        <div className="pt-1 font-extrabold" style={{ color: theme.accent }}>
          TOTAL: <span className="text-black">$33.65</span>
        </div>
      </div>
    </div>
  );
};

export default ThemePre;
