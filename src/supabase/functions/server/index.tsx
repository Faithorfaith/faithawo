import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Initialize Supabase Storage bucket for media uploads
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create storage bucket on startup
(async () => {
  try {
    const bucketName = 'make-c4cf44c5-media';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      if (error) {
        console.error('Failed to create storage bucket:', error);
      } else {
        console.log('✅ Storage bucket created successfully');
      }
    } else {
      console.log('✅ Storage bucket already exists');
    }
  } catch (err) {
    console.error('Error initializing storage:', err);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// --- Types ---

interface Post {
  id: string;
  title: string;
  link: string;
  sortOrder: number;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'button';
  content: string; // text content, or url, or label|url
  style?: any;
}

interface Project {
  id: string;
  title: string;
  description: string;
  content?: string | ContentBlock[];
  image: string;
  logo?: string; // Brand logo for book card
  category: string;
  year: string;
  link?: string;
  coverColor?: string; // Color for book-style project card
  textColor?: string; // Text color for book modal
  sortOrder: number;
}

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  image: string;
  showImage?: boolean;
  sortOrder: number;
}

interface PlaygroundItem {
  id: string;
  title: string;
  image: string;
  type: 'image' | 'video' | 'code';
  description?: string;
  sortOrder: number;
}

interface Tool {
  id: string;
  icon: string; // SVG content or icon name
  status: string;
  statusColor: string;
  category: string;
  title: string;
  description: string;
  link?: string;
  sortOrder: number;
}

interface Profile {
  id: string;
  tagline1: string;
  heroGreeting: string;
  heroName: string;
  bodyText: string;
  ctaText?: string; // CTA button text
  heroFontSize: number;
  bodyFontSize: number;
  status: string;
  statusMessage: string;
  availability: boolean;
  email: string;
}

interface Settings {
  id: string;
  maintenanceMode: boolean;
  playgroundGridRows?: number;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  sortOrder: number;
}

interface FooterSettings {
  id: string;
  enabled: boolean;
  customText: string;
}

interface SectionOrder {
  id: string;
  sections: string[];
}

// --- Initial Data ---

const INITIAL_SETTINGS: Settings = {
  id: 'settings',
  maintenanceMode: false
};

const INITIAL_NAV_ITEMS: NavItem[] = [
  { id: '1', label: 'Home', path: '/', icon: 'Home', sortOrder: 1 },
  { id: '2', label: 'Projects', path: '/work', icon: 'Grid', sortOrder: 2 },
];

const INITIAL_POSTS: Post[] = [
  { id: '1', title: "Beyond the Blur: What Actually Changed in iOS 26", link: "#", sortOrder: 1 },
  { id: '2', title: "Maybe I Was Never Really a Designer", link: "#", sortOrder: 2 },
  { id: '3', title: "Showing up might not be enough", link: "#", sortOrder: 3 },
  { id: '4', title: "When Solving the Obvious Problem Isn't Enough", link: "#", sortOrder: 4 },
  { id: '5', title: "Creativity Lives Everywhere, Even When You Feel Stuck", link: "#", sortOrder: 5 },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2670&auto=format&fit=crop",
    category: "Product Design",
    year: "2024",
    title: "Lucy's Circle",
    description: "Community platform connecting parents and families through shared experiences",
    content: "## Overview\nLucy's Circle is a community platform designed to connect parents and families.\n\n## The Challenge\nModern parenting can be isolating. We wanted to build a space where parents could share experiences, advice, and support in a safe environment.\n\n## The Solution\nWe focused on a warm, inviting design system with accessible typography and intuitive navigation. The mobile-first approach ensures parents can access the community on the go.",
    link: "https://example.com",
    sortOrder: 1
  },
  {
    id: '2',
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    category: "App Design",
    year: "2024",
    title: "Semesterise",
    description: "Reimagining academic planning for modern students with intelligent scheduling",
    content: "## Overview\nSemesterise is an intelligent scheduling app for students.\n\n## Key Features\n- Smart calendar integration\n- Assignment tracking\n- GPA calculator\n- Study group coordination",
    link: "https://example.com",
    sortOrder: 2
  },
  {
    id: '3',
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop",
    category: "Mobile App",
    year: "2023",
    title: "Wastewise",
    description: "Gamifying sustainable waste management for a greener tomorrow",
    content: "## Overview\nWastewise makes recycling fun and rewarding.\n\n## Impact\nSince launch, we've helped divert over 10 tons of waste from landfills through our gamified recycling challenges.",
    link: "https://example.com",
    sortOrder: 3
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    content: "Working with this team was a transformative experience. They didn't just design a website; they crafted a digital identity that perfectly captures our brand's essence.",
    author: "Elena Vescovi",
    role: "Creative Director, Lumina",
    image: "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGRhcmslMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzY1NzQ4MDQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    showImage: true,
    sortOrder: 1
  },
  {
    id: '2',
    content: "The attention to detail is unparalleled. Every interaction, every transition feels intentional. It's rare to find developers who care this much about the aesthetic quality.",
    author: "Marcus Thorne",
    role: "Founder, Apex Digital",
    image: "https://images.unsplash.com/photo-1614273144956-a93d12cd3318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRpcmVjdG9yJTIwcG9ydHJhaXQlMjBkYXJrfGVufDF8fHx8MTc2NTc0ODA0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    showImage: true,
    sortOrder: 2
  },
  {
    id: '3',
    content: "We needed a portfolio that stood out in a crowded market. The result exceeded our expectations—elegant, performant, and absolutely stunning.",
    author: "Sarah Jenkins",
    role: "Head of Product, Stripe",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
    showImage: true,
    sortOrder: 3
  }
];

