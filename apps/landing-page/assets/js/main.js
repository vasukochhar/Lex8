document.addEventListener("DOMContentLoaded", () => {
  // --- Background Mesh Parallax ---
  const bgMesh = document.querySelector(".bg-mesh");
  if (bgMesh) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      bgMesh.style.transform = `translateY(${scrollY * 0.15}px)`;
    });
  }

  // --- Sticky Header Scrolled State ---
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // --- Intersection Observer for Scroll Reveals ---
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // If the element has a custom stagger container
        if (entry.target.classList.contains("stagger-reveal")) {
          const children = entry.target.querySelectorAll(".reveal-child");
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("active");
            }, index * 60);
          });
        }
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Hero Infinite Ticker Cloner ---
  const ticker = document.querySelector(".ticker");
  if (ticker) {
    const items = Array.from(ticker.children);
    // Duplicate items to ensure seamless infinite loop
    items.forEach(item => {
      const clone = item.cloneNode(true);
      ticker.appendChild(clone);
    });
  }

  // --- Tribunal Sequential Reveal ---
  const tribunalSection = document.getElementById("tribunal-trigger");
  if (tribunalSection) {
    const jurorCards = tribunalSection.querySelectorAll(".juror-card");
    const verdictStamp = tribunalSection.querySelector(".verdict-stamp");
    
    const tribunalObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Sequentially reveal juror cards
          jurorCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-in");
            }, index * 400); // 400ms stagger between jurors
          });

          // Pop stamp after all jurors are revealed
          const stampDelay = jurorCards.length * 400 + 400;
          setTimeout(() => {
            if (verdictStamp) {
              verdictStamp.classList.add("stamp-active");
            }
          }, stampDelay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    
    tribunalObserver.observe(tribunalSection);
  }

  // --- Terminal Typewriter Logic ---
  const terminalElement = document.getElementById("terminal-trigger");
  if (terminalElement) {
    const terminalConsole = terminalElement.querySelector(".terminal-body");
    const LOG_LINES = [
      "[2026-05-19 14:30:13] AGENT: DID:eth:0x8F9a... REQUESTING CONTRACT EVALUATION [REF: 0928]",
      "[2026-05-19 14:30:14] AGENT: PARSING PENDING DISCLOSURE PARAGRAPHS... PRIVILEGE SUSPICION RAISED",
      "[2026-05-19 14:30:15] MONITOR: CHECKING PRIVILEGE INTERCEPT MATRIX (LANE 2)",
      "[2026-05-19 14:30:15] MONITOR: DETECTED INTERNAL MEMO REFERENCING TRADE SECRETS SEC_5.1a",
      "[2026-05-19 14:30:16] TRIBUNAL: SENT TO COURT JURORS. GEMINI: BLOCKED | CLAUDE: BLOCKED | DEEPSEEK: BLOCKED",
      "[2026-05-19 14:30:16] TRIBUNAL: FINAL DECISION -> BLOCKED_PRIVILEGE_LEAK (RISK: 0.89)",
      "[2026-05-19 14:35:00] HUMAN_REVIEWER: J.Doe | OVERRIDE: FALSE | RECORD HASH: e3b0c442...",
      "[2026-05-19 14:35:01] SYSTEM: SECURE BLOCK COMMIT COMPLETED. LEDGER UPDATED."
    ];

    const terminalObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Clear default visual lines
          terminalConsole.innerHTML = "";
          typeLines(LOG_LINES, 0, terminalConsole);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    terminalObserver.observe(terminalElement);
  }

  function typeLines(lines, lineIndex, container) {
    if (lineIndex >= lines.length) {
      // Append final blinking cursor at the end
      const cursorSpan = document.createElement("span");
      cursorSpan.className = "terminal-cursor";
      container.appendChild(cursorSpan);
      return;
    }

    const lineDiv = document.createElement("div");
    lineDiv.className = "terminal-line font-mono";
    container.appendChild(lineDiv);

    let charIndex = 0;
    const text = lines[lineIndex];

    function typeChar() {
      if (charIndex < text.length) {
        lineDiv.textContent += text[charIndex];
        charIndex++;
        container.scrollTop = container.scrollHeight;
        setTimeout(typeChar, 12); // Speed of character typing
      } else {
        // Move to next line after a short pause
        setTimeout(() => {
          typeLines(lines, lineIndex + 1, container);
        }, 250); // Pause between lines
      }
    }

    typeChar();
  }

  // --- SVG Pipeline Drawing Animation ---
  const securityDiagram = document.querySelector(".flowchart-svg");
  if (securityDiagram) {
    const svgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const paths = entry.target.querySelectorAll(".drawing-path");
          paths.forEach((path) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            // Force reflow
            path.getBoundingClientRect();
            path.style.transition = "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)";
            path.style.strokeDashoffset = "0";
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    svgObserver.observe(securityDiagram);
  }

  // --- Accordion Logic ---
  const accordions = document.querySelectorAll(".accordion-item");
  accordions.forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    const content = item.querySelector(".accordion-content");
    
    if (trigger && content) {
      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        
        // Close all other accordions (optional, but clean for enterprise UI)
        accordions.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            otherItem.querySelector(".accordion-content").style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove("active");
          content.style.maxHeight = null;
        } else {
          item.classList.add("active");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  });

  // --- Product Tab Transition logic ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");
      
      // Update buttons
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Transition panels
      tabPanels.forEach(panel => {
        if (panel.classList.contains("active")) {
          // Fade out current panel
          panel.style.opacity = "0";
          panel.style.transform = "translateX(15px)";
          setTimeout(() => {
            panel.classList.remove("active");
            // Show new panel
            activatePanel(targetId);
          }, 300);
        }
      });
    });
  });

  function activatePanel(id) {
    const targetPanel = document.getElementById(id);
    if (targetPanel) {
      targetPanel.classList.add("active");
      // Force layout calculation
      targetPanel.getBoundingClientRect();
      targetPanel.style.opacity = "1";
      targetPanel.style.transform = "translateX(0)";
    }
  }

  // Handle page load with nav links stagger fade-in
  const navItems = document.querySelectorAll(".nav-links li, .nav-cta .btn");
  navItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(-10px)";
    item.style.transition = "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, 150 + index * 60);
  });
});
