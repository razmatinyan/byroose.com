import { defineProject } from "@/lib/projects";

export default defineProject({
   slug: "cartoon",
   name: "Cartoon",
   description:
      "An animated series made with our AI pipeline, to show that brands can own a recurring character without a full animation studio.",
   categories: ["Reel", "Video", "Image"],
   surface: { color: "oklch(0.8892 0.0345 40.68)", ink: "dark" },
   cover: {
      kind: "video",
      src: "/images/work/cartoon/cover.mp4",
      poster: "/images/work/cartoon/og-image.jpg",
      width: 1920,
      height: 1080,
      alt: "The cartoon character in a grey knit sweater, leopard print cargo pants, yellow sneakers, and a black crossbody bag",
   },
   blocks: [
      {
         type: "text",
         title: "The idea",
         align: "right",
         paragraphs: [
            "We wanted to tell a small story about a bad morning. A girl sleeps through her alarm, wakes up late for school, and has no time to get ready, so magic dresses her instead.",
            "We started with the character. She has a short brown bob with bangs, round gold glasses, hoop earrings, and freckles. We generated her face first and used it as the reference for every frame after, then checked that it held up in the expressions the story needed: a calm smile, panic, and joy.",
            "Her outfit came next. We generated each piece on its own: a grey knit sweater, leopard print cargo pants, yellow suede sneakers with black stripes, and a black quilted crossbody bag with a red heart charm.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/cartoon/image-1.jpg",
               width: 1600,
               height: 1200,
               alt: "Three vertical frames of the cartoon character: a calm smile, wide-eyed panic with messy bedhead, and a smile as golden sparkles swirl around her",
            },
            {
               kind: "image",
               src: "/images/work/cartoon/image-2.jpg",
               width: 1600,
               height: 1200,
               alt: "Flat lay of the look: a grey knit sweater, leopard print cargo pants, a black quilted crossbody bag with a red heart charm, yellow suede sneakers, and a wooden button",
            },
         ],
      },
      {
         type: "text",
         title: "The story",
         align: "right",
         paragraphs: [
            "With the face and the clothes ready, we put them together in a model sheet that shows her from the front, the side, and the back. That sheet kept the pockets, the bag strap, and the rolled cuffs looking the same in every shot.",
            "Then we made the room she wakes up in, a bedroom with pale wood walls and warm morning light, and wrote the video shot by shot.",
            "She opens her eyes, realizes she's late, and jumps out of bed with her hair sticking up. She digs through a pile of clothes and doesn't like any of them. Then a cloud of golden sparkles wraps around her, and when it clears she's dressed and ready to go.",
         ],
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/cartoon/image-3.jpg",
            width: 2560,
            height: 1440,
            alt: "Model sheet of the character in the finished look from the front, three-quarter, side, and back",
         },
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/cartoon/image-4.jpg",
            width: 2560,
            height: 1440,
            alt: "Four vertical frames from the video: the finished look in a warm room, a frown at a striped shirt, a wide-eyed wake-up in bed, and golden sparkles dressing her",
         },
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/cartoon/cover.jpg",
            width: 2560,
            height: 1440,
            alt: "Cartoon board with the character in the finished look beside each labeled piece: soft knit, leopard cargo, sneakers, and crossbody bag",
         },
      },
   ],
   seo: {
      title: "Cartoon: A Late-for-School Animated Short",
      description:
         "How forrrow made a short cartoon, from designing the character and her outfit to a late-for-school morning where magic gets her dressed.",
   },
});
