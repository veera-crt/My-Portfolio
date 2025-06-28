// ==================== GLOBAL VARIABLES ====================
let currentTheme = localStorage.getItem("theme") || "light"
let isScrolling = false
let ticking = false

// ==================== THEME MANAGEMENT ====================
function initTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme)
  updateThemeToggle()
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light"
  document.documentElement.setAttribute("data-theme", currentTheme)
  localStorage.setItem("theme", currentTheme)
  updateThemeToggle()

  // Add smooth transition effect
  document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"
  setTimeout(() => {
    document.body.style.transition = ""
  }, 300)
}

function updateThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle")
  if (themeToggle) {
    themeToggle.innerHTML = currentTheme === "light" ? "🌙" : "☀️"
    themeToggle.setAttribute("aria-label", `Switch to ${currentTheme === "light" ? "dark" : "light"} mode`)
  }
}

// ==================== NAVIGATION ====================
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-menu a")

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isActive = navMenu.classList.contains("active")
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
      navToggle.setAttribute("aria-expanded", !isActive)

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? "" : "hidden"
    })
  }

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("active")
      navToggle?.classList.remove("active")
      navToggle?.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar?.contains(e.target) && navMenu?.classList.contains("active")) {
      navMenu.classList.remove("active")
      navToggle?.classList.remove("active")
      navToggle?.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  })

  // Navbar scroll effect - ALWAYS VISIBLE (removed auto-hide functionality)
  function updateNavbar() {
    const currentScrollY = window.scrollY

    if (navbar) {
      if (currentScrollY > 100) {
        navbar.style.background = "var(--bg-overlay)"
        navbar.style.backdropFilter = "blur(20px)"
        navbar.style.boxShadow = "var(--shadow-lg)"
      } else {
        navbar.style.background = "var(--bg-overlay)"
        navbar.style.backdropFilter = "blur(20px)"
        navbar.style.boxShadow = "none"
      }

      // Navigation always stays visible - removed hide/show logic
      navbar.style.transform = "translateY(0)"
    }
  }

  // Throttled scroll listener
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar()
        updateActiveNavLink()
        updateBackToTop()
        ticking = false
      })
      ticking = true
    }
  })
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]')

  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })
}

// ==================== SMOOTH SCROLLING ====================
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const targetId = link.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// ==================== TYPING ANIMATION ====================
function initTypingAnimation() {
  const roleText = document.querySelector(".role-text")
  if (!roleText) return

  const roles = ["Cybersecurity Enthusiast", "Web Designer & Developer", "Full Stack Developer", "Content Creator"]
  let currentRoleIndex = 0
  let currentCharIndex = 0
  let isDeleting = false

  function typeRole() {
    const currentRole = roles[currentRoleIndex]

    if (isDeleting) {
      roleText.textContent = currentRole.substring(0, currentCharIndex - 1)
      currentCharIndex--
    } else {
      roleText.textContent = currentRole.substring(0, currentCharIndex + 1)
      currentCharIndex++
    }

    let typeSpeed = isDeleting ? 50 : 100

    if (!isDeleting && currentCharIndex === currentRole.length) {
      typeSpeed = 2000 // Pause at end
      isDeleting = true
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false
      currentRoleIndex = (currentRoleIndex + 1) % roles.length
      typeSpeed = 500 // Pause before next role
    }

    setTimeout(typeRole, typeSpeed)
  }

  // Start typing animation after a delay
  setTimeout(typeRole, 1000)
}

