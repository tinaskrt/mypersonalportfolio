import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

const PortfolioContext = createContext();

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
    images: [] // Will fallback to gradient dynamically
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
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('maria-portfolio-theme') || 'blush-bloom';
  });

  // Local state fallbacks
  const [bio, setBio] = useState(() => {
    const local = localStorage.getItem('maria-portfolio-bio');
    return local ? JSON.parse(local) : DEFAULT_BIO;
  });

  const [projects, setProjects] = useState(() => {
    const local = localStorage.getItem('maria-portfolio-projects');
    return local ? JSON.parse(local) : SEED_PROJECTS;
  });

  // Active section for header indicator
  const [activeSection, setActiveSection] = useState('home');

  // Firebase Config State
  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    const local = localStorage.getItem('maria-portfolio-fb-config');
    return local ? JSON.parse(local) : null;
  });

  // CMS login session state (stored locally or via Firebase Auth)
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('maria-portfolio-is-admin') === 'true';
  });

  // Firebase Instances
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Circular transition coordinates trigger
  const [themeRippleTrigger, setThemeRippleTrigger] = useState(null);

  // Initialize Firebase dynamically if config exists
  useEffect(() => {
    if (firebaseConfig && firebaseConfig.apiKey) {
      try {
        const apps = getApps();
        let app;
        if (apps.length === 0) {
          app = initializeApp(firebaseConfig);
        } else {
          app = apps[0];
        }
        const firestoreInstance = getFirestore(app);
        const authInstance = getAuth(app);
        setDb(firestoreInstance);
        setAuth(authInstance);
        setIsFirebaseConnected(true);

        // Fetch data from firestore
        setLoading(true);
        const bioRef = doc(firestoreInstance, 'portfolio', 'bio');
        const projectsRef = doc(firestoreInstance, 'portfolio', 'projects');

        Promise.all([getDoc(bioRef), getDoc(projectsRef)])
          .then(([bioSnap, projectsSnap]) => {
            if (bioSnap.exists()) {
              setBio(bioSnap.data());
              localStorage.setItem('maria-portfolio-bio', JSON.stringify(bioSnap.data()));
            }
            if (projectsSnap.exists()) {
              setProjects(projectsSnap.data().list || []);
              localStorage.setItem('maria-portfolio-projects', JSON.stringify(projectsSnap.data().list || []));
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Firebase read error, falling back to LocalStorage:", err);
            setLoading(false);
          });

        // Set up listener for auth change if Firebase connected
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
          if (user) {
            setIsAdmin(true);
            localStorage.setItem('maria-portfolio-is-admin', 'true');
          } else {
            setIsAdmin(false);
            localStorage.setItem('maria-portfolio-is-admin', 'false');
          }
        });

        return () => unsubscribe();
      } catch (e) {
        console.error("Firebase Initialization Failed:", e);
        setIsFirebaseConnected(false);
        setDb(null);
        setAuth(null);
      }
    } else {
      setIsFirebaseConnected(false);
      setDb(null);
      setAuth(null);
    }
  }, [firebaseConfig]);

  // Save changes locally and trigger Firebase sync
  const saveBio = async (newBio) => {
    setBio(newBio);
    localStorage.setItem('maria-portfolio-bio', JSON.stringify(newBio));
    if (isFirebaseConnected && db) {
      try {
        const bioRef = doc(db, 'portfolio', 'bio');
        await setDoc(bioRef, newBio);
      } catch (err) {
        console.error("Firebase sync error for bio:", err);
      }
    }
  };

  const saveProjects = async (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem('maria-portfolio-projects', JSON.stringify(newProjects));
    if (isFirebaseConnected && db) {
      try {
        const projectsRef = doc(db, 'portfolio', 'projects');
        await setDoc(projectsRef, { list: newProjects });
      } catch (err) {
        console.error("Firebase sync error for projects:", err);
      }
    }
  };

  const saveFirebaseConfig = (config) => {
    if (config) {
      setFirebaseConfig(config);
      localStorage.setItem('maria-portfolio-fb-config', JSON.stringify(config));
    } else {
      setFirebaseConfig(null);
      localStorage.removeItem('maria-portfolio-fb-config');
      setIsFirebaseConnected(false);
      setDb(null);
      setAuth(null);
    }
  };

  // CMS Authentication
  const login = async (password, email = '') => {
    setErrorMsg('');
    if (isFirebaseConnected && auth && email) {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
        setIsAdmin(true);
        localStorage.setItem('maria-portfolio-is-admin', 'true');
        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setErrorMsg(err.message);
        return false;
      }
    } else {
      // Local check
      if (password === bio.adminPassword) {
        setIsAdmin(true);
        localStorage.setItem('maria-portfolio-is-admin', 'true');
        return true;
      } else {
        setErrorMsg('Invalid password');
        return false;
      }
    }
  };

  const logout = async () => {
    if (isFirebaseConnected && auth) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    setIsAdmin(false);
    localStorage.setItem('maria-portfolio-is-admin', 'false');
  };

  // Switch theme with fancy ripple coordinate saving
  const selectTheme = (newTheme, clickEvent = null) => {
    if (clickEvent) {
      setThemeRippleTrigger({
        x: clickEvent.clientX,
        y: clickEvent.clientY,
        targetTheme: newTheme
      });
      
      // Delay the actual class change until ripple expands
      setTimeout(() => {
        setTheme(newTheme);
        localStorage.setItem('maria-portfolio-theme', newTheme);
      }, 500);

      // Reset trigger
      setTimeout(() => {
        setThemeRippleTrigger(null);
      }, 1200);
    } else {
      setTheme(newTheme);
      localStorage.setItem('maria-portfolio-theme', newTheme);
    }
  };

  return (
    <PortfolioContext.Provider value={{
      theme,
      selectTheme,
      themeRippleTrigger,
      bio,
      saveBio,
      projects,
      saveProjects,
      activeSection,
      setActiveSection,
      isAdmin,
      login,
      logout,
      firebaseConfig,
      saveFirebaseConfig,
      isFirebaseConnected,
      loading,
      errorMsg
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
