import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ---------------------------------------------------------------------------
// SmoothScrollHero
// Recreation of the hover.dev SmoothScrollHero component.
// Built with React + Framer Motion (useScroll / useTransform) + Tailwind CSS.
//
// Layout:
//   - A tall scrollable container (~300 vh) with a sticky inner viewport.
//   - Several parallax image cards that are stacked and scale up as you
//     scroll past them, creating a "zoom reveal" effect.
//   - A schedule / content section at the bottom with dark alternating rows.
//
// Dependencies:
//   npm install framer-motion
//   (Tailwind CSS must already be configured in your project)
// ---------------------------------------------------------------------------

export const SmoothScrollHero = () => {
  return (
    <div className="bg-zinc-950">
      <Hero />
      <Schedule />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Hero – sticky parallax image stack
// ---------------------------------------------------------------------------

const IMG_PADDING = 12;

const Hero = () => {
  return (
    <div
      style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}
    >
      <div className="relative h-[200px]">
        <CenterImage />
      </div>
      <ParallaxImages />
    </div>
  );
};

const CenterImage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <motion.div
      style={{ opacity, scale }}
      ref={ref}
      className="sticky top-0 h-screen overflow-hidden"
      // The hero heading that appears before the parallax section
    >
      <HeroTitle />
    </motion.div>
  );
};

const HeroTitle = () => (
  <div className="flex h-full flex-col items-center justify-center text-white">
    <p className="mb-2 text-center text-base font-semibold uppercase tracking-widest text-zinc-400">
      Scroll to explore
    </p>
    <h1 className="text-center text-5xl font-black uppercase leading-[1.1] md:text-7xl">
      See what&apos;s{" "}
      <span className="text-indigo-400">possible</span>
    </h1>
  </div>
);

// ---------------------------------------------------------------------------
// ParallaxImages – the sticky scaling image stack
// ---------------------------------------------------------------------------

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="https://images.unsplash.com/photo-1622244580594-2d9e51cd5f98?w=800"
        alt="Abstract architecture"
        start={-200}
        end={200}
        className="w-2/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1614974122722-5f5b08cc6c2f?w=800"
        alt="City at night"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800"
        alt="Mountain landscape"
        start={-200}
        end={200}
        className="ml-auto w-1/2"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
        alt="Ocean waves"
        start={0}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useTransform(
    [y],
    ([latestY]) => `translateY(${latestY}px)`
  );

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${className} rounded-3xl object-cover`}
      ref={ref}
      style={{ transform, scale, opacity }}
    />
  );
};

// ---------------------------------------------------------------------------
// Schedule – dark rows section at the bottom
// ---------------------------------------------------------------------------

const schedule = [
  {
    title: "Opening Keynote",
    date: "Feb 12th",
    location: "Main Stage",
    time: "9:00 AM",
  },
  {
    title: "Design Systems Deep Dive",
    date: "Feb 12th",
    location: "Room A",
    time: "11:00 AM",
  },
  {
    title: "Animation Workshop",
    date: "Feb 12th",
    location: "Workshop Hall",
    time: "2:00 PM",
  },
  {
    title: "Framer Motion Masterclass",
    date: "Feb 13th",
    location: "Main Stage",
    time: "10:00 AM",
  },
  {
    title: "Accessible Interactions",
    date: "Feb 13th",
    location: "Room B",
    time: "1:00 PM",
  },
  {
    title: "Closing Ceremony",
    date: "Feb 13th",
    location: "Main Stage",
    time: "5:00 PM",
  },
];

const Schedule = () => {
  return (
    <section
      id="schedule"
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <motion.h2
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50"
      >
        Schedule
      </motion.h2>

      {schedule.map((item) => (
        <ScheduleItem key={item.title} {...item} />
      ))}
    </section>
  );
};

const ScheduleItem = ({ title, date, location, time }) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{location}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end">
        <p className="text-sm uppercase text-zinc-500">{date}</p>
        <p className="text-sm uppercase text-zinc-500">|</p>
        <p className="text-sm uppercase text-zinc-500">{time}</p>
      </div>
    </motion.div>
  );
};

export default SmoothScrollHero;