// ==================== SCROLL ANIMATIONS (AOS-like) ====================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate")

        // Special handling for progress bars
        if (entry.target.classList.contains("progress-fill")) {
          const width = entry.target.getAttribute("data-width")
          setTimeout(() => {
            entry.target.style.width = width + "%"
          }, 200)
        }

        // Special handling for circular progress
        if (entry.target.classList.contains("progress-circle")) {
          const percentage = entry.target.getAttribute("data-percentage")
          const circle = entry.target.querySelector(".circle-progress")
          if (circle) {
            const circumference = 2 * Math.PI * 50 // radius = 50
            const offset = circumference - (percentage / 100) * circumference
            setTimeout(() => {
              circle.style.strokeDashoffset = offset
            }, 200)
          }
        }

        // Special handling for counters
        if (entry.target.classList.contains("stat-number")) {
          animateCounter(entry.target)
        }
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(`
        .hero-content,
        .about-image,
        .about-content,
        .skill-item,
        .category-card,
        .timeline-item,
        .award-card,
        .project-card,
        .blog-card,
        .contact-card,
        .progress-fill,
        .progress-circle,
        .stat-number
    `)

  animatedElements.forEach((el, index) => {
    // Add animation classes based on position
    if (index % 3 === 0) {
      el.classList.add("fade-up")
    } else if (index % 3 === 1) {
      el.classList.add("fade-left")
    } else {
      el.classList.add("fade-right")
    }

    // Add delay for staggered animation
    el.style.animationDelay = `${(index % 4) * 0.1}s`

    observer.observe(el)
  })
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + (element.textContent.includes("+") ? "+" : "")
  }, 16)
}

// ==================== TAB FUNCTIONALITY ====================
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab")

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => {
        btn.classList.remove("active")
        btn.setAttribute("aria-selected", "false")
      })
      tabContents.forEach((content) => {
        content.classList.remove("active")
      })

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      button.setAttribute("aria-selected", "true")

      const targetContent = document.getElementById(targetTab)
      if (targetContent) {
        targetContent.classList.add("active")
      }
    })
  })
}

// ==================== BACK TO TOP BUTTON ====================
function initBackToTop() {
  const backToTopButton = document.getElementById("back-to-top")

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
}

function updateBackToTop() {
  const backToTopButton = document.getElementById("back-to-top")

  if (backToTopButton) {
    if (window.scrollY > 500) {
      backToTopButton.classList.add("visible")
    } else {
      backToTopButton.classList.remove("visible")
    }
  }
}

// ==================== LOADING SCREEN ====================
function initLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen")

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add("hidden")
        setTimeout(() => {
          loadingScreen.style.display = "none"
        }, 500)
      }
    }, 1000)
  })
}

// ==================== PARALLAX EFFECTS ====================
function initParallax() {
  const parallaxElements = document.querySelectorAll(".hero-background, .hire-background")

  function updateParallax() {
    const scrolled = window.pageYOffset

    parallaxElements.forEach((element) => {
      const rate = scrolled * -0.5
      element.style.transform = `translateY(${rate}px)`
    })
  }

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      requestAnimationFrame(updateParallax)
      isScrolling = true
      setTimeout(() => {
        isScrolling = false
      }, 16)
    }
  })
}

// ==================== FORM HANDLING ====================
function initFormHandling() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Add loading state
      const submitButton = form.querySelector('button[type="submit"]')
      if (submitButton) {
        const originalText = submitButton.textContent
        submitButton.textContent = "Sending..."
        submitButton.disabled = true

        // Simulate form submission
        setTimeout(() => {
          submitButton.textContent = "Message Sent!"
          setTimeout(() => {
            submitButton.textContent = originalText
            submitButton.disabled = false
            form.reset()
          }, 2000)
        }, 1500)
      }
    })
  })
}

// ==================== KEYBOARD NAVIGATION ====================
function initKeyboardNavigation() {
  // ESC key to close mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const navMenu = document.querySelector(".nav-menu")
      const navToggle = document.querySelector(".nav-toggle")

      if (navMenu?.classList.contains("active")) {
        navMenu.classList.remove("active")
        navToggle?.classList.remove("active")
        navToggle?.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      }
    }

    // Arrow keys for tab navigation
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const activeTab = document.querySelector(".tab-btn.active")
      if (activeTab) {
        const tabButtons = Array.from(document.querySelectorAll(".tab-btn"))
        const currentIndex = tabButtons.indexOf(activeTab)
        let nextIndex

        if (e.key === "ArrowLeft") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1
        } else {
          nextIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0
        }

        tabButtons[nextIndex].click()
        tabButtons[nextIndex].focus()
      }
    }
  })

  // Focus management for better accessibility
  const focusableElements = document.querySelectorAll(`
        a[href], button, input, textarea, select, 
        [tabindex]:not([tabindex="-1"])
    `)

  focusableElements.forEach((element) => {
    element.addEventListener("focus", () => {
      element.style.outline = "2px solid var(--primary-color)"
      element.style.outlineOffset = "2px"
    })

    element.addEventListener("blur", () => {
      element.style.outline = ""
      element.style.outlineOffset = ""
    })
  })
}

