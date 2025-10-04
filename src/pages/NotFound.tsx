import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="text-center animate-fade-in-scale max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-calm mb-6">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Pagină negăsită</h2>
        <p className="mb-8 text-muted-foreground">
          Ne pare rău, dar pagina pe care o cauți nu există.
        </p>
        <Link to="/">
          <Button className="h-11 px-6">
            Înapoi la pagina principală
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
