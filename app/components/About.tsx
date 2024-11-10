// app/components/About.tsx

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-800">
    <div className="container mx-auto px-5">
      <h2 className="text-4xl font-bold mb-8 text-center">À Propos de Moi</h2>
      <div className="max-w-3xl mx-auto text-lg leading-relaxed">
      <p className="mb-6">
        Je suis un spécialiste en cybersécurité passionné par la protection des systèmes et des données.
        Pendant mon temps à l'école 42, j'ai perfectionné mes compétences en programmation bas niveau et
        développé une compréhension approfondie des protocoles de sécurité.
      </p>
      <p>
        Je suis impatient d'apporter mon expertise à des projets stimulants et de collaborer avec
        des professionnels partageant les mêmes idées. Travaillons ensemble pour rendre le monde numérique plus sûr.
      </p>
      </div>
    </div>
    </section>
  );
}
