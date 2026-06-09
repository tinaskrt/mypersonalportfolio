import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

const PortfolioContext = createContext();

const MY_FIREBASE_CREDENTIALS = {
  apiKey: "AIzaSyDnT_-M2wCuKLF_TB-3fxgxTug11TMgC2E",
  authDomain: "my-personal-portfolio-a2b6c.firebaseapp.com",
  projectId: "my-personal-portfolio-a2b6c",
  storageBucket: "my-personal-portfolio-a2b6c.firebasestorage.app",
  messagingSenderId: "782092501017",
  appId: "1:782092501017:web:079945d4b4a41dc2852a88"
};
const DEFAULT_BIO = {
  name: "Maria Cristina Florida",
  subtitle: "Aspiring Front-End Developer & UI/UX Designer",
  intro: "I am an aspiring Front-End Developer and UI/UX Designer passionate about crafting modern, elegant, and interactive web experiences. With a foundation in HTML, CSS, JavaScript, and Figma, I bridge the gap between creative design and clean code. I love designing layouts inspired by Apple's design language, blending glassmorphism, responsive alignment, and rich micro-interactions to create memorable digital products.",
  learning: "Currently pursuing my studies, my learning journey is driven by a deep curiosity for technologies and styles. I started with responsive layout design and interface wireframing, which naturally led to building modular web projects. Lately, I've been exploring basic Flutter for mobile applications and Python for automation, always seeking to expand my technical skill set.",
  goals: "My ultimate goal is to become a full-stack developer who designs beautiful, accessibility-compliant web interfaces that provide luxury-tier user experiences. I want to build systems that empower creators and continue contributing to front-end design innovation.",
  techStack: {
    frontend: ["HTML", "CSS", "Tailwind CSS", "JavaScript"],
    design: ["Figma"],
    additional: ["Flutter (Basic)", "Python (Basic)"]
  },
  services: [
    { id: "s1", title: "Front-End Development", description: "Developing clean, structured HTML, responsive layouts with CSS/Tailwind, and dynamic behaviors using JavaScript." },
    { id: "s2", title: "Responsive Website Design", description: "Crafting layouts that adapt beautifully to all screens, from desktops to mobile devices." },
    { id: "s3", title: "UI/UX Design", description: "Designing interfaces in Figma that prioritize usability, visual harmony, and intuitive user flows." },
    { id: "s4", title: "Wireframing & Prototyping", description: "Creating interactive prototypes and layout blueprints in Figma to map user journeys before coding." },
    { id: "s5", title: "Basic Flutter Development", description: "Building basic mobile interfaces and responsive layouts for Android and iOS using Dart and Flutter." },
    { id: "s6", title: "Website Planning", description: "Consulting on user experience architecture, component structures, and front-end optimization strategies." }
  ],
  contact: {
    email: "florida.mariacristina@dnsc.edu.ph",
    phone: "09458134596",
    github: "tinaskrt",
    instagram: "riaflorene_",
    facebook: "Maria Cristina Florida"
  },
  adminPassword: "maria123"
};