// ==================== PERFORMANCE OPTIMIZATIONS ====================
function initPerformanceOptimizations() {
  // Lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src || img.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  // Only preload actual resources that exist
  const criticalResources = [
    // Add your actual image paths here if needed
  ]

  if (criticalResources.length > 0) {
    criticalResources.forEach((resource) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = resource
      link.as = "image"
      document.head.appendChild(link)
    })
  }
}

// ==================== ERROR HANDLING ====================
function initErrorHandling() {
  // Global error handler
  window.addEventListener("error", (e) => {
    console.error("Global error:", e.error)
    // You could send this to an error reporting service
  })

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason)
    e.preventDefault()
  })

  // Image error handling
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG") {
        e.target.src = "/placeholder.svg?height=300&width=400"
        e.target.alt = "Image failed to load"
      }
    },
    true,
  )
}

// ==================== ANALYTICS & TRACKING ====================
function initAnalytics() {
  // Track page views
  function trackPageView() {
    // Replace with your analytics code
    console.log("Page view tracked")
  }

  // Track user interactions
  function trackEvent(category, action, label) {
    // Replace with your analytics code
    console.log(`Event tracked: ${category} - ${action} - ${label}`)
  }

  // Track button clicks
  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn, .cta-button, .project-link")) {
      const buttonText = e.target.textContent.trim()
      trackEvent("Button", "Click", buttonText)
    }
  })

  // Track section views
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          trackEvent("Section", "View", sectionId)
        }
      })
    },
    { threshold: 0.5 },
  )

  document.querySelectorAll("section[id]").forEach((section) => {
    sectionObserver.observe(section)
  })

  trackPageView()
}

// ==================== GEMINI CHATBOT CLASS ====================
class GeminiChatbot {
  constructor() {
    // IMPORTANT: Replace with your actual Gemini API key
    this.apiKey = "AIzaSyAWyyPQC2Zy9aNSaanONzQi0MNtyiNd3HY"
    this.apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
    this.isOpen = false
    this.isLoading = false
    this.messages = []
    this.hasStarted = false

    this.initElements()
    this.bindEvents()
    this.setupAutoResize()
  }

  initElements() {
    this.trigger = document.getElementById("chat-trigger")
    this.window = document.getElementById("chat-window")
    this.closeBtn = document.getElementById("chat-close")
    this.messagesContainer = document.getElementById("chat-messages")
    this.form = document.getElementById("chat-form")
    this.input = document.getElementById("chat-input")
    this.sendBtn = document.getElementById("chat-send")
    this.welcomeScreen = document.getElementById("welcome-screen")
  }

