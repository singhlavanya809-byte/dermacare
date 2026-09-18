import { SiteShell } from "@/components/site-shell";

const ingredients = [
  {
    name: "Niacinamide",
    use: "Helps support the skin barrier and oil balance in everyday routines.",
    types: ["Oily", "Combination", "Sensitive"],
    notes: "Introduce slowly and patch test if reactive.",
  },
  {
    name: "Hyaluronic Acid",
    use: "Helps improve hydration and skin comfort, particularly when paired with a moisturizer.",
    types: ["Dry", "Normal", "Combination"],
    notes: "Use on damp skin and seal it with a moisturizer.",
  },
  {
    name: "Salicylic Acid",
    use: "Can help with appearance of clogged pores and oilier skin concerns.",
    types: ["Oily", "Combination"],
    notes: "Avoid if you have open, broken, or highly irritated skin.",
  },
  {
    name: "Vitamin C",
    use: "Helps brighten the look of skin and is often used in morning routines.",
    types: ["Normal", "Combination"],
    notes: "Patch test before regular use and use sunscreen with it.",
  },
  {
    name: "Ceramides",
    use: "Support the skin barrier and help retain moisture.",
    types: ["Dry", "Sensitive", "Normal"],
    notes: "A gentle, widely tolerated option for many routines.",
  },
];

export default function IngredientsPage() {
  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2b8a6b]">Ingredients</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Learn the basics behind common skincare ingredients</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ingredients.map((ingredient) => (
            <div key={ingredient.name} className="card-surface rounded-[2rem] p-6">
              <h2 className="text-xl font-bold text-slate-900">{ingredient.name}</h2>
              <p className="mt-4 text-slate-600">{ingredient.use}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ingredient.types.map((type) => <span key={type} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{type}</span>)}
              </div>
              <p className="mt-4 text-sm text-slate-500">{ingredient.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