const INITIAL_PLAYGROUND: PlaygroundItem[] = [
  {
    id: '1',
    title: "3D Card Hover",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    type: "image",
    sortOrder: 1
  },
  {
    id: '2',
    title: "Neon Glow",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
    type: "image",
    sortOrder: 2
  },
  {
    id: '3',
    title: "Glassmorphism UI",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop",
    type: "image",
    sortOrder: 3
  }
];

const INITIAL_TOOLS: Tool[] = [
  {
    id: '1',
    icon: 'palette',
    status: "Live",
    statusColor: "green",
    category: "AI Color Systems",
    title: "Hue Harmony",
    description: "Generate beautiful, accessible color palettes with AI in seconds",
    sortOrder: 1
  },
  {
    id: '2',
    icon: 'zap',
    status: "Beta",
    statusColor: "amber",
    category: "Design Tokens",
    title: "Token Master",
    description: "Sync design tokens across Figma and code with zero friction",
    sortOrder: 2
  },
  {
    id: '3',
    icon: 'code',
    status: "Coming Soon",
    statusColor: "amber",
    category: "Component Library",
    title: "FlexKit",
    description: "Production-ready React components built for speed and accessibility",
    sortOrder: 3
  }
];

const INITIAL_PROFILE: Profile = {
  id: 'main',
  tagline1: "Product Designer & Builder",
  heroGreeting: "Hi, I'm Faith",
  heroName: "Faith",
  bodyText: "Crafting thoughtful digital experiences for startups and enterprises. Turning complex problems into elegant, user-centered solutions.",
  ctaText: "Contact Me",
  heroFontSize: 36,
  bodyFontSize: 16,
  status: "Available",
  statusMessage: "I'm currently available for new projects",
  availability: true,
  email: "faith@example.com"
};

const INITIAL_FOOTER_SETTINGS: FooterSettings = {
  id: 'footer',
  enabled: true,
  customText: "© 2024 All rights reserved."
};

const INITIAL_SECTION_ORDER: SectionOrder = {
  id: 'section-order',
  sections: ['hero', 'process', 'work', 'testimonials', 'tools', 'playground', 'journal', 'contact']
};

// --- Generic CRUD Factory ---