  bindEvents() {
    this.trigger.addEventListener("click", () => this.toggleChat())
    this.closeBtn.addEventListener("click", () => this.closeChat())
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    this.input.addEventListener("keydown", (e) => this.handleKeyDown(e))

    // Quick questions
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("quick-question")) {
        const question = e.target.getAttribute("data-question")
        this.sendMessage(question)
      }
    })

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.window.contains(e.target) && !this.trigger.contains(e.target)) {
        this.closeChat()
      }
    })
  }

  setupAutoResize() {
    this.input.addEventListener("input", () => {
      this.input.style.height = "auto"
      this.input.style.height = Math.min(this.input.scrollHeight, 80) + "px"
    })
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat()
    } else {
      this.openChat()
    }
  }

  openChat() {
    this.isOpen = true
    this.window.classList.add("active")
    this.trigger.classList.add("active")
    setTimeout(() => this.input.focus(), 300)
  }

  closeChat() {
    this.isOpen = false
    this.window.classList.remove("active")
    this.trigger.classList.remove("active")
  }

  handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      this.form.dispatchEvent(new Event("submit"))
    }
  }

  async handleSubmit(e) {
    e.preventDefault()
    const message = this.input.value.trim()
    if (!message || this.isLoading) return

    await this.sendMessage(message)
  }

  async sendMessage(message) {
    if (this.isLoading) return

    // Hide welcome screen on first interaction
    if (!this.hasStarted) {
      this.welcomeScreen.style.display = "none"
      this.hasStarted = true
    }

    // Add user message
    this.addMessage("user", message)
    this.input.value = ""
    this.input.style.height = "auto"

    // Show typing indicator
    this.showTypingIndicator()
    this.isLoading = true
    this.sendBtn.disabled = true

    try {
      const response = await this.callGeminiAPI(message)
      this.hideTypingIndicator()
      this.addMessage("assistant", response)
    } catch (error) {
      this.hideTypingIndicator()
      this.showError("Sorry, I encountered an error. Please try again.")
      console.error("Chatbot error:", error)
    } finally {
      this.isLoading = false
      this.sendBtn.disabled = false
      this.input.focus()
    }
  }

  async callGeminiAPI(userMessage) {
    const systemPrompt = `You are an AI assistant integrated into Veerapandi's portfolio website. You have comprehensive knowledge about his background, projects, and capabilities.

COMPLETE PORTFOLIO DATA:

PERSONAL INFO:
- Full Name: Veerapandi G
- Date of Birth: January 12, 2006
- Current Status: B.Tech CSE-Cybersecurity Student at SRM University, Chennai
- CGPA: 8.67/10 (Sem 1: 7.818, Sem 2: 8.476, Sem 3: 8.957, Sem 4: 9.350)
- Email: vg2632@srmist.edu.in
- Phone: +91-7868953592
- Location: SRM University, Chennai

TECHNICAL SKILLS:
- Programming: Python (80%), Java (75%), Node.js (70%)
- Databases: MySQL (99%), PostgreSQL (90%)
- Web Development: Frontend (100%), Backend (90%), Full Stack (99%)
- Other Skills: Prompt Engineering (75%), Presentation (100%), Canva (100%), Content Creation (65%)
- Web Design: Expert level with focus on responsive, secure designs

PROJECTS WITH LINKS:
1. Online Voting Platform
   - Description: Secure web application for digital elections with real-time voting, user authentication, and result tracking
   - Technologies: HTML, CSS, JavaScript, Firebase
   - Live Demo: https://veera-crt.github.io/CybVars_Voting/index.html
   - GitHub: https://github.com/veera-crt/CybVars_Voting
   - GitHub: https://github.com/veera-crt/CybVars_Voting
   - Features: Real-time voting, secure authentication, result analytics

2. Password Manager
   - Description: Secure password management tool with AES-256 encryption, user-friendly interface, and
   - Description: Modern cybersecurity-focused platform with clean UI/UX, dark theme, smooth animations
   - Technologies: HTML, CSS, JavaScript, Responsive Design
   - Live Demo: https://veera-crt.github.io/cybvars-frontend/index.html
   - GitHub: https://github.com/veera-crt/cybvars-frontend
   - Features: Modern design, responsive layout, cybersecurity focus

3. Tic-Tac-Tao Game
   - Description: Modern cybersecurity-focused platform with clean UI/UX, dark theme, smooth animations
   - Technologies: HTML, CSS, JavaScript, Responsive Design
   - Live Demo: https://veera-crt.github.io/Tic-Tac-Tao-Game/
   - GitHub: https://github.com/veera-crt/Tic-Tac-Tao-Game
   - Features: Classic game logic, smooth UI, Firebase-based score storage

   4. Alarm App
   - Description:This Alarm App was developed as part of our Computer Architecture project, simulating the behavior of system calls in a real-world alarm system. It allows users to set and manage alarms through an intuitive interface, mimicking low-level scheduling logic using JavaScript for client-side execution.
   - Technologies: HTML, CSS, JavaScript, Responsive Design
   - Live Demo: https://veera-crt.github.io/alarm-app/
   - GitHub: https://github.com/veera-crt/alarm-app
   - Features: Classic game logic, smooth UI, Firebase-based score storage


   5. Alarm App
   - Description:This Alarm App was developed as part of our Computer Architecture project, simulating the behavior of system calls in a real-world alarm system. It allows users to set and manage alarms through an intuitive interface, mimicking low-level scheduling logic using JavaScript for client-side execution.
   - Technologies: HTML, CSS, JavaScript, Responsive Design
   - Live Demo: https://veera-crt.github.io/alarm-app/
   - GitHub: https://github.com/veera-crt/alarm-app
   - Features: Classic game logic, smooth UI, Firebase-based score storage
   


GITHUB PROFILE:
- Main GitHub: https://github.com/veera-crt
- All repositories and code samples available there

BLOG & CONTENT:
1. Full Stack Development Blog: https://veerapandiblog.blogspot.com/search/label/fullstack
2. Python DSA Documentation: https://veerapandiblog.blogspot.com/search/label/Python
3. Tech Opinions Blog: https://veerapandiblog.blogspot.com/search/label/My%20Opinion

PROFESSIONAL EXPERIENCE:
- Full Stack Developer (2025-Present): End-to-end web applications with Python Flask, PostgreSQL, AES-256 encryption
- Web Designer (2024-Present): Clean, responsive, secure website designs
- Digital Marketing (2024-Present): YouTube channel management, SEO optimization
- Content Creator (2020-Present): Multi-platform content strategy

CERTIFICATIONS & ACHIEVEMENTS:
1. Palo Alto Internship (Edukills, ACITE) - 10-week cybersecurity program
   Certificate: https://drive.google.com/file/d/1U33q8y3SLzEZCxRayu-tml9wc3wqlUeu/view?usp=sharing
2. TATA Internship (Forage) - IAM Concepts
   Certificate: https://drive.google.com/file/d/157i0-bzGclulQrz_NcpZiaFMc13D3cbv/view?usp=sharing
3. Java Programming (NPTEL)
   Certificate: https://drive.google.com/file/d/1MxwS0j3LjEBGwQZlAeZiK8Ji0UM8xpxj/view?usp=sharing
4. Information Security (NPTEL)
   Certificate: https://drive.google.com/file/d/1XATbwp2BJNn5hICBajzqX09leQiuVhgu/view?usp=sharing
5. Top 1 Team - SRM University Mechanical Lab Competition
   Certificate: https://drive.google.com/file/d/1y33xsNuuHwhkmiV0J0HKYibYFgV5RFQP/view?usp=sharing

SOCIAL LINKS:
- LinkedIn: https://www.linkedin.com/in/veerapandi-g-342388292/
- GitHub: https://github.com/veera-crt
- WhatsApp: https://wa.me/917868953592
- CV Download: https://drive.google.com/file/d/18TtamWIWgT7nZQFaewtXjK7M6Tk9nHoG/view?usp=sharing

RESPONSE GUIDELINES:
- Be helpful, professional, and engaging
- Don't mention you are Gemini or Google's AI
- Provide specific links when discussing projects or certificates
- For project inquiries, always include both live demo and GitHub links
- Keep responses informative but concise (max 150 words)
- Encourage visitors to explore the projects and connect
- If asked about code, direct them to the GitHub repositories
- For contact, provide multiple options (email, phone, LinkedIn, WhatsApp)

SAMPLE RESPONSES:
- For projects: "Veerapandi has built [project name]. You can see it live at [demo link] and explore the code at [github link]"
- For contact: "You can reach him via email at vg2632@srmist.edu.in, phone +91-7868953592, or connect on LinkedIn/WhatsApp"
- For skills: Reference specific percentages and provide context about his expertise level`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nUser: ${userMessage}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    }

    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error("Invalid response format")
    }
  }

  addMessage(role, content) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `chat-message ${role}`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = role === "user" ? "👤" : "🤖"

    const bubble = document.createElement("div")
    bubble.className = "message-bubble"
    bubble.textContent = content

    const time = document.createElement("div")
    time.className = "message-time"
    time.textContent = this.formatTime(new Date())

    bubble.appendChild(time)
    messageDiv.appendChild(avatar)
    messageDiv.appendChild(bubble)

    this.messagesContainer.appendChild(messageDiv)
    this.scrollToBottom()

    this.messages.push({ role, content, timestamp: new Date() })
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "chat-message assistant"
    typingDiv.id = "typing-indicator"

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = "🤖"

    const indicator = document.createElement("div")
    indicator.className = "typing-indicator"
    indicator.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
            <span style="font-size: 0.7rem; color: var(--text-muted);">Thinking...</span>
        `

    typingDiv.appendChild(avatar)
    typingDiv.appendChild(indicator)
    this.messagesContainer.appendChild(typingDiv)
    this.scrollToBottom()
  }

  hideTypingIndicator() {
    const indicator = document.getElementById("typing-indicator")
    if (indicator) {
      indicator.remove()
    }
  }

  showError(message) {
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`
    this.messagesContainer.appendChild(errorDiv)
    this.scrollToBottom()

    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove()
      }
    }, 5000)
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
    }, 100)
  }

  formatTime(date) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }
}

