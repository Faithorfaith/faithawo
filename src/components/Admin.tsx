import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  Project, PlaygroundItem, Profile, Settings,
  fetchProjects, createProject, updateProject, deleteProject,
  fetchPlaygroundItems, createPlaygroundItem, updatePlaygroundItem, deletePlaygroundItem,
  fetchProfile, updateProfile,
  fetchSettings, updateSettings
} from '../utils/api';
import { Edit2, Plus, LogOut, Loader2, Save, X, Briefcase, Zap, User, Settings as SettingsIcon, Link as LinkIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SortableItem } from './admin/SortableItem';
import { MediaUpload } from './admin/MediaUpload';

type ContentType = 'projects' | 'playground' | 'profile' | 'settings' | 'social-links';

export function Admin() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<ContentType>('profile');
  const [items, setItems] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [settingsData, setSettingsData] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState<any>({});

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const [movedItem] = updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, movedItem);
      return updatedItems;
    });
  }, []);

  const saveOrder = async () => {
    // This is a bit inefficient as it updates everything, but ensures consistency
    // Optimization: only update changed items
    setIsLoading(true);
    try {
        const promises = items.map((item, index) => {
            const newItem = { ...item, sortOrder: index + 1 };
             switch (activeTab) {
                case 'projects': return updateProject(newItem.id, newItem);
                case 'playground': return updatePlaygroundItem(newItem.id, newItem);
                default: return Promise.resolve();
            }
        });
        await Promise.all(promises);
        await loadContent(activeTab);
    } catch (err) {
        console.error("Failed to save order", err);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadContent(activeTab);
    }
  }, [activeTab]);

  async function loadContent(type: ContentType) {
    setIsLoading(true);
    try {
      if (type === 'profile') {
        const data = await fetchProfile();
        setProfileData(data);
      } else if (type === 'settings') {
        const data = await fetchSettings();
        setSettingsData(data);
      } else {
        let data;
        switch (type) {
          case 'projects': data = await fetchProjects(); break;
          case 'playground': data = await fetchPlaygroundItems(); break;
        }
        setItems(data || []);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      loadContent(activeTab);
    } else {
      alert('Incorrect password');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (activeTab === 'profile') {
        await updateProfile(formData);
      } else if (activeTab === 'settings') {
        await updateSettings(formData);
      } else if (editingItem) {
        switch (activeTab) {
          case 'projects': await updateProject(editingItem.id, formData); break;
          case 'playground': await updatePlaygroundItem(editingItem.id, formData); break;
        }
      } else {
        switch (activeTab) {
          case 'projects': await createProject(formData); break;
          case 'playground': await createPlaygroundItem(formData); break;
        }
      }
      await loadContent(activeTab);
      setIsFormOpen(false);
      setEditingItem(null);
      setFormData({});
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    } finally {
      setIsLoading(false);
    }
  }

  function openEdit(item: any) {
    if (activeTab === 'projects') {
      setLocation(`/admin/projects/edit/${item.id}`);
      return;
    }
    setEditingItem(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  }

  function openEditProfile() {
    if (profileData) {
      setFormData({ ...profileData });
      setIsFormOpen(true);
    }
  }

  function openEditSettings() {
    if (settingsData) {
      setFormData({ ...settingsData });
      setIsFormOpen(true);
    }
  }

  function openNew() {
    if (activeTab === 'projects') {
      setLocation('/admin/projects/new');
      return;
    }
    setEditingItem(null);
    const defaults: any = { sortOrder: items.length + 1 };
    
    if (activeTab === 'projects') {
      defaults.image = 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2670&auto=format&fit=crop';
      defaults.category = 'Design';
      defaults.year = new Date().getFullYear().toString();
      defaults.contentBlocks = [];
    }
    if (activeTab === 'playground') {
      defaults.type = 'image';
      defaults.image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
    }

    setFormData(defaults);
    setIsFormOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'projects': await deleteProject(id); break;
        case 'playground': await deletePlaygroundItem(id); break;
      }
      await loadContent(activeTab);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderFormFields() {
    switch (activeTab) {
      case 'settings':
        return (
          <>
             <div className="flex items-center gap-2 mb-4 bg-[#0f0f0f] border border-[#333] p-4 rounded-lg">
               <input 
                type="checkbox" 
                checked={formData.maintenanceMode} 
                onChange={e => setFormData({...formData, maintenanceMode: e.target.checked})} 
                className="w-5 h-5 accent-[#e2a336]"
              />
              <label className="text-[#f5f4f0]">Maintenance Mode Active</label>
            </div>
            <p className="text-sm text-[#808080] mb-6">
              When active, all public pages will show a "Work in Progress" screen. You can still access the admin dashboard.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm text-[#808080] mb-2">Playground Grid Rows</label>
              <select 
                value={formData.playgroundGridRows || 4} 
                onChange={e => setFormData({...formData, playgroundGridRows: parseInt(e.target.value)})}
                className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
              >
                <option value="2">2 Rows</option>
                <option value="3">3 Rows</option>
                <option value="4">4 Rows</option>
                <option value="6">6 Rows</option>
                <option value="8">8 Rows</option>
              </select>
              <p className="text-sm text-[#666] mt-2">Choose how many rows to display in the playground grid layout.</p>
            </div>
          </>
        );
      case 'profile':
        return (
          <>
            <Input 
              label="Status Badge Text (tagline1)" 
              value={formData.tagline1 || ""} 
              onChange={v => setFormData({...formData, tagline1: v})} 
            />
            
            {/* Hero Image Upload */}
            <div className="border-b border-[#333] pb-6 mb-6">
              <MediaUpload 
                label="Hero Image" 
                value={formData.heroImage || ''} 
                onChange={v => setFormData({...formData, heroImage: v})} 
              />
              <p className="text-xs text-[#666] mt-2">Upload a custom hero image or leave empty to use the default</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Hero Greeting (e.g., 'Hi, I'm ')" 
                value={formData.heroGreeting || ""} 
                onChange={v => setFormData({...formData, heroGreeting: v})} 
              />
              <Input 
                label="Hero Name (e.g., 'Faith')" 
                value={formData.heroName || ""} 
                onChange={v => setFormData({...formData, heroName: v})} 
              />
            </div>
            <TextArea 
              label="Body Text" 
              value={formData.bodyText || ""} 
              onChange={v => setFormData({...formData, bodyText: v})} 
            />
            <Input 
              label="CTA Button Text (e.g., 'Message me')" 
              value={formData.ctaText || "Message me"} 
              onChange={v => setFormData({...formData, ctaText: v})} 
            />

            {/* Hero Cards Section */}
            <div className="border-t border-[#333] pt-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="block text-sm text-[#808080] font-medium">Hero Text Boxes</label>
                  <p className="text-xs text-[#666] mt-1">Create multiple text boxes with optional CTA buttons</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const heroCards = formData.heroCards || [];
                    setFormData({
                      ...formData,
                      heroCards: [
                        ...heroCards,
                        { id: `card-${Date.now()}`, text: '', ctaText: '', ctaLink: '', sortOrder: heroCards.length + 1 }
                      ]
                    });
                  }}
                  className="text-sm text-[#e2a336] hover:text-[#d19530] flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Box
                </button>
              </div>

              <div className="space-y-4">
                {(formData.heroCards || []).map((card: any, index: number) => (
                  <div key={card.id} className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-[#808080] font-mono">Box #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const heroCards = formData.heroCards.filter((_: any, i: number) => i !== index);
                          setFormData({ ...formData, heroCards });
                        }}
                        className="text-[#808080] hover:text-[#f5f4f0]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <TextArea
                      label="Text Content"
                      value={card.text}
                      onChange={v => {
                        const heroCards = [...formData.heroCards];
                        heroCards[index].text = v;
                        setFormData({ ...formData, heroCards });
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <Input
                        label="CTA Text (optional)"
                        value={card.ctaText || ''}
                        onChange={v => {
                          const heroCards = [...formData.heroCards];
                          heroCards[index].ctaText = v;
                          setFormData({ ...formData, heroCards });
                        }}
                      />
                      <Input
                        label="CTA Link (optional)"
                        value={card.ctaLink || ''}
                        onChange={v => {
                          const heroCards = [...formData.heroCards];
                          heroCards[index].ctaLink = v;
                          setFormData({ ...formData, heroCards });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links Section */}
            <div className="border-t border-[#333] pt-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="block text-sm text-[#808080] font-medium">Social Links</label>
                  <p className="text-xs text-[#666] mt-1">Add your social media links</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const socialLinks = formData.socialLinks || [];
                    setFormData({
                      ...formData,
                      socialLinks: [
                        ...socialLinks,
                        { id: `social-${Date.now()}`, label: '', url: '', bgColor: '#000000', textColor: '#ffffff', sortOrder: socialLinks.length + 1 }
                      ]
                    });
                  }}
                  className="text-sm text-[#e2a336] hover:text-[#d19530] flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>

              <div className="space-y-4">
                {(formData.socialLinks || []).map((link: any, index: number) => (
                  <div key={link.id} className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-[#808080] font-mono">Link #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const socialLinks = formData.socialLinks.filter((_: any, i: number) => i !== index);
                          setFormData({ ...formData, socialLinks });
                        }}
                        className="text-[#808080] hover:text-[#f5f4f0]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Label (e.g., X, LinkedIn)"
                        value={link.label || ''}
                        onChange={v => {
                          const socialLinks = [...formData.socialLinks];
                          socialLinks[index].label = v;
                          setFormData({ ...formData, socialLinks });
                        }}
                      />
                      <Input
                        label="URL"
                        value={link.url || ''}
                        onChange={v => {
                          const socialLinks = [...formData.socialLinks];
                          socialLinks[index].url = v;
                          setFormData({ ...formData, socialLinks });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-sm text-[#808080] mb-2">Background Color</label>
                        <input
                          type="color"
                          value={link.bgColor || '#000000'}
                          onChange={e => {
                            const socialLinks = [...formData.socialLinks];
                            socialLinks[index].bgColor = e.target.value;
                            setFormData({ ...formData, socialLinks });
                          }}
                          className="w-full h-10 bg-[#0f0f0f] border border-[#333] rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#808080] mb-2">Text Color</label>
                        <input
                          type="color"
                          value={link.textColor || '#ffffff'}
                          onChange={e => {
                            const socialLinks = [...formData.socialLinks];
                            socialLinks[index].textColor = e.target.value;
                            setFormData({ ...formData, socialLinks });
                          }}
                          className="w-full h-10 bg-[#0f0f0f] border border-[#333] rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Input 
              label="Email" 
              value={formData.email || ""} 
              onChange={v => setFormData({...formData, email: v})} 
            />
            <label className="flex items-center gap-2 text-sm text-[#808080]">
              <input 
                type="checkbox" 
                checked={formData.availability || false} 
                onChange={e => setFormData({...formData, availability: e.target.checked})} 
                className="rounded border-[#333]"
              />
              Available for work
            </label>
          </>
        );
      case 'projects':
        return (
          <div className="text-[#808080] text-center py-8">
            Please use the full page editor for projects.
          </div>
        );
      case 'playground':
        return (
          <>
            <Input label="Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
            <Input label="Description (Optional)" value={formData.description || ''} onChange={v => setFormData({...formData, description: v})} />
            <MediaUpload label="Media" value={formData.image} onChange={v => setFormData({...formData, image: v})} />
            <div className="mb-4">
              <label className="block text-sm text-[#808080] mb-2">Type</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="code">Code</option>
              </select>
            </div>
            <Input label="Sort Order" type="number" value={formData.sortOrder} onChange={v => setFormData({...formData, sortOrder: parseInt(v)})} />
          </>
        );
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl border border-[#333]">
          <h1 className="text-2xl font-serif text-[#f5f4f0] mb-6 text-center">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access code"
            className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg mb-4 focus:border-[#e2a336] outline-none transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-[#e2a336] text-[#f5f4f0] font-medium py-3 rounded-lg hover:bg-[#d19530] transition-colors"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f4f0] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#1a1a1a] border-b md:border-r border-[#333] p-6 flex flex-col">
        <h1 className="text-2xl font-serif text-[#f5f4f0] mb-8 hidden md:block">CMS</h1>
        
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18} />} label="Profile & Hero" />
          <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Briefcase size={18} />} label="Projects" />
          <TabButton active={activeTab === 'playground'} onClick={() => setActiveTab('playground')} icon={<Zap size={18} />} label="Playground" />
          <TabButton active={activeTab === 'social-links'} onClick={() => setActiveTab('social-links')} icon={<LinkIcon size={18} />} label="Social Links" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={18} />} label="Settings" />
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto hidden md:flex items-center gap-2 text-[#808080] hover:text-[#f5f4f0] transition-colors pt-6 border-t border-[#333]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto h-[calc(100vh-80px)] md:h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif capitalize">{activeTab}</h2>
              <p className="text-[#808080] mt-1 text-sm">Manage your {activeTab} content</p>
            </div>
            {activeTab !== 'profile' && activeTab !== 'settings' && (
              <button
                onClick={openNew}
                className="flex items-center gap-2 bg-[#e2a336] text-[#f5f4f0] px-5 py-2.5 rounded-full hover:bg-[#d19530] transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                Add New
              </button>
            )}
          </div>

          {isLoading && !isFormOpen && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#e2a336]" size={32} />
            </div>
          )}

          <div className="space-y-3">
            {activeTab === 'profile' ? (
              profileData && (
                <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#808080] mb-1 block">Hero Text</label>
                      <h3 className="text-2xl font-serif text-[#f5f4f0]">
                        {profileData.heroGreeting || "Hi, I'm "}<span className="text-[#e2a336]">{profileData.heroName || "Faith"}</span>
                      </h3>
                      <p className="text-[#808080] text-sm mt-2">
                        {profileData.bodyText || "I craft thoughtful digital experiences..."}
                      </p>
                    </div>
                    <div>
                       <label className="text-xs uppercase tracking-wider text-[#808080] mb-1 block">Status Badge</label>
                       <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${profileData.availability ? 'bg-green-400' : 'bg-red-400'}`}></div>
                         <p className="text-[#f5f4f0]">{profileData.status}</p>
                       </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={openEditProfile}
                      className="flex items-center gap-2 bg-[#e2a336] text-[#f5f4f0] px-5 py-2.5 rounded-lg hover:bg-[#d19530] transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )
            ) : activeTab === 'settings' ? (
              settingsData && (
                <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#333]">
                   <div className="flex items-center justify-between mb-6">
                     <div>
                       <h3 className="text-xl font-serif text-[#f5f4f0] mb-2">General Settings</h3>
                       <p className="text-[#808080] text-sm">Configure global application behavior.</p>
                     </div>
                   </div>
                   
                   <div className="bg-[#0f0f0f] border border-[#333] p-6 rounded-lg flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <div className={`w-2.5 h-2.5 rounded-full ${settingsData.maintenanceMode ? 'bg-[#e2a336]' : 'bg-[#333]'}`} />
                         <span className="text-[#f5f4f0] font-medium">Maintenance Mode</span>
                       </div>
                       <p className="text-[#808080] text-sm">
                         {settingsData.maintenanceMode ? 'The site is currently hidden from the public.' : 'The site is live and visible to everyone.'}
                       </p>
                     </div>
                     <button 
                        onClick={openEditSettings}
                        className="text-[#e2a336] hover:text-[#d19530] text-sm font-medium"
                      >
                        Change
                      </button>
                   </div>
                </div>
              )
            ) : (
              <>
                 <div className="flex justify-end mb-4">
                     <button onClick={saveOrder} className="text-xs text-[#808080] hover:text-[#e2a336]">Save Order</button>
                 </div>
                 {items.map((item, index) => (
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        index={index}
                        item={item}
                        moveItem={moveItem}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        renderContent={(i) => (
                             <div className="flex items-center gap-4">
                                <span className="text-[#808080] font-mono text-xs w-8">#{index + 1}</span>
                                <div>
                                    <h3 className="font-serif text-[#f5f4f0] text-lg">{i.title || i.author || i.label}</h3>
                                    <p className="text-[#808080] text-sm line-clamp-1">{i.description || i.role || i.link || i.path}</p>
                                </div>
                             </div>
                        )}
                    />
                 ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-lg border border-[#333] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">
                {activeTab === 'profile' ? 'Edit Profile' : activeTab === 'settings' ? 'Edit Settings' : (editingItem ? 'Edit Item' : 'New Item')}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-[#808080] hover:text-[#f5f4f0]">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {renderFormFields()}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#e2a336] text-[#f5f4f0] font-medium py-3 rounded-lg hover:bg-[#d19530] transition-colors flex justify-center items-center gap-2 mt-6"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
    </DndProvider>
  );
}

// UI Helpers

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
        active ? 'bg-[#e2a336] text-[#f5f4f0]' : 'text-[#808080] hover:bg-[#333] hover:text-[#f5f4f0]'
      }`}
    >
      {icon}
      <span className="font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}

function Input({ label, value, onChange, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-sm text-[#808080] mb-2">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm text-[#808080] mb-2">{label}</label>
      <textarea
        rows={4}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-4 py-3 rounded-lg focus:border-[#e2a336] outline-none resize-none"
      />
    </div>
  );
}