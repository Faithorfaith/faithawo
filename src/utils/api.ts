import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4cf44c5`;

// --- Interfaces ---

export interface Post {
  id: string;
  title: string;
  link: string;
  sortOrder: number;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'button';
  content: string; // text content, or url, or label|url
  style?: any;
}

export interface Project {
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

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  image: string;
  showImage?: boolean;
  sortOrder: number;
}

export interface PlaygroundItem {
  id: string;
  title: string;
  image: string;
  type: 'image' | 'video' | 'code';
  description?: string;
  sortOrder: number;
}

export interface Tool {
  id: string;
  icon: string;
  status: string;
  statusColor: string;
  category: string;
  title: string;
  description: string;
  link?: string;
  sortOrder: number;
}

export interface HeroCard {
  id: string;
  text: string;
  ctaText?: string;
  ctaLink?: string;
  sortOrder: number;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  bgColor: string;
  textColor: string;
  sortOrder: number;
}

export interface Profile {
  id: string;
  tagline1: string;
  heroGreeting: string;
  heroName: string;
  bodyText: string;
  ctaText?: string;
  heroFontSize: number;
  bodyFontSize: number;
  status: string;
  statusMessage: string;
  availability: boolean;
  email: string;
  heroCards?: HeroCard[];
  socialLinks?: SocialLink[];
  heroImage?: string;
}

export interface Settings {
  id: string;
  maintenanceMode: boolean;
  playgroundGridRows?: number;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  sortOrder: number;
}

export interface FooterSettings {
  id: string;
  enabled: boolean;
  customText: string;
}

export interface SectionOrder {
  id: string;
  sections: string[];
}

// --- Generic Fetcher ---

async function fetchResource<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

async function fetchSingleton<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

async function createResource<T>(endpoint: string, item: any): Promise<T> {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });
  if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
  return response.json();
}

async function updateResource<T>(endpoint: string, id: string, item: any): Promise<T> {
  const response = await fetch(`${BASE_URL}/${endpoint}${id ? '/' + id : ''}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });
  if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
  return response.json();
}

async function deleteResource(endpoint: string, id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${publicAnonKey}` }
  });
  if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
}

// --- Exported Functions ---

// Posts
export const fetchPosts = () => fetchResource<Post>('posts');
export const createPost = (item: Omit<Post, 'id'>) => createResource<Post>('posts', item);
export const updatePost = (id: string, item: Partial<Post>) => updateResource<Post>('posts', id, item);
export const deletePost = (id: string) => deleteResource('posts', id);

// Projects
export const fetchProjects = () => fetchResource<Project>('projects');
export const createProject = (item: Omit<Project, 'id'>) => createResource<Project>('projects', item);
export const updateProject = (id: string, item: Partial<Project>) => updateResource<Project>('projects', id, item);
export const deleteProject = (id: string) => deleteResource('projects', id);

// Testimonials
export const fetchTestimonials = () => fetchResource<Testimonial>('testimonials');
export const createTestimonial = (item: Omit<Testimonial, 'id'>) => createResource<Testimonial>('testimonials', item);
export const updateTestimonial = (id: string, item: Partial<Testimonial>) => updateResource<Testimonial>('testimonials', id, item);
export const deleteTestimonial = (id: string) => deleteResource('testimonials', id);

// Playground
export const fetchPlaygroundItems = () => fetchResource<PlaygroundItem>('playground');
export const createPlaygroundItem = (item: Omit<PlaygroundItem, 'id'>) => createResource<PlaygroundItem>('playground', item);
export const updatePlaygroundItem = (id: string, item: Partial<PlaygroundItem>) => updateResource<PlaygroundItem>('playground', id, item);
export const deletePlaygroundItem = (id: string) => deleteResource('playground', id);

// Tools
export const fetchTools = () => fetchResource<Tool>('tools');
export const createTool = (item: Omit<Tool, 'id'>) => createResource<Tool>('tools', item);
export const updateTool = (id: string, item: Partial<Tool>) => updateResource<Tool>('tools', id, item);
export const deleteTool = (id: string) => deleteResource('tools', id);

// Profile (Singleton)
export const fetchProfile = () => fetchSingleton<Profile>('profile');
export const updateProfile = (item: Partial<Profile>) => updateResource<Profile>('profile', '', item);

// Settings (Singleton)
export const fetchSettings = () => fetchSingleton<Settings>('settings');
export const updateSettings = (item: Partial<Settings>) => updateResource<Settings>('settings', '', item);

// Nav Items
export const fetchNavItems = () => fetchResource<NavItem>('nav-items');
export const createNavItem = (item: Omit<NavItem, 'id'>) => createResource<NavItem>('nav-items', item);
export const updateNavItem = (id: string, item: Partial<NavItem>) => updateResource<NavItem>('nav-items', id, item);
export const deleteNavItem = (id: string) => deleteResource('nav-items', id);

// Footer Settings (Singleton)
export const fetchFooterSettings = () => fetchSingleton<FooterSettings>('footer-settings');
export const updateFooterSettings = (item: Partial<FooterSettings>) => updateResource<FooterSettings>('footer-settings', '', item);

// Section Order (Singleton)
export const fetchSectionOrder = () => fetchSingleton<SectionOrder>('section-order');
export const updateSectionOrder = (item: Partial<SectionOrder>) => updateResource<SectionOrder>('section-order', '', item);