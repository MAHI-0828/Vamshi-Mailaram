import React from 'react';
import { TimelineEventData, MediaType } from './types';
import Header from './components/Header';
import Timeline from './components/Timeline';
import HeroSection from './components/HeroSection';

const sampleTimelineData: TimelineEventData[] = [
  {
    id: 'event-vivo-start',
    date: 'Circa 2018-2019',
    title: 'My First Steps with a Vivo Phone',
    category: 'Mobile Photography',
    description:
      'Exploring the world of photography using just my Vivo smartphone. Learning composition, lighting, and capturing everyday moments. This phase was all about experimentation and finding my eye.',
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
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/Y0GwDwgX/IMG-20190704-175804-Original.jpg',
        altText: 'Early Vivo shot - Portrait',
        description: 'An early attempt at a street portrait.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/5976pZ6L/IMG-20191128-010649-Original.jpg',
        altText: 'Early Vivo shot - Portrait',
        description: 'A flower in bloom, capturing nature\'s beauty.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/d06q3yCr/IMG-20190524-123833-Original.jpg',
        altText: 'Early Vivo shot - Portrait',
        description: 'And my first visit to the beautiful Ellora Caves.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/T3qtNpPH/IMG-20190818-173615-01-Original.jpg',
        altText: 'Early Vivo shot - Portrait',
        description: 'On a Rainy day, back 2019',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/k5LRxymr/IMG-20181230-100435-Original.jpg',
        altText: 'Early Vivo shot - Portrait',
        description: 'Symmetry',
      },
    ],
  },
  {
    id: 'event-camera-iphoneA',
    date: 'Circa 2020-2021',
    title: 'Upgrading to Camera & First iPhone',
    category: 'Photography & Videography',
    description:
      'Took a leap by getting my first dedicated camera and an iPhone. This opened up new possibilities in terms of quality, control, and learning editing techniques for both photos and videos.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_camera_iphoneA/100/100',
    media: [
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/Jh16tSNY/IMG-8748-Original.jpg',
        altText: 'Early video edit with iPhone',
        description: 'Experimenting with video on the iPhone.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/Ls84kwyW/IMG-5598-Original.jpg',
        altText: 'First camera photo',
        description: 'One of my first shots with the new DSLR.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/6p1c5TQq/IMG-9696.avif',
        altText: 'First camera photo',
        description: 'One of my first shots with the new DSLR.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/02PTJmXW/IMG-6558.avif',
        altText: 'Early video edit with iPhone',
        description: 'Experimenting with video on the iPhone.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/XNch3qNw/IMG-2813-Original.jpg',
        altText: 'iPhone A photography example',
        description: 'Discovering the capabilities of iPhone photography.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/CxZD77FM/IMG-9008.avif',
        altText: 'iPhone A photography example',
        description: 'Discovering the capabilities of iPhone photography.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/1t0D6zyp/IMG-8919.avif',
        altText: 'iPhone A photography example',
        description: 'Discovering the capabilities of iPhone photography.',
      },
    ],
  },
  {
    id: 'event-client-dslr',
    date: '2021-2022',
    title: 'First Client Project & DSLR Upgrade',
    category: 'Professional Growth',
    description:
      'Landed my first paid client project, which motivated an upgrade to a morre advanced DSLR. Started to take on small gigs and build a professional portfolio.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_client/100/100',
    media: [
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/SsssqsHV/BIRD-FINAL.jpg',
        altText: 'Client Project Sample 1',
        description: 'Shot from a local event coverage.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/R0mSh1ZV/IMG-2615.jpg',
        altText: 'Client Project Sample 1',
        description: 'Shot from a local event coverage.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/MZgvxQVX/IMG-5644.jpg',
        altText: 'Client Project Sample 1',
        description: 'Shot from a local event coverage.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/fTZbT84J/IMG-5606.jpg',
        altText: 'New DSLR quality',
        description: 'Testing the limits of the new DSLR.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/Z5Hb9BB8/IMG-20200110-142714-Original.jpg',
        altText: 'New DSLR quality',
        description: 'Testing the limits of the new DSLR.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/P5p0Gk6Z/IMG-5232-Original-Original.jpg',
        altText: 'Client Project Sample 2',
        description: 'Product photography for a small business.',
      },
    ],
  },
  {
    id: 'event-editing-mastery',
    date: '2022',
    title: 'Mastering Lightroom & Photoshop (Before & After)',
    category: 'Photo Editing',
    description:
      'Deep dive into photo editing techniques. This period was about transforming good photos into great ones, focusing on color grading, retouching, and creative effects. Showcasing some before & after examples.',
    eventProfileImageUrl: 'https://i.postimg.cc/zvndDjGJ/DSC-1129.jpg',
    media: [
      {
        type: MediaType.BeforeAfter,
        beforeSrc: 'https://i.postimg.cc/QC1HSC7x/IMG-2357.jpg',
        afterSrc: 'https://i.postimg.cc/GmcHJcmd/IMG-2622.jpg',
        altText: 'Nature Photography Edit',
        description: 'Nature shot: Enhanced colors, contrast, and mood in Lightroom.',
        src: '' // Required by BaseMediaItem but not used
      },
      {
        type: MediaType.BeforeAfter,
        beforeSrc: 'https://i.postimg.cc/prfLz7Nm/IMG-2609.jpg',
        afterSrc: 'https://i.postimg.cc/wB1x0388/IMG-2610.jpg',
        altText: 'Product Photography Edit',
        description: 'Product photo: Refined colors and product enhancement in Photoshop.',
        src: '' // Required by BaseMediaItem but not used
      },
      {
        type: MediaType.BeforeAfter,
        beforeSrc: 'https://i.postimg.cc/59B4PZG0/IMG-2471.jpg',
        afterSrc: 'https://i.postimg.cc/4NwJGpXR/IMG-2329.jpg',
        altText: 'Wildlife Photography Edit',
        description: 'Wildlife capture: Enhanced details and dramatic mood.',
        src: '' // Required by BaseMediaItem but not used
      },
      {
        type: MediaType.BeforeAfter,
        beforeSrc: 'https://i.postimg.cc/BQzV2vg1/IMG-2458.jpg',
        afterSrc: 'https://i.postimg.cc/3JkLrTTr/IMG-2577.jpg',
        altText: 'Wildlife Photography Edit',
        description: 'Wildlife scene: Improved contrast and color balance.',
        src: '' // Required by BaseMediaItem but not used
      },
      {
        type: MediaType.BeforeAfter,
        beforeSrc: 'https://i.postimg.cc/1zB0cCQY/IMG-2613.jpg',
        afterSrc: 'https://i.postimg.cc/R0mSh1ZV/IMG-2615.jpg',
        altText: 'Wildlife Photography Edit',
        description: 'Bird photography: Enhanced details and natural colors.',
        src: '' // Required by BaseMediaItem but not used
      },
      {
        type: MediaType.BeforeAfter,
        beforeSrc: 'https://i.postimg.cc/85svdTwj/IMG-2628.jpg',
        afterSrc: 'https://i.postimg.cc/GhDNRyGh/IMG-2614.jpg',
        altText: 'Wildlife Photography Edit',
        description: 'Wildlife portrait: Improved lighting and mood.',
        src: '' // Required by BaseMediaItem but not used
      }
    ],
  },
  {
    id: 'event-upgraded-iphone-reels',
    date: 'Circa 2022 - Present',
    title: 'Advanced iPhone & Instagram Reels',
    category: 'Mobile Content Creation',
    description:
      'Mastering content creation with an upgraded iPhone. Focused on producing high-quality Instagram Reels, travel vlogs, and leveraging advanced mobile editing apps.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_iphone_pro/100/100',
    media: [
      {
        type: MediaType.InstagramReel,
        src: 'https://player.vimeo.com/video/1088597919?h=7f0c8f7c7c',
        altText: 'Recent Instagram Reel',
        description: 'A quick edit for an Instagram Reel.',
      },
      {
        type: MediaType.InstagramReel,
        src: 'https://player.vimeo.com/video/1088598102?h=7f0c8f7c7c',
        altText: 'Advanced iPhone photo - Night mode',
        description: 'Exploring night mode on the new iPhone.',
      },
      {
        type: MediaType.InstagramReel,
        src: 'https://player.vimeo.com/video/1088598048?h=7f0c8f7c7c',
        altText: 'Advanced iPhone photo - Night mode',
        description: 'Exploring night mode on the new iPhone.',
      },
      {
        type: MediaType.InstagramReel,
        src: 'https://player.vimeo.com/video/1088598021?h=7f0c8f7c7c',
        altText: 'Advanced iPhone photo - Night mode',
        description: 'Exploring night mode on the new iPhone.',
      },
      {
        type: MediaType.InstagramReel,
        src: 'https://player.vimeo.com/video/1088598077?h=7f0c8f7c7c',
        altText: 'Advanced iPhone photo - Cinematic',
        description: 'Attempting a cinematic shot with iPhone.',
      },
    ],
  },
  {
    id: 'event-drone-videography',
    date: '2023',
    title: 'Exploring Drone Videography',
    category: 'Aerial Videography',
    description:
      'Added a drone to my toolkit, opening up new perspectives for videography. Learning flight controls, aerial composition, and editing drone footage.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_drone/100/100',
    media: [
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/R0s5nkMZ/IMG-5761-Original.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://res.cloudinary.com/dfxvu4nio/image/upload/v1748481572/IMG_2670_Original_wnfpqq.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/PrBgWbs1/IMG-2452.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/3JkLrTTr/IMG-2577.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/Vs3wgPXS/IMG-5785-Original-Original.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/dVPfkqrB/IMG-2578.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/W17PsDCr/IMG-5764-Original-Original.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://res.cloudinary.com/dfxvu4nio/image/upload/v1748481571/IMG_2669_Original_ulm8vv.jpg',
        altText: 'Top-down Drone Shot',
        description: 'Experimenting with top-down perspectives.',
      },
    ],
  },
  /*
  {
    id: 'event-youtube-showcase',
    date: '2023-2024',
    title: 'YouTube Content Creation',
    category: 'Video Production',
    description: 'A collection of my favorite YouTube content, showcasing various video production techniques and storytelling approaches.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_youtube/100/100',
    media: [
      {
        type: MediaType.YouTubeVideo,
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        altText: 'Sample YouTube Video 1',
        description: 'Creative storytelling through video.',
      },
      {
        type: MediaType.YouTubeVideo,
        src: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        altText: 'Sample YouTube Video 2',
        description: 'First YouTube video ever uploaded.',
      },
      {
        type: MediaType.YouTubeVideo,
        src: 'https://www.youtube.com/embed/Y8Wp3dafaMQ',
        altText: 'Sample YouTube Video 3',
        description: 'Beautiful nature documentary.',
      },
      {
        type: MediaType.YouTubeVideo,
        src: 'https://www.youtube.com/embed/LXb3EKWsInQ',
        altText: 'Sample YouTube Video 4',
        description: 'Cinematic nature footage.',
      },
      {
        type: MediaType.YouTubeVideo,
        src: 'https://www.youtube.com/embed/K1QICrgxTjA',
        altText: 'Sample YouTube Video 5',
        description: 'Advanced editing techniques.',
      }
    ],
  },
  */
  {
    id: 'event-travel-documentary',
    date: 'Ongoing',
    title: 'Major Travel Documentary: The Mountain Peaks',
    category: 'Documentary Filmmaking',
    description:
      'Currently working on a personal passion project - a travel documentary series focused on mountain landscapes and cultures. This involves extensive travel, filming, and storytelling.',
    eventProfileImageUrl: 'https://picsum.photos/seed/me_travel_doc/100/100',
    media: [
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/bwg4K7S9/IMG-5863-Original-Original.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/FKn8K0Zf/IMG-4843-Original.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/5NqrChgW/IMG-4030.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
      {
        type: MediaType.Image,
        src: 'https://i.postimg.cc/8CsXxjST/IMG-6900.jpg',
        altText: 'Aerial Landscape',
        description: 'Capturing landscapes from a new angle.',
      },
    ],
  },
];

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
