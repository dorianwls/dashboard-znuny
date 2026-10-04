import { Button } from "@/components/ui/button";
import { DEFAULT_ROUTE } from "@/lib/menu";
import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-xl font-semibold">Esta página no existe</h1>
      <Button asChild variant="link" className="mt-3">
        <Link to={DEFAULT_ROUTE}>Ir al análisis del servicio</Link>
      </Button>
    </div>
  );
}
