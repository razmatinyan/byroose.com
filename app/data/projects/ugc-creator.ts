import { defineProject } from "@/lib/projects";

export default defineProject({
   slug: "ugc-creator",
   name: "UGC Creator",
   description:
      "A virtual UGC creator: one consistent face who tries on clothes and films get ready with me videos.",
   categories: ["Reel", "Video", "Image"],
   surface: { color: "oklch(0.9127 0.0718 93.54)", ink: "dark" },
   cover: {
      kind: "video",
      src: "/images/work/ugc-creator/cover.mp4",
      poster: "/images/work/ugc-creator/og-image.jpg",
      width: 1920,
      height: 1080,
      alt: "The AI UGC creator getting ready in a yellow sweatshirt, wide-leg jeans, and a brown suede bag",
   },
   blocks: [
      {
         type: "text",
         title: "The brief",
         align: "right",
         paragraphs: [
            "We wanted to make a UGC creator from scratch: one person who tries on clothes, talks to the camera, and films get ready with me videos that look like they came from a real phone.",
            "Working with a real creator means casting, shipping samples, and booking a shoot every time. We built ours with AI and edited every frame by hand, so the same face can come back for any new outfit.",
            "We designed her first: natural hair, light makeup, nothing too polished. That face became the reference for every frame. Then we gave her a plain starting outfit of a black tee, grey sweat shorts, and white socks for the before part of the video.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/ugc-creator/image-1.jpg",
               width: 1600,
               height: 1200,
               alt: "Portrait of the AI UGC creator with shoulder-length brown hair and a black top on a lime background",
            },
            {
               kind: "image",
               src: "/images/work/ugc-creator/image-2.jpg",
               width: 1600,
               height: 1200,
               alt: "Starting outfit of a black tee, grey sweat shorts, and three pairs of white crew socks on a lime background",
            },
         ],
      },
      {
         type: "text",
         title: "The look",
         align: "right",
         paragraphs: [
            "Next we generated the clothes as flat product images: an oversized yellow sweatshirt, cuffed wide-leg jeans, yellow suede sneakers, a slouchy suede bag, rectangular glasses, and gold jewelry. We kept every detail fixed, so each piece looks the same in the video as it does on its own.",
            "Then we built the video frame by frame, the way a creator would film it on her phone. She pulls the sweatshirt on over her starting outfit, tries the glasses, takes a mirror selfie, and ends up in the full look, all in one sunlit bedroom.",
            "It ends on a board that names every piece next to her, so viewers know exactly what she's wearing.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/ugc-creator/image-3.jpg",
               width: 1600,
               height: 1200,
               alt: "Flat lay of the look: wide-leg jeans, a yellow sweatshirt, yellow suede sneakers, a brown suede bag, glasses, and gold jewelry",
            },
            {
               kind: "image",
               src: "/images/work/ugc-creator/image-4.jpg",
               width: 1600,
               height: 1200,
               alt: "Four vertical frames of the creator getting ready in a sunlit bedroom, from pulling on the sweatshirt to a mirror selfie and the finished look",
            },
         ],
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/ugc-creator/cover.jpg",
            width: 2560,
            height: 1440,
            alt: "Get ready with me board with the creator in the finished look beside each labeled piece: glasses, gold earrings, jewelry, sweatshirt, wide-leg jeans, bag, and sneakers",
         },
      },
   ],
   seo: {
      title: "UGC Creator: Virtual Get Ready With Me Videos",
      description:
         "How byroose made a virtual UGC creator, from one consistent face and a set of clothes to get ready with me videos filmed in a sunlit bedroom.",
   },
});
