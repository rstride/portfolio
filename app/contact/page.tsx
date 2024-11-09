// app/contact/page.tsx
'use client';
import { useState } from 'react';

export const metadata = {
  title: 'Contact Me - rstride Portfolio',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('Your message has been sent successfully!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setStatus('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-bold mb-8 text-center">Contact Me</h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <textarea
            placeholder="Message"
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-600 rounded hover:bg-green-500 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
        {status && <p className="mt-5 text-center text-green-500">{status}</p>}
      </div>
    </section>
  );
}
