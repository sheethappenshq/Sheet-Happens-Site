import { Card, CardContent } from '@/components/ui/card';
import RetroButton from './RetroButton';

// todo: remove mock functionality - replace with real product data
const mockProducts = [
  {
    id: 1,
    name: 'Math Emergency Kit',
    image: '/attached_assets/generated_images/Math_formulas_cheat_sheet_f89fb713.png',
    price: '$9.99',
    description: 'Algebra, Calculus, Geometry - All the formulas you need!'
  },
  {
    id: 2,
    name: 'Chemistry Crisis Pack',
    image: '/attached_assets/generated_images/Chemistry_reference_cheat_sheet_0ae54c8a.png',
    price: '$8.99',
    description: 'Periodic table, reactions, and molecular structures'
  },
  {
    id: 3,
    name: 'History Timeline Saver',
    image: '/attached_assets/generated_images/History_timeline_study_guide_7f9abb58.png',
    price: '$7.99',
    description: 'Key dates, events, and historical periods covered'
  },
  {
    id: 4,
    name: 'Physics Formula Arsenal',
    image: '/attached_assets/generated_images/Physics_formulas_reference_sheet_9458c61a.png',
    price: '$9.99',
    description: 'Newton\'s laws, electromagnetics, and thermodynamics'
  }
];

export default function ProductGallery() {
  const handlePurchase = (productName: string) => {
    console.log(`Purchase clicked for: ${productName}`);
    // todo: remove mock functionality - implement real purchase logic
  };

  return (
    <section className="py-8 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-accent text-center mb-8 uppercase tracking-wider">
          💀 EMERGENCY CHEAT SHEETS 💀
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="border-4 border-card-border hover:border-accent transition-colors hover-elevate" data-testid={`card-product-${product.id}`}>
              <CardContent className="p-4">
                <div className="aspect-[3/4] mb-4 overflow-hidden rounded border-2 border-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid={`img-product-${product.id}`}
                  />
                </div>
                
                <h3 className="text-lg font-bold text-primary mb-2 uppercase" data-testid={`text-name-${product.id}`}>
                  {product.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-description-${product.id}`}>
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-accent" data-testid={`text-price-${product.id}`}>
                    {product.price}
                  </span>
                  <RetroButton
                    variant="glow"
                    size="sm"
                    onClick={() => handlePurchase(product.name)}
                    data-testid={`button-buy-${product.id}`}
                  >
                    BUY
                  </RetroButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}