const SEED_PROJECTS = [
  {
    id: "p1",
    title: "Cry of Balintawak",
    category: "Historical Short Film",
    year: "2024",
    description: "A dramatic historical short film recreating the famous Cry of Balintawak event, highlighting key figures and historical significance.",
    myRole: "Production Designer & Co-Editor",
    objectives: "To educate viewers on the historical significance of the Cry of Balintawak; to recreate accurate period environments; to assemble a compelling cinematic presentation.",
    process: "Conducted historical research on outfits and weapons; designed physical backdrops; performed color grading and sound synchronization.",
    challenges: "Budget constraints for period costumes and limited daylight filming schedules.",
    outcomes: "Successfully screened at the university film festival, receiving high praise for set design authenticity and sound design.",
    featured: true,
    tags: ["Video Production", "Historical Design", "Sound Editing", "Premiere Pro"],
    images: []
  },
  {
    id: "p2",
    title: "Nochebuena",
    category: "MTV Spoof",
    year: "2023",
    description: "A vibrant, fast-paced MTV-style music video spoof centered around Filipino Nochebuena Christmas traditions, filled with humor and nostalgia.",
    myRole: "Director, Co-Writer & Visual Effects Artist",
    objectives: "Recreate the high-energy aesthetic of early 2000s MTV videos; highlight unique Filipino holiday elements; produce a viral-quality comedy short.",
    process: "Storyboarded humorous sequences; filmed in dynamic locations with rapid lighting changes; added retro overlays, VHS filters, and quick-cut edits.",
    challenges: "Matching the audio timing with fast comedic clips under tight deadlines.",
    outcomes: "Garnered thousands of views on social media and won 'Best Editing' in the student creative media showcase.",
    featured: true,
    tags: ["Directing", "MTV Spoof", "Visual Effects", "Color Grading"],
    images: []
  },
  {
    id: "p3",
    title: "Photography Collection",
    category: "Photography Collection",
    year: "2025",
    description: "A curated collection of street, architecture, and portrait photography capturing daily moments with high contrast and evocative lighting.",
    myRole: "Lead Photographer & Photo Editor",
    objectives: "Explore visual storytelling through light and shadow; compile a cohesive collection of urban life; showcase post-processing expertise in color calibration.",
    process: "Explored downtown streets during golden hour; shot with high-aperture lenses; color-graded using custom presets.",
    challenges: "Working with unpredictable weather and variable natural lighting conditions.",
    outcomes: "Presented as a digital gallery; selected prints featured in a local art exhibition.",
    featured: true,
    tags: ["Street Photography", "Lightroom", "Color Theory", "Composition"],
    images: []
  }
];
export const PortfolioProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('maria-portfolio-theme') || 'blush-bloom';
  });

  const [bio, setBio] = useState(() => {
    const local = localStorage.getItem('maria-portfolio-bio');
    return local ? JSON.parse(local) : DEFAULT_BIO;
  });

  const [projects, setProjects] = useState(() => {
    const local = localStorage.getItem('maria-portfolio-projects');
    return local ? JSON.parse(local) : SEED_PROJECTS;
  });

  const [activeSection, setActiveSection] = useState('home');

  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    const local = localStorage.getItem('maria-portfolio-fb-config');
    if (local) return JSON.parse(local);
    return MY_FIREBASE_CREDENTIALS.apiKey !== "AIzaSy..." ? MY_FIREBASE_CREDENTIALS : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('maria-portfolio-is-admin') === 'true';
  });

  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [themeRippleTrigger, setThemeRippleTrigger] = useState(null);

  // 🔴 REPLACE JUST THIS INITIALIZATION CHECK INSIDE YOUR EFFECT BLOCK:
  useEffect(() => {
    if (firebaseConfig && firebaseConfig.apiKey) {
      try {
        const apps = getApps();
        // 🌟 FIXED: Correctly assign apps[0] instead of the whole array if already initialized
        const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];

        const firestoreInstance = getFirestore(app);
        const authInstance = getAuth(app);
        setDb(firestoreInstance);
        setAuth(authInstance);
        setIsFirebaseConnected(true);

        setLoading(true);
        const bioRef = doc(firestoreInstance, 'portfolio', 'bio');
        const projectsRef = doc(firestoreInstance, 'portfolio', 'projects');

        Promise.all([getDoc(bioRef), getDoc(projectsRef)])
          .then(([bioSnap, projectsSnap]) => {
            if (bioSnap.exists() && Object.keys(bioSnap.data()).length > 1) {
              setBio(bioSnap.data());
            }

            if (projectsSnap.exists() && projectsSnap.data() && projectsSnap.data().list) {
              setProjects(projectsSnap.data().list);
            } else {
              setProjects(SEED_PROJECTS);
            }
          })
          .catch((err) => {
            console.error("Firebase database fetch failure:", err);
            setErrorMsg("Failed to synchronize active database data entries.");
            setProjects(SEED_PROJECTS);
          })
          .finally(() => setLoading(false));

      } catch (err) {
        console.error("Firebase runtime initial construction failure:", err);
        setIsFirebaseConnected(false);
      }
    }
  }, [firebaseConfig]);


  const toggleTheme = (e) => {
    if (e && e.clientX && e.clientY) {
      setThemeRippleTrigger({ x: e.clientX, y: e.clientY });
    }
    const nextTheme = theme === 'blush-bloom' ? 'theme-midnight-rose' : 'blush-bloom';
    setTheme(nextTheme);
    localStorage.setItem('maria-portfolio-theme', nextTheme);
  };

  const updateBio = async (newBioData) => {
    setBio(newBioData);
    localStorage.setItem('maria-portfolio-bio', JSON.stringify(newBioData));

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, 'portfolio', 'bio'), newBioData);
      } catch (err) {
        console.error("Cloud document profile save execution failure:", err);
        throw new Error("Could not update information structure changes in cloud storage.");
      }
    }
  };

  const saveProjectsList = async (updatedList) => {
    setProjects(updatedList);
    localStorage.setItem('maria-portfolio-projects', JSON.stringify(updatedList));

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, 'portfolio', 'projects'), { list: updatedList });
      } catch (err) {
        console.error("Cloud array persistence transaction failure:", err);
        throw new Error("Target project registry list mapping rejected by host.");
      }
    }
  };

  const addProject = async (projectItem) => {
    const freshItem = { ...projectItem, id: `p-${Date.now()}` };
    const updated = [freshItem, ...projects];
    await saveProjectsList(updated);
  };

  const editProject = async (id, updatedDetails) => {
    const updated = projects.map(item => item.id === id ? { ...item, ...updatedDetails } : item);
    await saveProjectsList(updated);
  };

  const deleteProject = async (id) => {
    const updated = projects.filter(item => item.id !== id);
    await saveProjectsList(updated);
  };

  const saveCloudConfig = (configData) => {
    setFirebaseConfig(configData);
    localStorage.setItem('maria-portfolio-fb-config', JSON.stringify(configData));
  };

  const loginAdmin = async (passwordInput) => {
    if (passwordInput === bio.adminPassword) {
      setIsAdmin(true);
      localStorage.setItem('maria-portfolio-is-admin', 'true');
      return true;
    }
    throw new Error("Provided administrator authentication entry password rejected.");
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.setItem('maria-portfolio-is-admin', 'false');
    if (auth) fbSignOut(auth).catch(console.error);
  };

  return (
    <PortfolioContext.Provider value={{
      theme,
      toggleTheme,
      bio,
      updateBio,
      projects,
      addProject,
      editProject,
      deleteProject,
      activeSection,
      setActiveSection,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      isFirebaseConnected,
      saveCloudConfig,
      loading,
      errorMsg,
      themeRippleTrigger,
      setThemeRippleTrigger
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be wrapped natively by a PortfolioProvider context container.");
  return context;
};
