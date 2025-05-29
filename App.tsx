import React from 'react';
import { TimelineEventData, MediaType } from './types';
import Header from './components/Header';
import Timeline from './components/Timeline';
import HeroSection from './components/HeroSection';

const sampleTimelineData: TimelineEventData[] = [
  {
    id: 'event-vivo-start',
    date: '2018 – 2019',
    title: 'First steps with Vivo',
    category: 'Mobile Photography',
    description: 'Started with a Vivo phone, capturing simple moments that sparked my passion.',
    photoGroupDescription: 'Raw campus life and candid shots, full of youthful energy. Started with some good portraits and symmetry.',
    eventProfileImageUrl: 'https://i.postimg.cc/zvndDjGJ/DSC-1129.jpg',
    media: [
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/j2zmpzQB/IMG-20190604-182315-01-01-Original.jpg',
        altText: 'Early Vivo shot - Landscape',
        description: 'A misty morning landscape captured with Vivo.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/J0qK3KQ7/IMG-20200208-174105-Original-2.jpg',
        altText: 'Early Vivo shot - Macro',
        description: 'Close-up of a flower, exploring macro.',
      },
      // ... add the rest media items here as before
    ],
  },
  {
    id: 'event-camera-iphoneA',
    date: '2020 – 2021',
    title: 'From Vivo to iPhone',
    category: 'Photography & Videography',
    description: 'Moved to better gear and honed my skills through new creative possibilities.',
    photoGroupDescription: 'Portraits and street scenes with sharper focus and emotion.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_camera_iphoneA/100/100',
    media: [
      // your media items here...
    ],
  },
  {
    id: 'event-client-dslr',
    date: '2021 – 2022',
    title: 'Mastering the DSLR: Professional Gear & Techniques',
    category: 'Professional Growth',
    description: 'Transitioned to DSLR, unlocking full control and creative freedom.',
    photoGroupDescription: 'Rich, detailed shots showing advanced photography skills.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_client/100/100',
    media: [
      // your media items here...
    ],
  },
  {
    id: 'event-editing-mastery',
    date: '2021 – Present',
    title: 'The Art of Transformation: Before & After Edits',
    category: 'Photo Editing',
    description: 'Editing turns raw shots into stories with color and mood.',
    photoGroupDescription: 'Side-by-side images showing transformation and creativity.',
    quotes: [
      'See the magic behind every frame.',
      'The real story lies beneath the surface.',
    ],
    eventProfileImageUrl: 'https://i.postimg.cc/zvndDjGJ/DSC-1129.jpg',
    media: [
      // your media items here...
    ],
  },
  {
    id: 'event-upgraded-iphone-reels',
    date: '2021 – Present',
    title: 'Moving Moments: Storytelling with Instagram Reels',
    category: 'Mobile Content Creation',
    description: 'Telling stories through short, moving clips on social media.',
    photoGroupDescription: 'Dynamic, lively moments captured in video snippets.',
    quotes: [
      'Every reel is a heartbeat shared.',
      'Slowing life down to remember it better.',
    ],
    eventProfileImageUrl: 'https://picsum.photos/seed/me_iphone_pro/100/100',
    media: [
      // your media items here...
    ],
  },
  {
    id: 'event-wedding-highlights',
    date: '2021 – 2022',
    title: 'Capturing Forever: Wedding Photography Highlights',
    category: 'Wedding Photography',
    description: 'Freezing emotional moments on couples’ special days.',
    photoGroupDescription: 'Smiles, tears, and celebrations full of love.',
    eventProfileImageUrl: 'https://your-image-url.jpg',
    media: [
      // your media items here...
    ],
  },
  {
    id: 'event-astro-pictures',
    date: '2020',
    title: 'Beyond Earth: Astrophotography Pictures',
    category: 'Astrophotography',
    description: 'Exploring starry skies and sharing stories through video.',
    photoGroupDescription: 'Stunning night skies and creative content creation.',
    eventProfileImageUrl: 'https://your-astro-image-url.jpg',
    media: [
      // your media items here...
    ],
  },
];

// Social links unchanged, assuming you want them as is
const socialLinks = {
  instagram: 'https://instagram.com/your.handle',
  facebook: 'https://facebook.com/your.page',
  twitter: 'https://twitter.com/your.handle',
  linkedin: 'https://linkedin.com/in/your.profile',
  behance: 'https://behance.net/your.portfolio'
};

const App: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-gray-900"
      style={{ fontFamily: "'Averia Serif Libre', cursive" }}
    >
      <Header />
      <main className="flex-grow">
        <HeroSection
          name="Vamshi Mailaram"
          professionalSummary="Passionate visual storyteller, capturing moments and crafting narratives through photography and videography."
          profileImageUrl="https://i.postimg.cc/0yVkXJfV/Vamsiiiiii-dpp.jpg"
          backgroundImageUrl="https://i.postimg.cc/1zGmKNb7/IMG-7447-2-Original-Original.jpg"
          profileImageClass="object-contain w-40 h-40 rounded-full mx-auto mb-6 border-4 border-gray-300 shadow-xl shadow-gray-300/30"
          backgroundImageClass="bg-cover bg-center"
        />

        {/* Pass the updated sampleTimelineData to Timeline */}
        <Timeline events={sampleTimelineData} />

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Let's Work Together</h2>
            <p className="text-gray-300 mb-8">
              I'm available for freelance work, collaborations, and creative projects.
              Feel free to reach out to discuss your vision.
            </p>
            <div className="space-y-4">
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span>{' '}
                <a href="mailto:mailaram.saivamshi8096@gmail.com" className="text-blue-400 hover:text-blue-300">
                  mailaram.saivamshi8096@gmail.com
                </a>
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Phone:</span>{' '}
                <a href="tel:+918309304072" className="text-blue-400 hover:text-blue-300">
                  +91 8309304072
                </a>
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Location:</span>{' '}
                Available for projects
              </p>
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center space-x-8">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <span className="sr-only">{platform}</span>
                  <i className={`fab fa-${platform} text-2xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-gray-300 text-sm font-['Roboto Mono'] bg-transparent backdrop-blur-md shadow-none">
        <p>&copy; {new Date().getFullYear()} Vamshi Mailaram. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
          {' • '}
          <a href="/terms" className="hover:text-white">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