function createCrudHandlers<T extends { id: string; sortOrder?: number }>(key: string, initialData: T[] | T) {
  const isSingleton = !Array.isArray(initialData);

  const get = async (c: any) => {
    try {
      const data = await kv.get(key);
      if (!data) {
        await kv.set(key, initialData);
        return c.json(initialData);
      }
      return c.json(data);
    } catch (e) {
      console.error(`Error getting ${key}:`, e);
      return c.json(initialData);
    }
  };

  const create = async (c: any) => {
    try {
      const body = await c.req.json();
      
      if (isSingleton) {
        // For singleton, create acts as set/update
        await kv.set(key, { ...initialData, ...body });
        return c.json(body);
      }

      const newItem = { ...body, id: crypto.randomUUID(), sortOrder: body.sortOrder || 99 };
      const data: any[] = (await kv.get(key)) || initialData;
      const dataArray = Array.isArray(data) ? data : (initialData as any[]);
      
      dataArray.push(newItem);
      dataArray.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
      
      await kv.set(key, dataArray);
      return c.json(newItem);
    } catch (e: any) {
      console.error(`Error creating ${key}:`, e);
      return c.json({ error: e.message }, 400);
    }
  };

  const update = async (c: any) => {
    const id = c.req.param("id");
    try {
      const body = await c.req.json();
      
      if (isSingleton) {
        // Singleton update
        const current = (await kv.get(key)) || initialData;
        const updated = { ...current, ...body };
        await kv.set(key, updated);
        return c.json(updated);
      }

      const data: any[] = (await kv.get(key)) || initialData;
      const dataArray = Array.isArray(data) ? data : (initialData as any[]);
      const index = dataArray.findIndex((item: any) => item.id === id);
      
      if (index === -1) {
        return c.json({ error: "Item not found" }, 404);
      }
      
      dataArray[index] = { ...dataArray[index], ...body };
      await kv.set(key, dataArray);
      return c.json(dataArray[index]);
    } catch (e: any) {
      console.error(`Error updating ${key}:`, e);
      return c.json({ error: e.message }, 400);
    }
  };

  const remove = async (c: any) => {
    const id = c.req.param("id");
    try {
      if (isSingleton) return c.json({ error: "Cannot delete singleton" }, 400);

      const data: any[] = (await kv.get(key)) || initialData;
      const dataArray = Array.isArray(data) ? data : (initialData as any[]);
      const newData = dataArray.filter((item: any) => item.id !== id);
      await kv.set(key, newData);
      return c.json({ success: true });
    } catch (e: any) {
      console.error(`Error deleting ${key}:`, e);
      return c.json({ error: e.message }, 500);
    }
  };

  return { get, create, update, remove };
}

// --- Handler Instantiation ---

const posts = createCrudHandlers<Post>("blog_posts", INITIAL_POSTS);
const projects = createCrudHandlers<Project>("portfolio_projects", INITIAL_PROJECTS);
const testimonials = createCrudHandlers<Testimonial>("portfolio_testimonials", INITIAL_TESTIMONIALS);
const playground = createCrudHandlers<PlaygroundItem>("portfolio_playground", INITIAL_PLAYGROUND);
const tools = createCrudHandlers<Tool>("portfolio_tools", INITIAL_TOOLS);
const profile = createCrudHandlers<Profile>("portfolio_profile", INITIAL_PROFILE);
const settings = createCrudHandlers<Settings>("portfolio_settings", INITIAL_SETTINGS);
const navItems = createCrudHandlers<NavItem>("portfolio_nav_items", INITIAL_NAV_ITEMS);
const footerSettings = createCrudHandlers<FooterSettings>("portfolio_footer_settings", INITIAL_FOOTER_SETTINGS);
const sectionOrder = createCrudHandlers<SectionOrder>("portfolio_section_order", INITIAL_SECTION_ORDER);

// --- Routes ---

const healthHandler = (c: any) => c.json({ status: "ok" });
const PREFIX = "/make-server-c4cf44c5";

// Register helper
function registerRoutes(name: string, handlers: any) {
  app.get(`/${name}`, handlers.get);
  app.get(`${PREFIX}/${name}`, handlers.get);

  app.post(`/${name}`, handlers.create);
  app.post(`${PREFIX}/${name}`, handlers.create);

  app.put(`/${name}/:id`, handlers.update);
  app.put(`${PREFIX}/${name}/:id`, handlers.update);

  app.delete(`/${name}/:id`, handlers.remove);
  app.delete(`${PREFIX}/${name}/:id`, handlers.remove);
}

// Register all endpoints
app.get("/health", healthHandler);
app.get(`${PREFIX}/health`, healthHandler);

// Profile is a singleton, handled slightly differently by using the base route as GET/UPDATE
app.get("/profile", profile.get);
app.get(`${PREFIX}/profile`, profile.get);
app.put("/profile", profile.create); // Use create/put interchangeably for singleton
app.put(`${PREFIX}/profile`, profile.create);

// Settings is also a singleton
app.get("/settings", settings.get);
app.get(`${PREFIX}/settings`, settings.get);
app.put("/settings", settings.create);
app.put(`${PREFIX}/settings`, settings.create);

// Footer Settings is a singleton
app.get("/footer-settings", footerSettings.get);
app.get(`${PREFIX}/footer-settings`, footerSettings.get);
app.put("/footer-settings", footerSettings.create);
app.put(`${PREFIX}/footer-settings`, footerSettings.create);

