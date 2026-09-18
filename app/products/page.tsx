import { SiteShell } from "@/components/site-shell";

const products = [
  { name: "Gentle cleanser", category: "Cleansers", summary: "Non-stripping formulas with low fragrance and skin-supportive surfactants." },
  { name: "Barrier cream", category: "Moisturizers", summary: "Helps maintain hydration and supports comfort for dry or sensitized skin." },
  { name: "Daily SPF 50", category: "Sunscreens", summary: "Broad-spectrum protection is a key part of long-term skin wellness." },
  { name: "Niacinamide serum", category: "Serums", summary: "Can support a smoother-looking skin appearance and visible oil balance." },
  { name: "Ceramide moisturizer", category: "Barrier-care", summary: "A useful category for dryness and sensitivity concerns." },
];

export default function ProductsPage() {
  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2b8a6b]">Products</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Ingredient-focused education</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.name} className="card-surface rounded-[2rem] p-6">
              <p className="text-sm text-[#2b8a6b]">{product.category}</p>
              <h2 className="mt-3 text-xl font-bold text-slate-900">{product.name}</h2>
              <p className="mt-4 text-slate-600">{product.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
