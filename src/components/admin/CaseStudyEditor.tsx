import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Project, fetchProjects, createProject, updateProject, ContentBlock } from '../../utils/api';
import { PageBuilder } from './PageBuilder';
import { ArrowLeft, Save, Loader2, Layout } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function CaseStudyEditor() {
  const [, params] = useRoute('/admin/projects/edit/:id');
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'builder'>('details');
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Design',
    year: new Date().getFullYear().toString(),
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2670&auto=format&fit=crop',
    content: [],
    sortOrder: 0
  });

  const isNew = !params?.id;

  useEffect(() => {
    if (!isNew && params?.id) {
      loadProject(params.id);
    } else {
        // Fetch projects to get the next sort order
        fetchProjects().then(projects => {
            setFormData(prev => ({ ...prev, sortOrder: projects.length + 1 }));
        });
    }
  }, [params?.id]);

  async function loadProject(id: string) {
    setIsLoading(true);
    try {
      const projects = await fetchProjects();
      const project = projects.find(p => p.id === id);
      if (project) {
        setFormData(project);
        // Default to builder tab if it's already using blocks
        if (Array.isArray(project.content)) {
            setActiveTab('builder');
        }
      } else {
        alert('Project not found');
        setLocation('/admin');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      if (isNew) {
        await createProject(formData as Omit<Project, 'id'>);
      } else if (params?.id) {
        await updateProject(params.id, formData);
      }
      setLocation('/admin');
    } catch (error) {
      console.error(error);
      alert('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  }

  // Helper to update simple fields
  const updateField = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#e2a336]" size={32} />
      </div>
    );
  }

  const isArrayContent = Array.isArray(formData.content);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#0f0f0f] text-[#f5f4f0] flex flex-col">
        {/* Header */}
        <header className="bg-[#1a1a1a] border-b border-[#333] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/admin')}
              className="p-2 hover:bg-[#333] rounded-lg text-[#808080] hover:text-[#f5f4f0] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-serif">{isNew ? 'New Case Study' : 'Edit Case Study'}</h1>
              <p className="text-xs text-[#808080]">{formData.title || 'Untitled Project'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-1 flex">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'details' ? 'bg-[#333] text-[#f5f4f0]' : 'text-[#808080] hover:text-[#f5f4f0]'}`}
                >
                    <Layout size={14} />
                    Details
                </button>
                <button
                    onClick={() => setActiveTab('builder')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'builder' ? 'bg-[#333] text-[#f5f4f0]' : 'text-[#808080] hover:text-[#f5f4f0]'}`}
                >
                    <Layout size={14} />
                    Page Builder
                </button>
             </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#e2a336] text-[#f5f4f0] px-4 py-2 rounded-lg font-medium hover:bg-[#d19530] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                
                {activeTab === 'details' ? (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#808080]">Project Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none text-lg font-serif"
                                placeholder="Enter project title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#808080]">Short Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none min-h-[100px]"
                                placeholder="Brief summary of the project..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#808080]">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => updateField('category', e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#808080]">Year</label>
                                <input
                                    type="text"
                                    value={formData.year}
                                    onChange={(e) => updateField('year', e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#808080]">Book Cover Color</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={formData.coverColor || '#F9D27D'}
                                    onChange={(e) => updateField('coverColor', e.target.value)}
                                    className="w-20 h-12 bg-[#1a1a1a] border border-[#333] rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.coverColor || '#F9D27D'}
                                    onChange={(e) => updateField('coverColor', e.target.value)}
                                    className="flex-1 bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus-border-[#e2a336] outline-none font-mono"
                                    placeholder="#F9D27D"
                                />
                            </div>
                            <p className="text-xs text-[#666]">Color for the book-style project card</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#808080]">Book Text Color</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={formData.textColor || '#ffffff'}
                                    onChange={(e) => updateField('textColor', e.target.value)}
                                    className="w-20 h-12 bg-[#1a1a1a] border border-[#333] rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.textColor || '#ffffff'}
                                    onChange={(e) => updateField('textColor', e.target.value)}
                                    className="flex-1 bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus-border-[#e2a336] outline-none font-mono"
                                    placeholder="#ffffff"
                                />
                            </div>
                            <p className="text-xs text-[#666]">Text color for the book modal content</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#808080]">Brand Logo URL</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={formData.logo || ''}
                                        onChange={(e) => updateField('logo', e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
                                        placeholder="https://... (Logo for book card)"
                                    />
                                </div>
                                <div className="w-12 h-12 bg-[#1a1a1a] rounded border border-[#333] overflow-hidden flex items-center justify-center">
                                    {formData.logo && <img src={formData.logo} className="w-full h-full object-contain" alt="Logo" />}
                                </div>
                            </div>
                            <p className="text-xs text-[#666]">Small logo/icon displayed on the book card</p>
                        </div>

                         <div className="space-y-2">
                            <label className="text-sm font-medium text-[#808080]">Cover Image URL</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => updateField('image', e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
                                    />
                                </div>
                                <div className="w-24 h-12 bg-[#1a1a1a] rounded border border-[#333] overflow-hidden">
                                    {formData.image && <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#808080]">External Link (Optional)</label>
                            <input
                                type="text"
                                value={formData.link || ''}
                                onChange={(e) => updateField('link', e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                            <h3 className="text-[#f5f4f0] font-medium mb-2">Content Strategy</h3>
                            <p className="text-sm text-[#808080] mb-4">Choose how you want to build this case study.</p>
                            
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="contentType"
                                        checked={!isArrayContent}
                                        onChange={() => updateField('content', '')}
                                        className="accent-[#e2a336]"
                                    />
                                    <span className={!isArrayContent ? 'text-[#e2a336]' : 'text-[#808080]'}>Legacy Markdown</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="contentType"
                                        checked={isArrayContent}
                                        onChange={() => updateField('content', [])}
                                        className="accent-[#e2a336]"
                                    />
                                    <span className={isArrayContent ? 'text-[#e2a336]' : 'text-[#808080]'}>Visual Page Builder</span>
                                </label>
                            </div>

                            {!isArrayContent && (
                                <div className="mt-4">
                                     <textarea
                                        value={formData.content as string}
                                        onChange={(e) => updateField('content', e.target.value)}
                                        className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] p-4 rounded-lg focus:border-[#e2a336] outline-none min-h-[300px] font-mono text-sm"
                                        placeholder="# Markdown Content..."
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        {isArrayContent ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-serif">Page Builder</h2>
                                    <div className="text-sm text-[#808080]">
                                        Drag blocks to reorder • Click to edit
                                    </div>
                                </div>
                                <PageBuilder 
                                    blocks={formData.content as ContentBlock[]} 
                                    onChange={(blocks) => updateField('content', blocks)} 
                                />
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-[#808080] mb-4">You are currently using Legacy Markdown mode.</p>
                                <button 
                                    onClick={() => updateField('content', [])}
                                    className="bg-[#e2a336] text-[#f5f4f0] px-4 py-2 rounded-lg"
                                >
                                    Switch to Page Builder
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
      </div>
    </DndProvider>
  );
}