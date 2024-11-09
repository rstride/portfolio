// app/skills/page.tsx
export const metadata = {
  title: 'Skills - rstride Portfolio',
};

export default function Skills() {
  const skills = [
    { name: 'C/C++', level: 95 },
    { name: 'Python', level: 90 },
    { name: 'Reverse Engineering', level: 85 },
    { name: 'Network Security', level: 80 },
    { name: 'Cryptography', level: 75 },
  ];

  return (
    <section id="skills" className="py-20 bg-gray-800">
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-bold mb-8 text-center">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill) => (
            <div key={skill.name}>
              <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
              <div className="w-full bg-gray-700 h-4 rounded">
                <div
                  className="bg-green-500 h-4 rounded"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
