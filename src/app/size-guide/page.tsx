import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Size Guide | VELKORA" };

const categories = [
  {
    name: "Men's Tops",
    headers: ["Size", "Chest (cm)", "Waist (cm)", "Shoulder (cm)"],
    rows: [
      ["XS", "86–91", "71–76", "41"],
      ["S", "91–96", "76–81", "43"],
      ["M", "96–101", "81–86", "45"],
      ["L", "101–107", "86–91", "47"],
      ["XL", "107–112", "91–96", "49"],
      ["XXL", "112–117", "96–101", "51"],
    ],
  },
  {
    name: "Women's Tops",
    headers: ["Size", "Bust (cm)", "Waist (cm)", "Hips (cm)"],
    rows: [
      ["XS", "76–81", "61–66", "86–91"],
      ["S", "81–86", "66–71", "91–96"],
      ["M", "86–91", "71–76", "96–101"],
      ["L", "91–97", "76–82", "101–107"],
      ["XL", "97–103", "82–88", "107–113"],
    ],
  },
];

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="pt-40 pb-24 px-6 md:px-12 max-w-screen-lg mx-auto">
        <h4 className="text-xs tracking-[0.3em] uppercase font-mono text-[#C8A97E] mb-4">Fit</h4>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">Size Guide</h1>
        <p className="text-black/60 mb-16 text-lg max-w-xl">All measurements are in centimetres. For the best fit, measure your body and compare to the size chart below.</p>
        <div className="space-y-16">
          {categories.map(cat => (
            <div key={cat.name}>
              <h2 className="text-2xl font-display font-bold mb-6 border-b border-black/10 pb-4">{cat.name}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-left">
                      {cat.headers.map(h => (
                        <th key={h} className="py-3 pr-8 text-xs tracking-widest uppercase text-black/40 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.rows.map((row, i) => (
                      <tr key={i} className="border-t border-black/5">
                        {row.map((cell, j) => (
                          <td key={j} className="py-4 pr-8 text-black/70">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
