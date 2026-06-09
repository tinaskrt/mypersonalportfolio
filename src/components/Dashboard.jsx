import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, Unlock, LogOut, Plus, Edit, Trash2, ArrowUp, ArrowDown, Settings, Mail, Database, Award, Info, FileText, CheckCircle, Upload } from 'lucide-react';

export default function Dashboard({ onClose }) {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,

    bio,
    updateBio,

    projects,
    addProject,
    editProject,
    deleteProject,
    saveProjectsList,

    firebaseConfig,
    saveCloudConfig,

    isFirebaseConnected,
    errorMsg
  } = usePortfolio();

  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // projects, content, inbox, db
  const [editingProject, setEditingProject] = useState(null); // null, 'new', or project object

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    year: '',
    description: '',
    myRole: '',
    objectives: '',
    process: '',
    challenges: '',
    outcomes: '',
    featured: false,
    tags: '',
    coverImage: ''
  });

  // Bio Form State
  const [bioForm, setBioForm] = useState({ ...bio });
  // Dynamic skills arrays
  const [newFrontendSkill, setNewFrontendSkill] = useState('');
  const [newDesignSkill, setNewDesignSkill] = useState('');
  const [newAddSkill, setNewAddSkill] = useState('');

  // Firebase connection config state
  const [fbConfigInput, setFbConfigInput] = useState(() => {
    return firebaseConfig ? JSON.stringify(firebaseConfig, null, 2) : '';
  });

  // Local storage messages
  const [inboxMessages, setInboxMessages] = useState(() => {
    return JSON.parse(localStorage.getItem('maria-portfolio-messages') || '[]');
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(passwordInput);
    setPasswordInput('');
  };

  // Handle Project Form Changes
  const handleProjectFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Convert Cover Image File to Base64
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectForm(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Add/Edit project
  const handleOpenProjectForm = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        ...proj,
        tags: proj.tags ? proj.tags.join(', ') : ''
      });
    } else {
      setEditingProject('new');
      setProjectForm({
        title: '',
        category: '',
        year: new Date().getFullYear().toString(),
        description: '',
        myRole: '',
        objectives: '',
        process: '',
        challenges: '',
        outcomes: '',
        featured: false,
        tags: '',
        coverImage: ''
      });
    }
  };

  // Save project form
  // 🌟 REPLACE JUST THIS ONE FUNCTION INSIDE YOUR DASHBOARD.JSX FILE:
  const handleSaveProject = async (e) => {
    e.preventDefault();

    const formattedTags = projectForm.tags
      ? projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const projectData = {
      ...projectForm,
      tags: formattedTags
    };

    try {
      if (editingProject === 'new') {
        await addProject(projectData);
      } else {
        await editProject(editingProject.id, projectData);
      }

      setEditingProject(null);
    } catch (err) {
      console.error(err);
      alert("Save transaction interrupted.");
    }
  };


  // Delete project
  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const newProjects = projects.filter(p => p.id !== id);
      projects(newProjects);
    }
  };

  // Reorder projects
  const handleMoveProject = (index, direction) => {
    const newProjects = [...projects];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    // Swap elements
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;
    projects(newProjects);
  };

  // Toggle Featured status
  const handleToggleFeatured = (id) => {
    const newProjects = projects.map(p => {
      if (p.id === id) {
        // limit home featured projects count to 3
        const isCurrentFeatured = p.featured;
        const currentFeaturedCount = projects.filter(pr => pr.featured).length;
        if (!isCurrentFeatured && currentFeaturedCount >= 3) {
          alert("Maximum 3 featured projects are allowed on the home page. Please unfeature another project first.");
          return p;
        }
        return { ...p, featured: !isCurrentFeatured };
      }
      return p;
    });
    projects(newProjects);
  };

  // Add/Remove tech stack elements
  const handleAddSkillPill = (category) => {
    const tempBio = { ...bioForm };
    if (category === 'frontend' && newFrontendSkill) {
      tempBio.techStack.frontend.push(newFrontendSkill);
      setNewFrontendSkill('');
    } else if (category === 'design' && newDesignSkill) {
      tempBio.techStack.design.push(newDesignSkill);
      setNewDesignSkill('');
    } else if (category === 'additional' && newAddSkill) {
      tempBio.techStack.additional.push(newAddSkill);
      setNewAddSkill('');
    }
    setBioForm(tempBio);
    updateBio(tempBio);
  };

  const handleRemoveSkillPill = (category, index) => {
    const tempBio = { ...bioForm };
    tempBio.techStack[category].splice(index, 1);
    setBioForm(tempBio);
    updateBio(tempBio);
  };

  // Save General Bio info
  const handleSaveBioInfo = (e) => {
    e.preventDefault();
    updateBio(bioForm);
    alert("Profile settings updated successfully!");
  };

  // Inbox deletion
  const handleDeleteMessage = (id) => {
    if (window.confirm("Delete this message?")) {
      const updated = inboxMessages.filter(m => m.id !== id);
      setInboxMessages(updated);
      localStorage.setItem('maria-portfolio-messages', JSON.stringify(updated));
    }
  };

  // Save Firebase configuration
  const handleSaveFirebaseSettings = (e) => {
    e.preventDefault();
    if (!fbConfigInput.trim()) {
      saveCloudConfig(null);
      alert("Firebase connection cleared. Using LocalStorage mode.");
      return;
    }

    try {
      const parsedConfig = JSON.parse(fbConfigInput);
      saveCloudConfig(parsedConfig);
      alert("Firebase configuration saved! Attempting sync...");
    } catch (err) {
      alert("Invalid JSON format. Please paste a valid Firebase Configuration object.");
    }
  };

  // Sign out handler
  const handleSignOut = () => {
    logoutAdmin();
  };

  // Login Gate View
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-border-glass shadow-2xl z-10 text-center animate-[zoomIn_0.25s_ease]">
          <div className="p-4 rounded-full bg-accent/15 text-accent w-fit mx-auto mb-6">
            <Lock className="w-8 h-8 animate-pulse-glow" />
          </div>

          <h2 className="text-2xl font-black text-text-main tracking-tight mb-2">CMS Security Gate</h2>
          <p className="text-sm text-text-muted mb-6">Access credentials are required to edit portfolio content and layouts.</p>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Dashboard Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/50 focus:ring-1 focus:ring-accent outline-none text-text-main font-semibold shadow-inner"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-pink-500 bg-pink-500/10 border border-pink-500/20 px-3 py-2 rounded-lg text-center mt-1">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="mt-3 py-3.5 rounded-xl bg-accent text-white font-bold tracking-wide shadow-md hover:bg-accent/90 transition-all cursor-pointer"
            >
              Authenticate & Open
            </button>
          </form>

          <button onClick={onClose} className="mt-4 text-xs font-bold text-text-muted hover:text-accent transition-colors cursor-pointer">
            Close & Cancel
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard main layout
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/55 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-full md:h-[90vh] glass-panel rounded-none md:rounded-3xl border border-border-glass shadow-2xl z-10 flex flex-col overflow-hidden animate-[zoomIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">

        {/* Dashboard Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-glass bg-bg-glass/80 backdrop-blur-md">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 rounded-xl bg-accent text-white shadow-sm">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-text-main tracking-tight leading-tight">Maria CMS</h2>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-green-500' : 'bg-orange-500'}`} />
                {isFirebaseConnected ? 'Firebase Active' : 'LocalStorage Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-border-glass hover:bg-pink-500/10 hover:border-pink-500/30 text-text-muted hover:text-pink-500 font-bold text-xs tracking-wide transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs tracking-wide shadow-sm hover:bg-accent/90 transition-all cursor-pointer"
            >
              Exit Dashboard
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Panel split */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-bg-base/30">

          {/* Side Tabs navigation */}
          <nav className="w-full md:w-56 border-r border-border-glass flex flex-row md:flex-col p-3 gap-2 overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => { setActiveTab('projects'); setEditingProject(null); }}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${activeTab === 'projects' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:bg-accent/10 hover:text-accent'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Project CMS</span>
            </button>
            <button
              onClick={() => { setActiveTab('content'); setEditingProject(null); }}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${activeTab === 'content' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:bg-accent/10 hover:text-accent'}`}
            >
              <Info className="w-4 h-4" />
              <span>Site Content</span>
            </button>
            <button
              onClick={() => { setActiveTab('inbox'); setEditingProject(null); }}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${activeTab === 'inbox' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:bg-accent/10 hover:text-accent'}`}
            >
              <Mail className="w-4 h-4" />
              <span>Inbox ({inboxMessages.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('db'); setEditingProject(null); }}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${activeTab === 'db' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:bg-accent/10 hover:text-accent'}`}
            >
              <Database className="w-4 h-4" />
              <span>Cloud Setup</span>
            </button>
          </nav>

          {/* Active Panel Viewport */}
          <div className="flex-grow overflow-y-auto p-6 md:p-8 text-left">

            {/* TAB 1: PROJECTS */}
            {activeTab === 'projects' && !editingProject && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-extrabold text-text-main tracking-tight">Manage Projects</h3>
                  <button
                    onClick={() => handleOpenProjectForm()}
                    className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-accent text-white font-bold text-sm tracking-wide shadow-md hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                {/* Table / Cards list of projects */}
                <div className="flex flex-col gap-4">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="glass-panel p-4 rounded-2xl border border-border-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-gradient-to-tr from-accent to-pink-500/20 border border-border-glass flex-shrink-0 flex items-center justify-center text-white font-bold text-xs select-none">
                          {proj.coverImage ? (
                            <img src={proj.coverImage} className="w-full h-full object-cover rounded-xl" alt="" />
                          ) : (
                            'P'
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-text-main tracking-tight leading-tight">{proj.title}</h4>
                          <p className="text-xs text-text-muted mt-1">{proj.category} • {proj.year}</p>
                        </div>
                      </div>

                      {/* Controls Area */}
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">

                        {/* Order Controls */}
                        <div className="flex items-center gap-1 border border-border-glass rounded-xl p-1 bg-bg-base/30">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveProject(idx, -1)}
                            className="p-1.5 rounded-lg text-text-muted hover:bg-accent/10 hover:text-accent disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === projects.length - 1}
                            onClick={() => handleMoveProject(idx, 1)}
                            className="p-1.5 rounded-lg text-text-muted hover:bg-accent/10 hover:text-accent disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Feature Toggler */}
                        <button
                          onClick={() => handleToggleFeatured(proj.id)}
                          className={`text-xs font-bold py-1.5 px-3 rounded-full border transition-all cursor-pointer ${proj.featured ? 'bg-accent/15 border-accent/30 text-accent' : 'bg-transparent border-border-glass text-text-muted'}`}
                        >
                          {proj.featured ? '★ Featured Trio' : '☆ Feature on Home'}
                        </button>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenProjectForm(proj)}
                            className="p-2 rounded-xl border border-border-glass hover:bg-accent/10 hover:text-accent text-text-muted transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 rounded-xl border border-border-glass hover:bg-pink-500/10 hover:text-pink-500 text-text-muted transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-text-muted italic py-8 text-center">No projects in database. Click Add Project to start!</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 1 FORM: ADD / EDIT PROJECT */}
            {activeTab === 'projects' && editingProject && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <div className="flex items-center justify-between pb-4 border-b border-border-glass mb-6">
                  <h3 className="text-xl font-extrabold text-text-main tracking-tight">
                    {editingProject === 'new' ? 'Create Project Document' : `Modify Document: ${editingProject.title}`}
                  </h3>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-xs font-bold text-text-muted hover:text-accent cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Title & Category */}
                  <div className="md:col-span-8 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Project Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={projectForm.title}
                      onChange={handleProjectFieldChange}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Production Year</label>
                    <input
                      type="text"
                      name="year"
                      required
                      value={projectForm.year}
                      onChange={handleProjectFieldChange}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Category / Format</label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={projectForm.category}
                      onChange={handleProjectFieldChange}
                      placeholder="e.g. Historical Short Film, MTV Spoof, Photography"
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">My Specific Role</label>
                    <input
                      type="text"
                      name="myRole"
                      value={projectForm.myRole}
                      onChange={handleProjectFieldChange}
                      placeholder="e.g. Lead Developer, Director, Editor"
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-12 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Short Description (Cards & Previews)</label>
                    <textarea
                      name="description"
                      required
                      rows="3"
                      value={projectForm.description}
                      onChange={handleProjectFieldChange}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm resize-none"
                    />
                  </div>

                  {/* Story Details Split */}
                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Objectives</label>
                    <textarea
                      name="objectives"
                      rows="3"
                      value={projectForm.objectives}
                      onChange={handleProjectFieldChange}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Process & Execution</label>
                    <textarea
                      name="process"
                      rows="3"
                      value={projectForm.process}
                      onChange={handleProjectFieldChange}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Challenges Faced</label>
                    <textarea
                      name="challenges"
                      rows="3"
                      value={projectForm.challenges}
                      onChange={handleProjectFieldChange}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Outcomes & Achievements</label>
                    <textarea
                      name="outcomes"
                      rows="3"
                      value={projectForm.outcomes}
                      onChange={handleProjectFieldChange}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-8 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Keywords / Tags (Comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={projectForm.tags}
                      onChange={handleProjectFieldChange}
                      placeholder="e.g. React, Figma, Directing, Editing"
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/40 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-4 flex items-center gap-3 mt-5">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={projectForm.featured}
                      onChange={handleProjectFieldChange}
                      className="w-4.5 h-4.5 accent-accent"
                    />
                    <label htmlFor="featured" className="text-xs font-bold text-text-main cursor-pointer uppercase">Pin as Home Featured</label>
                  </div>

                  {/* Image uploader */}
                  <div className="md:col-span-12 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Project Cover Thumbnail</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent/10 border border-accent/25 text-accent font-bold text-xs cursor-pointer hover:bg-accent/20 transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Upload Custom Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      {projectForm.coverImage ? (
                        <div className="w-24 h-16 rounded-lg overflow-hidden border border-border-glass bg-zinc-950 flex-shrink-0">
                          <img src={projectForm.coverImage} className="w-full h-full object-cover" alt="" />
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted italic">No custom image. Fallback gradients will be rendered beautifully.</span>
                      )}
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="md:col-span-12 flex justify-end gap-3 mt-4 border-t border-border-glass pt-6">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-5 py-2.5 rounded-xl border border-border-glass text-text-muted font-bold text-sm hover:bg-text-main/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-sm shadow-md hover:bg-accent/90 cursor-pointer"
                    >
                      Save Project
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB 2: SITE CONTENT */}
            {activeTab === 'content' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-text-main tracking-tight mb-6">Edit Site Profiles</h3>

                <form onSubmit={handleSaveBioInfo} className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Name and Tagline */}
                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">My Portfolio Name</label>
                    <input
                      type="text"
                      required
                      value={bioForm.name}
                      onChange={(e) => setBioForm({ ...bioForm, name: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main font-semibold text-sm focus:border-accent/40 outline-none"
                    />
                  </div>

                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Subtitle Headline</label>
                    <input
                      type="text"
                      required
                      value={bioForm.subtitle}
                      onChange={(e) => setBioForm({ ...bioForm, subtitle: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main font-semibold text-sm focus:border-accent/40 outline-none"
                    />
                  </div>

                  {/* Narrative Bio elements */}
                  <div className="md:col-span-12 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Brief Bio Introduction (Hero section)</label>
                    <textarea
                      required
                      rows="4"
                      value={bioForm.intro}
                      onChange={(e) => setBioForm({ ...bioForm, intro: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm focus:border-accent/40 outline-none resize-none"
                    />
                  </div>

                  <div className="md:col-span-12 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Learning Journey Narrative (About section)</label>
                    <textarea
                      required
                      rows="4"
                      value={bioForm.learning}
                      onChange={(e) => setBioForm({ ...bioForm, learning: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm focus:border-accent/40 outline-none resize-none"
                    />
                  </div>

                  <div className="md:col-span-12 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Future Aspirations (About section)</label>
                    <textarea
                      required
                      rows="3"
                      value={bioForm.goals}
                      onChange={(e) => setBioForm({ ...bioForm, goals: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm focus:border-accent/40 outline-none resize-none"
                    />
                  </div>

                  {/* Contact Coordinates */}
                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">E-Mail Address</label>
                    <input
                      type="email"
                      required
                      value={bioForm.contact.email}
                      onChange={(e) => setBioForm({
                        ...bioForm,
                        contact: { ...bioForm.contact, email: e.target.value }
                      })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={bioForm.contact.phone}
                      onChange={(e) => setBioForm({
                        ...bioForm,
                        contact: { ...bioForm.contact, phone: e.target.value }
                      })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">GitHub Username</label>
                    <input
                      type="text"
                      value={bioForm.contact.github}
                      onChange={(e) => setBioForm({
                        ...bioForm,
                        contact: { ...bioForm.contact, github: e.target.value }
                      })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Instagram Username</label>
                    <input
                      type="text"
                      value={bioForm.contact.instagram}
                      onChange={(e) => setBioForm({
                        ...bioForm,
                        contact: { ...bioForm.contact, instagram: e.target.value }
                      })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm"
                    />
                  </div>

                  <div className="md:col-span-4 flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Facebook Profile Search</label>
                    <input
                      type="text"
                      value={bioForm.contact.facebook}
                      onChange={(e) => setBioForm({
                        ...bioForm,
                        contact: { ...bioForm.contact, facebook: e.target.value }
                      })}
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass text-text-main text-sm"
                    />
                  </div>

                  {/* Skills lists Pill managers */}
                  <div className="md:col-span-12 border-t border-border-glass mt-6 pt-6">
                    <h4 className="font-extrabold text-sm text-text-main tracking-tight uppercase mb-4">Manage Skills Badge Arrays</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                      {/* Front-End List */}
                      <div className="flex flex-col gap-3">
                        <span className="text-xs font-extrabold text-accent">FRONT-END BADGES</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Add skill..."
                            value={newFrontendSkill}
                            onChange={(e) => setNewFrontendSkill(e.target.value)}
                            className="flex-grow px-3 py-1.5 rounded-lg bg-bg-base border border-border-glass text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSkillPill('frontend')}
                            className="p-2 rounded-lg bg-accent text-white font-bold text-xs"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {bioForm.techStack.frontend.map((sk, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
                              {sk}
                              <button type="button" onClick={() => handleRemoveSkillPill('frontend', index)} className="hover:text-pink-600 font-bold ml-1">×</button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Design List */}
                      <div className="flex flex-col gap-3">
                        <span className="text-xs font-extrabold text-accent">DESIGN BADGES</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Add designer skill..."
                            value={newDesignSkill}
                            onChange={(e) => setNewDesignSkill(e.target.value)}
                            className="flex-grow px-3 py-1.5 rounded-lg bg-bg-base border border-border-glass text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSkillPill('design')}
                            className="p-2 rounded-lg bg-accent text-white font-bold text-xs"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {bioForm.techStack.design.map((sk, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-500 text-xs font-semibold">
                              {sk}
                              <button type="button" onClick={() => handleRemoveSkillPill('design', index)} className="hover:text-rose-600 font-bold ml-1">×</button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Additional List */}
                      <div className="flex flex-col gap-3">
                        <span className="text-xs font-extrabold text-accent">ADDITIONAL LANGUAGES</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Add language..."
                            value={newAddSkill}
                            onChange={(e) => setNewAddSkill(e.target.value)}
                            className="flex-grow px-3 py-1.5 rounded-lg bg-bg-base border border-border-glass text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSkillPill('additional')}
                            className="p-2 rounded-lg bg-accent text-white font-bold text-xs"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {bioForm.techStack.additional.map((sk, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-text-main/10 text-text-main text-xs font-semibold">
                              {sk}
                              <button type="button" onClick={() => handleRemoveSkillPill('additional', index)} className="hover:text-red-500 font-bold ml-1">×</button>
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Form Submission */}
                  <div className="md:col-span-12 flex justify-end gap-3 mt-6 pt-6 border-t border-border-glass">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-sm shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                    >
                      Save Profiles
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB 3: INBOX */}
            {activeTab === 'inbox' && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h3 className="text-xl font-extrabold text-text-main tracking-tight mb-6">Contact Form Messages</h3>

                <div className="flex flex-col gap-5">
                  {inboxMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="glass-panel p-5 rounded-2xl border border-border-glass flex flex-col gap-3 relative"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-pink-500 hover:bg-pink-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
                        <span className="text-accent font-bold">{msg.name}</span>
                        <span>({msg.email})</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-text-main leading-tight">Subject: {msg.subject}</h4>
                        <p className="text-xs text-text-muted mt-2 leading-relaxed bg-bg-base/40 p-3.5 rounded-xl border border-border-glass/30 whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}

                  {inboxMessages.length === 0 && (
                    <div className="text-center py-16 text-text-muted italic">
                      No customer messages have been logged yet. Test submissions will accumulate here.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: FIREBASE SETTINGS */}
            {activeTab === 'db' && (
              <div className="animate-[fadeIn_0.3s_ease] text-left">
                <h3 className="text-xl font-extrabold text-text-main tracking-tight mb-4">Cloud Database Sync Configuration</h3>

                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                  Enter your Google Firebase Web configuration details below. Once provided, the CMS will automatically synchronize your projects, profile documents, and contact logs to cloud storage.
                </p>

                <form onSubmit={handleSaveFirebaseSettings} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Firebase JSON Configuration Object</label>
                    <textarea
                      rows="10"
                      value={fbConfigInput}
                      onChange={(e) => setFbConfigInput(e.target.value)}
                      placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "...",\n  "projectId": "...",\n  "storageBucket": "...",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
                      className="p-4 rounded-xl bg-bg-base border border-border-glass font-mono text-xs text-text-main outline-none focus:border-accent/40 shadow-inner resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center border-t border-border-glass pt-6 mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold">
                      <Database className="w-4 h-4 text-accent" />
                      <span>Mode: {isFirebaseConnected ? 'Firebase Realtime Web Sync' : 'Static LocalStorage Sandbox'}</span>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-sm tracking-wide shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
