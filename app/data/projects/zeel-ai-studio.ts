import { defineProject } from "@/lib/projects";

export default defineProject({
   slug: "zeel-ai-studio",
   name: "AI Studio",
   description:
      "A web platform for ZEEL Project that turns a room description and 3D model references into photorealistic interior renders in seconds.",
   categories: ["Web Development", "UI/UX Design"],
   liveUrl: "https://ai.zeelproject.com/",
   cover: {
      kind: "image",
      src: "/images/work/zeel-ai-studio/cover.jpg",
      width: 2560,
      height: 1440,
      alt: "ZEEL AI Studio home screen on a laptop resting on a textured stone block",
   },
   blocks: [
      {
         type: "text",
         title: "AI Render Tool",
         align: "right",
         paragraphs: [
            "Every render starts with real furniture. Pick 3D models from the ZEEL Project library, or upload an image of your own, and the scene is built around those exact pieces.",
            "Then set the frame. Choose the image size and aspect ratio, add an interior style, pick the room type, and decide on the light, from bright daylight to a warm ambient glow.",
            "Last, describe the room in plain words and start the generation. Seconds later a photorealistic render is ready, and you can keep refining it from there.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-1.jpg",
               width: 1600,
               height: 1200,
               alt: "The four AI Render steps: real 3D models, set the scene with an interior style, describe it, and render in seconds",
            },
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-2.jpg",
               width: 1600,
               height: 1200,
               alt: "AI Render tool generating a classic living room in bright daylight from a prompt, two selected 3D models, and the asset library",
            },
         ],
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/zeel-ai-studio/image-3.jpg",
            width: 2560,
            height: 1440,
            alt: "Finished render of a classic living room with arched garden windows, open in the detail view with its prompt, settings, and the 3D models used",
         },
      },
      {
         type: "text",
         title: "Exterior Design",
         align: "right",
         paragraphs: [
            "Exterior Design generates and refines building exteriors, with control over facade materials, time of day, and surroundings.",
            "It starts from what already exists. Upload a photo, a render, or a CAD model of the building, and the tool works from that source.",
            "Then pick the look, the space, and the output: facade material, time of day, surroundings, building type, architectural style, image size, and aspect ratio. Every setting has an Auto option, so you only decide what matters to you.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-4.jpg",
               width: 1600,
               height: 1200,
               alt: "Exterior Design source image step, with a before and after slider from a grey CAD model to a finished house render",
            },
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-5.jpg",
               width: 1600,
               height: 1200,
               alt: "Facade material picker with Auto, brick, render, timber, stone, and concrete options beside an uploaded house at night",
            },
         ],
      },
      {
         type: "text",
         title: "Product Finder",
         align: "right",
         paragraphs: [
            "Product Finder starts from a single interior photo. Upload it, and the AI scans the room and marks every piece of furniture it finds.",
            "Missed something, or only after one piece? Draw a box around anything you want to search for.",
            "Each object then becomes a search. Product Finder looks through the ZEEL Project library and returns matching 3D models, ready to bring into a render.",
         ],
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/zeel-ai-studio/image-6.jpg",
            width: 2560,
            height: 1440,
            alt: "Product Finder with numbered boxes on the furniture detected in an interior photo, a hand-drawn selection, and six matching armchair 3D models",
         },
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-5.jpg",
               width: 1600,
               height: 1200,
               alt: "Facade material picker with Auto, brick, render, timber, stone, and concrete options beside an uploaded house at night",
            },
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-7.jpg",
               width: 1600,
               height: 1200,
               alt: "Detected Products step with eleven numbered boxes on a classic living room, from the armchairs and rug to the framed paintings, and a strip of the detected items below",
            },
         ],
      },
      {
         type: "title",
         title: "Results",
      },
      {
         type: "results",
         results: [
            { value: "4,000+", label: "Users in the first two months" },
            { value: "10,000+", label: "Images generated in three months" },
         ],
      },
      {
         type: "title",
         title: "UI Details",
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-8.jpg",
               width: 1600,
               height: 1200,
               alt: "Close-up of the ZEEL AI sidebar with the Open Navigation tooltip and its keyboard shortcut beside the Design Your Space home screen",
            },
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-9.jpg",
               width: 1600,
               height: 1200,
               alt: "Settings dialog with theme, motion, language, Generate button style, and tooltip preferences",
            },
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-10.jpg",
               width: 1600,
               height: 1200,
               alt: "Assets panel with a 3D model menu open to add it to a workspace, with a search field and recent workspaces",
            },
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-11.jpg",
               width: 1600,
               height: 1200,
               alt: "AI Insights panel suggesting new directions for a classic living room render, with three ideas selected to generate",
            },
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-12.jpg",
               width: 1600,
               height: 1200,
               alt: "Your credits dialog with plan and daily credit bars and actions to manage or upgrade the subscription",
            },
            {
               kind: "image",
               src: "/images/work/zeel-ai-studio/image-13.jpg",
               width: 1600,
               height: 1200,
               alt: "Creations page with starred interior renders and the renders from one workspace",
            },
         ],
      },
   ],
   seo: {
      title: "ZEEL AI Studio: AI Interior Design Web Platform",
      description:
         "How byroose designed and built ZEEL AI Studio, a web platform that generates photorealistic interior renders from a room brief and 3D models.",
   },
});
