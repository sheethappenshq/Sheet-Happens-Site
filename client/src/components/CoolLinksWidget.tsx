interface Link {
  name: string;
  url: string;
}

// todo: remove mock functionality
const coolLinks: Link[] = [
  { name: 'Yahoo!', url: '#' },
  { name: 'Lycos', url: '#' },
  { name: 'AltaVista', url: '#' },
  { name: 'GeoCities', url: '#' }
];

export default function CoolLinksWidget() {
  return (
    <div className="bg-accent text-accent-foreground p-3 border-2 border-muted">
      <h3 className="font-bold text-center mb-2 uppercase">
        COOL LINKS!
      </h3>
      <ul className="text-xs space-y-1">
        {coolLinks.map((link, index) => (
          <li key={index}>
            <a 
              href={link.url} 
              className="text-blue-600 underline hover:text-blue-800"
              data-testid={`link-cool-${index}`}
            >
              • {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}