import { type FC } from 'react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'

interface TeamMember {
  name: string
  role: string
  image: string
  linkedin?: string
  github?: string
}

const members: TeamMember[] = [
  {
    name: 'Udaykumar Dhokia',
    role: 'Full-Stack Developer',
    image: '/team/ud.png',
    linkedin: 'https://linkedin.com/in/udthedeveloper',
    github: 'https://github.com/udaykumar-dhokia',
  },
  {
    name: 'Prasanna H.',
    role: 'Backend Developer',
    image: '/team/prasanna.jpg',
    linkedin: 'https://www.linkedin.com/in/prasanna-h-28b07b27b/',
    github: 'https://github.com/prasanna00019',
  },
  {
    name: 'Vaibhavi Katiyar',
    role: 'AI Developer',
    image: '/team/vaibhavi.jpeg',
    linkedin: 'https://linkedin.com/in/vaibhavi-katiyar',
    github: 'https://github.com/vaibhavi089',
  },
]

const Team: FC = () => {
  return (
    <section className="text-gray-600 body-font bg-gray-50">
      <div className="container px-4 sm:px-6 lg:px-8 py-16 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold title-font mb-4 text-gray-900">
            Meet Our Team
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-600">
            We’re a passionate group of developers and innovators, building
            scalable and impactful solutions together.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.name}
              className="p-6 flex flex-col items-center text-center transition hover:shadow-lg"
            >
              <img
                alt={member.name}
                src={member.image}
                className="rounded-full w-40 h-40 sm:w-48 sm:h-48 object-cover object-center mb-4 border-4 border-gray-200"
              />
              <h2 className="title-font font-semibold text-lg sm:text-xl text-gray-900">
                {member.name}
              </h2>
              <h3 className="text-primary font-medium mb-3 text-sm sm:text-base">
                {member.role}
              </h3>
              <div className="inline-flex gap-4">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-black transition"
                  >
                    <FaGithub className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
