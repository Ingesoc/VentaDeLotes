import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const isHttpError = isRouteErrorResponse(error);

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-surface">
      <div className="max-w-md text-center">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary mb-4">
          {isHttpError ? error.status : "Error"}
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">
          {isHttpError
            ? error.statusText
            : "Ocurrió un error inesperado. Intenta de nuevo."}
        </p>
        <Link
          to="/"
          className="inline-block bg-heritage-gold text-primary px-8 py-4 rounded-lg font-label-bold hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
