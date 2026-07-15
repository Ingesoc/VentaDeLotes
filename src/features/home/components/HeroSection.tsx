export function HeroSection() {
  return (
    <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('../../../public/landscapes/Loteo General.webp')" }}
      >
        <img
          alt="Vista aérea espectacular del plan maestro de Verdant Horizon en Quindío, Colombia, con paisajes verdes y lotes orgánicos"
          className="sr-only"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2A-MLEIZ47eoGgPwpSHu6mpup3ATK3q_4QGVxmqWaMCUPQ60P7UMErmk7z4IMO9jrU7HKZ-zi733JDsxdSd163XACzdsOKQeESvRZfFQAuk6yE9dkoRynKWFRAlhVKXkSwI4o3qfPNuMgVSEV1GAFegm4QlnY-sCiIV-1ApyraW7_BkIWeTLLN9kByk2Cj5IXbGPQR4f_P9kNKpPQtqD2tVQiPr8ut91nNkgp67HdO4NZYLlnxvM6L0GhKECWw6EkcA"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-deep-forest/40"></div>
      <div className="relative z-20 text-center px-margin-mobile max-w-4xl mx-auto flex flex-col items-center gap-8 mt-20">
        <h1 className="font-display-lg text-4xl md:text-display-lg text-warm-white drop-shadow-lg leading-tight">
          Lotes Quindío - Exclusividad en el Corazón del Eje Cafetero
        </h1>
        <a
          className="bg-soft-gold text-deep-forest px-8 py-4 rounded-lg font-body-lg font-medium hover:brightness-110 transition-all shadow-xl mt-4 inline-block"
          href="#lotes"
        >
          Conoce los lotes disponibles
        </a>
      </div>
    </header>
  );
}
