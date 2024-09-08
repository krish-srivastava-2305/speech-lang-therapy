import { HoveredLink } from "@/components/ui/navbar-menu";
import {
  Calendar,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import Image from "next/image";
// import { useState } from "react";

export default function Home() {
  // const [activeTab, setActiveTab] = useState('patients');

  const FeatureCard = ({
    icon,
    title,
    description,
  }: {
    icon: any;
    title: any;
    description: any;
  }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl text-gray-600 font-semibold mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-center">{description}</p>
      </div>
    );
  };

  const TestimonialCard = ({ quote, author }: { quote: any; author: any }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 italic mb-4">`{quote}`</p>
        <p className="font-semibold">- {author}</p>
      </div>
    );
  };

  const FAQItem = ({ question, answer }: { question: any; answer: any }) => {
    return (
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold mb-2">{question}</h3>
        <p className="text-black">{answer}</p>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-black">
      {/* <h1>Speech Lang Therapy</h1> */}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100  rounded-2xl">
        <header className="bg-white shadow-sm sticky top-0 z-10 rounded-2xl">
          <nav className="container mx-auto px-6 py-3 flex justify-between items-center rounded-2xl ">
            <div className="text-2xl font-bold text-indigo-600">Speechदी </div>
            {/* <div className="space-x-4">
            <a href="#home" className="text-gray-600 hover:text-indigo-600">Home</a>
            <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600">About</a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600">Testimonials</a>
            <a href="#faq" className="text-gray-600 hover:text-indigo-600">FAQ</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600">Contact</a>
          </div> */}
          </nav>
        </header>

        <main>
          <section id="home" className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Connecting Patients, Therapists, and Supervisors
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline your therapy practice with our digitized platform
              </p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition duration-300 flex items-center mx-auto group">
                Get Started <ChevronRight className="ml-2" />
                {/* <div className="absolute left-0 right-0 mt-2 w-full invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  <div className="flex flex-col space-y-2 text-sm bg-white rounded-lg shadow-lg overflow-hidden w-40">
                    <HoveredLink href="/supervisor/login">Supervisor</HoveredLink>
                    <HoveredLink href="/therapist/login">Therapist</HoveredLink>
                    <HoveredLink href="/patient/login">Patient</HoveredLink>
                  </div>
                </div> */}
              </button>
            </div>
          </section>

          <section id="features" className="bg-white py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-black mb-8">
                Key Features
              </h2>
              <div className="grid md:grid-cols-3 gap-8 ">
                <FeatureCard
                  icon={<Users className="w-12 h-12 text-indigo-600" />}
                  title="Seamless Collaboration"
                  description="Connect patients, therapists, and supervisors in one secure platform."
                />
                <FeatureCard
                  icon={<Calendar className="w-12 h-12 text-indigo-600" />}
                  title="Easy Scheduling"
                  description="Manage appointments and sessions effortlessly with our intuitive calendar."
                />
                <FeatureCard
                  icon={<Shield className="w-12 h-12 text-indigo-600" />}
                  title="Institutional Transparency"
                  description="Transparent messaging between therepist and patient for smooth functioning."
                />
              </div>
            </div>
          </section>

          <section id="about" className="py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-8 text-black">
                About Speechदी
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Speechदी was founded with a mission to revolutionize the way
                health care is delivered. Our platform brings together patients,
                therapists, and supervisors in a secure, efficient, and
                user-friendly environment.
              </p>
              <p className="text-lg text-gray-600">
                With years of experience in both therapy and technology, our
                team understands the unique challenges faced by health
                professionals and their clients. We have designed Speechदी to
                address these challenges head-on, providing a comprehensive
                solution that enhances communication, streamlines administrative
                tasks, and ultimately improves patient outcomes.
              </p>
            </div>
          </section>

          <section id="testimonials" className="bg-indigo-100 py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-black mb-8">
                What Our Users Say
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <TestimonialCard
                  quote="Speechदी has transformed the way I manage my practice. It's intuitive, secure, and my patients love it!"
                  author="Dr. Titiksha Mukhopadhyaya, Clinical Psychologist"
                />
                <TestimonialCard
                  quote="As a supervisor, I can easily oversee multiple therapists and provide timely feedback. It's a game-changer for our clinic."
                  author="Dr. Krish Srivastava, Therapy Supervisor"
                />
              </div>
            </div>
          </section>

          <section id="faq" className="py-12 bg-slate-300">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-8 text-black">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <FAQItem
                  question="Is Speechदी HIPAA compliant?"
                  answer="Yes, Speechदी is fully HIPAA compliant. We use state-of-the-art encryption and security measures to protect all patient data."
                />
                <FAQItem
                  question="Can I integrate Speechदी with my existing systems (Upcoming Features)?"
                  answer="Absolutely! Speechदी offers API integration with many popular practice management and EHR systems. Contact our support team for more details."
                />
                {/* <FAQItem
                question="How does billing work on Speechदी?"
                answer="Speechदी includes a comprehensive billing system that can handle insurance claims, copays, and direct patient billing. We also offer integration with popular payment processors."
              /> */}
              </div>
            </div>
          </section>

          <section id="contact" className="bg-white py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-8">
                Contact Us
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <p className="mb-4">
                    Have questions or need support? We are here to help!
                  </p>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <Mail className="mr-2" /> support@Speechदी.com
                    </p>
                    <p className="flex items-center">
                      <Phone className="mr-2" /> +1 (555) 123-4567
                    </p>
                    <p className="flex items-center">
                      <MapPin className="mr-2" /> 123 Therapy St, Mental Health
                      City, JH 12345
                    </p>
                  </div>
                </div>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Your Message"
                    className="w-full p-2 border rounded h-32"
                  ></textarea>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-300">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; 2024 Speechदी. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