// Section Order is a singleton
app.get("/section-order", sectionOrder.get);
app.get(`${PREFIX}/section-order`, sectionOrder.get);
app.put("/section-order", sectionOrder.create);
app.put(`${PREFIX}/section-order`, sectionOrder.create);

// Upload endpoint - uses service role to bypass RLS
app.post("/upload", async (c) => {
  try {
    const { fileName, fileData, contentType } = await c.req.json();
    
    if (!fileName || !fileData) {
      return c.json({ error: 'Missing fileName or fileData' }, 400);
    }
    
    // Decode base64 to binary
    const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    
    // Upload using service role (bypasses RLS)
    const { data, error } = await supabase.storage
      .from('make-c4cf44c5-media')
      .upload(`uploads/${fileName}`, binaryData, {
        contentType: contentType || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('make-c4cf44c5-media')
      .getPublicUrl(`uploads/${fileName}`);
    
    console.log('File uploaded successfully:', fileName);
    return c.json({ publicUrl });
  } catch (error) {
    console.error('Error handling upload:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

app.post(`${PREFIX}/upload`, async (c) => {
  try {
    const { fileName, fileData, contentType } = await c.req.json();
    
    if (!fileName || !fileData) {
      return c.json({ error: 'Missing fileName or fileData' }, 400);
    }
    
    // Decode base64 to binary
    const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    
    // Upload using service role (bypasses RLS)
    const { data, error } = await supabase.storage
      .from('make-c4cf44c5-media')
      .upload(`uploads/${fileName}`, binaryData, {
        contentType: contentType || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('make-c4cf44c5-media')
      .getPublicUrl(`uploads/${fileName}`);
    
    console.log('File uploaded successfully:', fileName);
    return c.json({ publicUrl });
  } catch (error) {
    console.error('Error handling upload:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Contact form submissions
app.post("/contact", async (c) => {
  try {
    const { name, email, message } = await c.req.json();
    
    if (!name || !email || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const submission = {
      id: `contact-${Date.now()}`,
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    await kv.set(`contact:${submission.id}`, submission);
    console.log('Contact submission saved:', submission.id);
    
    return c.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return c.json({ error: 'Failed to submit contact form' }, 500);
  }
});

app.post(`${PREFIX}/contact`, async (c) => {
  try {
    const { name, email, message } = await c.req.json();
    
    if (!name || !email || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const submission = {
      id: `contact-${Date.now()}`,
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    await kv.set(`contact:${submission.id}`, submission);
    console.log('Contact submission saved:', submission.id);
    
    return c.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return c.json({ error: 'Failed to submit contact form' }, 500);
  }
});

// Get all contact submissions
app.get("/contact-submissions", async (c) => {
  try {
    const submissions = await kv.getByPrefix('contact:');
    return c.json(submissions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

app.get(`${PREFIX}/contact-submissions`, async (c) => {
  try {
    const submissions = await kv.getByPrefix('contact:');
    return c.json(submissions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

// Mark submission as read
app.put("/contact-submissions/:id/read", async (c) => {
  try {
    const id = c.req.param('id');
    const submission = await kv.get(`contact:${id}`);
    
    if (!submission) {
      return c.json({ error: 'Submission not found' }, 404);
    }
    
    submission.read = true;
    await kv.set(`contact:${id}`, submission);
    
    return c.json(submission);
  } catch (error) {
    console.error('Error marking submission as read:', error);
    return c.json({ error: 'Failed to update submission' }, 500);
  }
});

app.put(`${PREFIX}/contact-submissions/:id/read`, async (c) => {
  try {
    const id = c.req.param('id');
    const submission = await kv.get(`contact:${id}`);
    
    if (!submission) {
      return c.json({ error: 'Submission not found' }, 404);
    }
    
    submission.read = true;
    await kv.set(`contact:${id}`, submission);
    
    return c.json(submission);
  } catch (error) {
    console.error('Error marking submission as read:', error);
    return c.json({ error: 'Failed to update submission' }, 500);
  }
});

registerRoutes("posts", posts);
registerRoutes("projects", projects);
registerRoutes("testimonials", testimonials);
registerRoutes("playground", playground);
registerRoutes("tools", tools);
registerRoutes("nav-items", navItems);

Deno.serve(app.fetch);