// ==================== INITIALIZATION ====================
function init() {
  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
    return
  }

  try {
    // Initialize all existing modules
    initTheme()
    initNavigation()
    initSmoothScrolling()
    initTypingAnimation()
    initScrollAnimations()
    initTabs()
    initBackToTop()
    initLoadingScreen()
    initParallax()
    initFormHandling()
    initKeyboardNavigation()
    initPerformanceOptimizations()
    initErrorHandling()
    initAnalytics()
    initEasterEggs()

    // Initialize Gemini Chatbot
    new GeminiChatbot()

    // Create and add theme toggle button
    const themeToggle = document.createElement("button")
    themeToggle.className = "theme-toggle"
    themeToggle.setAttribute("aria-label", "Toggle theme")
    themeToggle.addEventListener("click", toggleTheme)
    document.body.appendChild(themeToggle)

    // Update current year in footer
    const yearElement = document.getElementById("current-year")
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear()
    }

    console.log("🚀 Portfolio with AI Chat initialized successfully!")
  } catch (error) {
    console.error("Error initializing portfolio:", error)
  }
}

// ==================== START APPLICATION ====================
init()

// Add utility functions for external access
window.ChatAPI = {
  open: () => {
    const trigger = document.getElementById("chat-trigger")
    if (trigger && !trigger.classList.contains("active")) {
      trigger.click()
    }
  },
  close: () => {
    const close = document.getElementById("chat-close")
    if (close) {
      close.click()
    }
  },
}

// ==================== UTILITY FUNCTIONS ====================
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

function getRandomColor() {
  const colors = ["var(--primary-color)", "var(--secondary-color)", "var(--accent-color)"]
  return colors[Math.floor(Math.random() * colors.length)]
}

// ==================== EASTER EGGS ====================
function initEasterEggs() {
  // Konami code easter egg
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]
  let konamiIndex = 0

  document.addEventListener("keydown", (e) => {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++
      if (konamiIndex === konamiCode.length) {
        // Easter egg activated!
        document.body.style.animation = "rainbow 2s infinite"
        setTimeout(() => {
          document.body.style.animation = ""
        }, 5000)
        konamiIndex = 0
      }
    } else {
      konamiIndex = 0
    }
  })

  // Add rainbow animation
  const style = document.createElement("style")
  style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `
  document.head.appendChild(style)
}
