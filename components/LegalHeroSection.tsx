"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#stky-root" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = rightRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const LOGOS = [
      {
        svg: `<svg width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="nonzero" clip-rule="nonzero" d="M4.84989 2.37195C4.59895 2.51683 4.33488 2.91636 4.30424 3.78785C4.28968 4.20181 3.9423 4.52559 3.52835 4.51103C3.11439 4.49647 2.79061 4.1491 2.80516 3.73514C2.84273 2.66673 3.1806 1.60366 4.09989 1.07291C5.02179 0.540653 6.11484 0.782356 7.06128 1.28727C7.42674 1.48224 7.56495 1.93656 7.36998 2.30201C7.17501 2.66747 6.72069 2.80568 6.35524 2.61072C5.5818 2.1981 5.10158 2.22663 4.84989 2.37195ZM8.87139 3.67284C9.19036 3.40858 9.66315 3.45293 9.92741 3.7719C10.4818 4.44103 11.0136 5.20405 11.4963 6.04018C12.5366 7.84191 13.178 9.68785 13.3509 11.2362C13.4372 12.0091 13.4108 12.7446 13.2303 13.3754C13.0484 14.011 12.6941 14.5863 12.0999 14.9293C11.381 15.3444 10.5509 15.2855 9.79114 15.0089C9.02868 14.7313 8.24395 14.2056 7.49586 13.5228C7.18993 13.2435 7.16831 12.7691 7.44756 12.4632C7.72681 12.1573 8.20119 12.1356 8.50712 12.4149C9.16624 13.0165 9.78567 13.4105 10.3043 13.5994C10.8257 13.7892 11.1537 13.7436 11.3499 13.6303C11.5143 13.5354 11.6797 13.342 11.7882 12.9627C11.8981 12.5787 11.9328 12.0529 11.8602 11.4026C11.7152 10.1045 11.1591 8.45607 10.1973 6.79018C9.75492 6.02396 9.27081 5.33055 8.77232 4.72886C8.50807 4.40989 8.55242 3.93709 8.87139 3.67284Z" fill="#000000"/>
        <path fill-rule="nonzero" clip-rule="nonzero" d="M14.5 8.20557C14.5 7.91581 14.286 7.48735 13.5466 7.02507C13.1954 6.80549 13.0887 6.34276 13.3083 5.99154C13.5279 5.64032 13.9906 5.53361 14.3418 5.75319C15.2483 6.31993 16 7.14407 16 8.20557C16 9.27009 15.2442 10.0958 14.3337 10.663C13.9821 10.882 13.5195 10.7746 13.3005 10.423C13.0815 10.0714 13.189 9.60887 13.5405 9.38985C14.2846 8.92635 14.5 8.4962 14.5 8.20557ZM11.3626 11.0378C11.432 11.4462 11.1572 11.8335 10.7488 11.9029C9.89219 12.0484 8.96547 12.1274 8 12.1274C5.91954 12.1274 4.00018 11.76 2.57286 11.1355C1.86032 10.8238 1.23659 10.4332 0.780529 9.9615C0.320977 9.48616 0 8.89166 0 8.20557C0 7.37549 0.466082 6.68599 1.08548 6.16636C1.70712 5.64485 2.55471 5.22808 3.52013 4.92164C3.91494 4.79633 4.33657 5.01479 4.46189 5.40959C4.5872 5.80439 4.36874 6.22603 3.97394 6.35135C3.12334 6.62134 2.4724 6.96078 2.04954 7.31553C1.62442 7.67217 1.5 7.97899 1.5 8.20557C1.5 8.39536 1.58476 8.6353 1.85895 8.91891C2.13663 9.20613 2.57464 9.49905 3.17409 9.76131C4.37076 10.2848 6.07639 10.6274 8 10.6274C8.88475 10.6274 9.72732 10.5549 10.4976 10.424C10.906 10.3547 11.2933 10.6295 11.3626 11.0378Z" fill="#000000"/>
        <path fill-rule="nonzero" clip-rule="nonzero" d="M4.87192 13.6303C5.12286 13.7752 5.6009 13.8041 6.37095 13.3949C6.73673 13.2005 7.19082 13.3395 7.38519 13.7052C7.57957 14.071 7.44062 14.5251 7.07484 14.7195C6.13079 15.2211 5.04121 15.4601 4.12192 14.9293C3.20003 14.3971 2.86282 13.3296 2.82687 12.2575C2.81299 11.8435 3.13733 11.4967 3.55131 11.4828C3.96529 11.4689 4.31215 11.7932 4.32603 12.2072C4.35541 13.0834 4.62023 13.485 4.87192 13.6303ZM3.98778 9.49712C3.59944 9.35301 3.40145 8.92138 3.54556 8.53304C3.84786 7.71839 4.24274 6.8763 4.72548 6.04018C5.76571 4.23845 7.04361 2.75996 8.29806 1.83609C8.92431 1.37487 9.57441 1.02999 10.211 0.870901C10.8524 0.71059 11.5278 0.729863 12.1219 1.07291C12.8408 1.48795 13.2049 2.23634 13.3452 3.03257C13.486 3.83168 13.4232 4.77409 13.2058 5.7634C13.1169 6.16796 12.7169 6.42388 12.3124 6.33501C11.9078 6.24613 11.6519 5.84612 11.7408 5.44155C11.9322 4.56992 11.9637 3.83647 11.868 3.29288C11.7717 2.7464 11.5681 2.48524 11.3719 2.37195C11.2076 2.27705 10.9574 2.23049 10.5747 2.32614C10.1871 2.42301 9.71442 2.65588 9.18757 3.04388C8.13584 3.81846 6.98632 5.12428 6.02452 6.79018C5.58214 7.55639 5.22369 8.32235 4.95185 9.0549C4.80774 9.44323 4.37611 9.64122 3.98778 9.49712Z" fill="#000000"/>
        <path d="M9.45925 8.06618C9.45925 8.81694 8.85063 9.42556 8.09987 9.42556C7.34911 9.42556 6.7405 8.81694 6.7405 8.06618C6.7405 7.31542 7.34911 6.70681 8.09987 6.70681C8.85063 6.70681 9.45925 7.31542 9.45925 8.06618Z" fill="#000000"/>
        </svg>`,
        scale: 2.8,
      },
      {
        svg: `<svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none"><title>file_type_vite</title><path d="M29.8836 6.146L16.7418 29.6457c-.2714.4851-.9684.488-1.2439.0052L2.0956 6.1482c-.3-.5262.1498-1.1635.746-1.057l13.156 2.3516a.7144.7144 0 00.2537-.0004l12.8808-2.3478c.5942-.1083 1.0463.5241.7515 1.0513z" fill="url(#paint0_linear)"/><path d="M22.2644 2.0069l-9.7253 1.9056a.3571.3571 0 00-.2879.3294l-.5982 10.1038c-.014.238.2045.4227.4367.3691l2.7077-.6248c.2534-.0585.4823.1647.4302.4194l-.8044 3.9393c-.0542.265.1947.4918.4536.4132l1.6724-.5082c.2593-.0787.5084.1487.4536.414l-1.2784 6.1877c-.08.387.4348.598.6495.2662L16.5173 25 24.442 9.1848c.1327-.2648-.096-.5667-.387-.5106l-2.787.5379c-.262.0505-.4848-.1934-.4109-.4497l1.8191-6.306c.074-.2568-.1496-.5009-.4118-.4495z" fill="url(#paint1_linear)"/><defs id="defs50"><linearGradient id="paint0_linear" x1="6.0002" y1="32.9999" x2="235" y2="344" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.07142 0 0 .07142 1.3398 1.8944)"><stop stop-color="#41D1FF" id="stop38"/><stop offset="1" stop-color="#BD34FE" id="stop40"/></linearGradient><linearGradient id="paint1_linear" x1="194.651" y1="8.8182" x2="236.076" y2="292.989" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.07142 0 0 .07142 1.3398 1.8944)"><stop stop-color="#FFEA83" id="stop43"/><stop offset=".0833" stop-color="#FFDD35" id="stop45"/><stop offset="1" stop-color="#FFA800" id="stop47"/></linearGradient></defs></svg>`,
        scale: 2.8,
      },
      {
        svg: `<svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.749 30.005c-0.119 0.063-0.109 0.083 0.005 0.025 0.037-0.015 0.068-0.036 0.095-0.061 0-0.021 0-0.021-0.1 0.036zM23.989 29.875c-0.057 0.047-0.057 0.047 0.011 0.016 0.036-0.021 0.068-0.041 0.068-0.047 0-0.027-0.016-0.021-0.079 0.031zM24.145 29.781c-0.057 0.047-0.057 0.047 0.011 0.016 0.037-0.021 0.068-0.043 0.068-0.048 0-0.025-0.016-0.020-0.079 0.032zM24.303 29.688c-0.057 0.047-0.057 0.047 0.009 0.015 0.037-0.020 0.068-0.041 0.068-0.047 0-0.025-0.016-0.020-0.077 0.032zM24.516 29.547c-0.109 0.073-0.147 0.12-0.047 0.068 0.067-0.041 0.181-0.131 0.161-0.131-0.043 0.016-0.079 0.043-0.115 0.063zM14.953 0.011c-0.073 0.005-0.292 0.025-0.484 0.041-4.548 0.412-8.803 2.86-11.5 6.631-1.491 2.067-2.459 4.468-2.824 6.989-0.129 0.88-0.145 1.14-0.145 2.333 0 1.192 0.016 1.448 0.145 2.328 0.871 6.011 5.147 11.057 10.943 12.927 1.043 0.333 2.136 0.563 3.381 0.704 0.484 0.052 2.577 0.052 3.061 0 2.152-0.24 3.969-0.771 5.767-1.688 0.276-0.14 0.328-0.177 0.291-0.208-0.88-1.161-1.744-2.323-2.609-3.495l-2.557-3.453-3.203-4.745c-1.068-1.588-2.14-3.172-3.229-4.744-0.011 0-0.025 2.109-0.031 4.681-0.011 4.505-0.011 4.688-0.068 4.792-0.057 0.125-0.151 0.229-0.276 0.287-0.099 0.047-0.188 0.057-0.661 0.057h-0.541l-0.141-0.088c-0.088-0.057-0.161-0.136-0.208-0.229l-0.068-0.141 0.005-6.271 0.011-6.271 0.099-0.125c0.063-0.077 0.141-0.14 0.229-0.187 0.131-0.063 0.183-0.073 0.724-0.073 0.635 0 0.74 0.025 0.907 0.208 1.296 1.932 2.588 3.869 3.859 5.812 2.079 3.152 4.917 7.453 6.312 9.563l2.537 3.839 0.125-0.083c1.219-0.813 2.328-1.781 3.285-2.885 2.016-2.308 3.324-5.147 3.767-8.177 0.129-0.88 0.145-1.141 0.145-2.333 0-1.193-0.016-1.448-0.145-2.328-0.871-6.011-5.147-11.057-10.943-12.928-1.084-0.343-2.199-0.577-3.328-0.697-0.303-0.031-2.371-0.068-2.631-0.041zM21.5 9.688c0.151 0.072 0.265 0.208 0.317 0.364 0.027 0.084 0.032 1.823 0.027 5.74l-0.011 5.624-0.989-1.52-0.995-1.521v-4.083c0-2.647 0.011-4.131 0.025-4.204 0.047-0.167 0.161-0.307 0.313-0.395 0.124-0.063 0.172-0.068 0.667-0.068 0.463 0 0.541 0.005 0.645 0.063z"/>
        </svg>`,
        scale: 2.8,
      },
      {
        svg: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3H9C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9M12 3V9M12 3H15C16.6569 3 18 4.34315 18 6C18 7.65685 16.6569 9 15 9M12 9H9M12 9H15M12 9V15M9 9C7.34315 9 6 10.3431 6 12C6 13.6569 7.34315 15 9 15M15 9C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15C13.3431 15 12 13.6569 12 12C12 10.3431 13.3431 9 15 9ZM12 15H9M12 15V18C12 19.6569 10.6569 21 9 21C7.34315 21 6 19.6569 6 18C6 16.3431 7.34315 15 9 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        scale: 2.8,
      },
      {
        svg: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15.5V22.5L5 15.5M5 15.5V8.5H12M5 15.5H19L12 8.5M12 8.5H19V1.5H5L12 8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        scale: 2.8,
      },
      {
        svg: `<svg width="800px" height="800px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    
    <title>github [#142]</title>
    <desc>Created with Sketch.</desc>
    <defs>

</defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#000000">
            <g id="icons" transform="translate(56.000000, 160.000000)">
                <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]">

</path>
            </g>
        </g>
    </g>
</svg>`,
        scale: 2.8,
      },
      {
        svg: `<svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.036c-2.667 0-4.333 1.325-5 3.976 1-1.325 2.167-1.822 3.5-1.491.761.189 1.305.738 1.906 1.345C13.387 10.855 14.522 12 17 12c2.667 0 4.333-1.325 5-3.976-1 1.325-2.166 1.822-3.5 1.491-.761-.189-1.305-.738-1.907-1.345-.98-.99-2.114-2.134-4.593-2.134zM7 12c-2.667 0-4.333 1.325-5 3.976 1-1.326 2.167-1.822 3.5-1.491.761.189 1.305.738 1.907 1.345.98.989 2.115 2.134 4.594 2.134 2.667 0 4.333-1.325 5-3.976-1 1.325-2.167 1.822-3.5 1.491-.761-.189-1.305-.738-1.906-1.345C10.613 13.145 9.478 12 7 12z"/></svg>`,
        scale: 2.8,
      },
    ];
    let currentWordIndex = 0;
    let targetPoints: { x: number; y: number }[] = [];

    const particles: Mote[] = [];
    const getTargetCount = () => targetPoints.length;

    let baseRadius = 0;
    let centerX = 0;
    let centerY = 0;

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
    };

    const colors = [
      "0, 89, 255", // Vivid Accent Blue
      "59, 130, 246", // Mid Blue
      "167, 243, 208", // Soft Emerald Mint
      "96, 165, 250", // Sky Highlights
      "226, 232, 240", // Pale Dust
      "74, 39, 119", // Deep Indigo Glow (new)
    ];

    const getPointsFromSVG = (svg: string, scale: number) => {
      const size = 220;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d")!;

      const img = new Image();

      return new Promise<{ x: number; y: number }[]>((resolve) => {
        img.onload = () => {
          ctx.clearRect(0, 0, size, size);

          ctx.drawImage(img, 0, 0, size, size);

          const data = ctx.getImageData(0, 0, size, size).data;

          const pts = [];

          for (let y = 0; y < size; y += 2) {
            for (let x = 0; x < size; x += 2) {
              const alpha = data[(y * size + x) * 4 + 3];

              if (alpha > 20) {
                pts.push({
                  x: (x - size / 2) * scale * (size / 300) + width / 2,
                  y: (y - size / 2) * scale * (size / 300) + height / 2,
                });
              }
            }
          }

          resolve(pts);
        };

        img.src = "data:image/svg+xml;base64," + btoa(svg);
      });
    };

    class Mote {
      // --- Reworked properties for target-based movement ---
      x: number;
      y: number;
      vx = 0;
      vy = 0;
      targetX: number;
      targetY: number;
      // --- End reworked properties ---

      size: number;
      color: string;
      alpha: number;

      constructor() {
        // Start particles at a random position
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.targetX = this.x;
        this.targetY = this.y;

        this.size = Math.random() * 1.2 + 0.7;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.35;
      }

      update() {
        // --- New spring-based animation logic ---
        const spring = 0.03; // How strongly particles are pulled to their target
        const friction = 0.85; // Damping to prevent overshooting

        let targetX = this.targetX;
        let targetY = this.targetY;

        // Mouse interaction: push particles away
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          const hoverRadius = 110;
          if (dist < hoverRadius) {
            const force = (hoverRadius - dist) / hoverRadius;
            const pushX = (dx / dist) * force * 40; // Increased push force
            const pushY = (dy / dist) * force * 40;
            targetX += pushX;
            targetY += pushY;
          }
        }

        // Move towards the target (either the text point or pushed-away point)
        this.vx += (targetX - this.x) * spring;
        this.vy += (targetY - this.y) * spring;
        this.vx *= friction;
        this.vy *= friction;
        this.x += this.vx;
        this.y += this.vy;
        // --- End new animation logic ---
      }

      // No longer need edgeFade

      draw(context: CanvasRenderingContext2D) {
        const a = this.alpha;
        if (a <= 0.008) return;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color}, ${a})`;
        context.fill();
      }
    }

    const assignTargets = () => {
      const shuffledPoints = [...targetPoints].sort(() => 0.5 - Math.random());
      for (let i = 0; i < particles.length; i++) {
        if (i < shuffledPoints.length) {
          particles[i].targetX = shuffledPoints[i].x;
          particles[i].targetY = shuffledPoints[i].y;
          particles[i].alpha = Math.random() * 0.5 + 0.35; // Make visible
        } else {
          // Hide extra particles if the new shape is smaller
          particles[i].targetX = centerX;
          particles[i].targetY = centerY;
          particles[i].alpha = 0;
        }
      }
    };

    const populate = async () => {
      const logo = LOGOS[currentWordIndex];
      targetPoints = await getPointsFromSVG(logo.svg, logo.scale);
      const numParticles = Math.max(particles.length, getTargetCount());
      while (particles.length < numParticles) particles.push(new Mote());
      particles.length = numParticles; // Trim if needed
      assignTargets();
    };

    const setCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      width = rect.width;
      height = rect.height;
      centerX = width / 2;
      centerY = height / 2;
      baseRadius = Math.min(width, height) * 0.46;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
    };

    const ro = new ResizeObserver(() => setCanvasSize());
    ro.observe(container);

    // --- New logic for word transitions ---
    const transitionInterval = setInterval(async () => {
      currentWordIndex = (currentWordIndex + 1) % LOGOS.length;
      const logo = LOGOS[currentWordIndex];
      targetPoints = await getPointsFromSVG(logo.svg, logo.scale);
      assignTargets();
    }, 4000); // Change word every 4 seconds
    // --- End new logic ---

    const render = () => {
      if (width && height) {
        ctx.clearRect(0, 0, width, height);
        mouse.x += (mouse.targetX - mouse.x) * 0.2;
        mouse.y += (mouse.targetY - mouse.y) * 0.2;

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw(ctx);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    container.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(transitionInterval);
      ro.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .hero-root {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'Inter', sans-serif;
        }

        .hero-root * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Particle canvas confined to the hero-right column, sitting
           behind the floating cards (z-index 20) but above the base layer */
        .hero-global-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
          will-change: transform, opacity;
        }

        .hero-glow-a {
          width: 600px;
          height: 600px;
          right: -5%;
          top: -5%;
          background: radial-gradient(circle, var(--color-accent-mid) 0%, transparent 70%);
          animation: hero-glow-drift-a 14s ease-in-out infinite;
        }

        .hero-glow-b {
          width: 500px;
          height: 500px;
          left: -5%;
          bottom: -10%;
          background: radial-gradient(circle, var(--color-accent-soft-strong) 0%, transparent 70%);
          animation: hero-glow-drift-b 18s ease-in-out infinite;
        }

        @keyframes hero-glow-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-40px, 40px) scale(1.15); }
        }

        @keyframes hero-glow-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, -30px) scale(1.1); }
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 6%;
          position: relative;
          z-index: 10;
          border-bottom: 0.5px solid var(--color-border);
          flex-shrink: 0;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .hero-nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-nav-logomark {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, var(--color-accent), var(--color-bg-elevated));
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 800;
          color: var(--color-text);
          letter-spacing: -0.5px;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px var(--color-border);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .hero-nav-logo:hover .hero-nav-logomark {
          box-shadow: 0 0 20px 0 var(--color-accent-mid);
          transform: translateY(-1px) rotate(-4deg);
        }

        .hero-nav-logotext {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text);
          letter-spacing: 0.01em;
        }

        .hero-nav-links {
          display: flex;
          gap: 4px;
        }

        .hero-nav-link {
          font-size: 13px;
          color: var(--color-text-muted);
          padding: 6px 14px;
          border-radius: 7px;
          cursor: pointer;
          border: none;
          background: transparent;
          font-family: inherit;
          position: relative;
          transition: color 0.25s ease, background 0.25s ease;
          text-decoration: none;
        }

        .hero-nav-link::after {
          content: "";
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 3px;
          height: 1px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }

        .hero-nav-link:hover {
          color: var(--color-text);
          background: var(--color-accent-soft);
        }

        .hero-nav-link:hover::after {
          transform: scaleX(1);
        }

        .hero-nav-cta {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          background: var(--color-accent);
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: box-shadow 0.25s ease, transform 0.2s ease, filter 0.25s ease;
        }

        .hero-nav-cta:hover {
          box-shadow: 0 6px 24px -6px var(--color-accent-mid);
          transform: translateY(-1px);
          filter: brightness(1.1);
        }

        /* ── Core layout setup ── */
        .hero-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 6%;
          position: relative;
          z-index: 5;
          gap: 40px;
          padding-bottom: 0px;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 22px;
          max-width: 520px;
          flex: 1.1;
          position: relative;
          z-index: 5;
        }

        .hero-eyebrow-dot {
          width: 6px;
          height: 6px;
          background: var(--color-accent);
          border-radius: 50%;
          animation: hero-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--color-accent);
        }

        .section-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-eyebrow-text {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        @keyframes hero-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.75); }
        }

        .hero-headline {
          font-size: clamp(34px, 4.6vw, 56px);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.03em;
          color: var(--color-text);
        }

        .section-title-accent {
          background: linear-gradient(135deg, var(--color-accent) 0%, #a7f3d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-sub {
          font-size: clamp(13px, 1.1vw, 14.5px);
          color: var(--color-text-muted);
          line-height: 1.65;
          max-width: 450px;
        }

        .hero-stats {
          display: flex;
          gap: 28px;
          padding-top: 16px;
          border-top: 0.5px solid var(--color-border);
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hero-stat-num {
          font-size: 22px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.04em;
        }

        .hero-stat-lbl {
          font-size: 10px;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .hero-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          background: var(--color-accent);
          color: var(--color-text);
          font-size: 13px;
          font-weight: 600;
          padding: 11px 26px;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          font-family: inherit;
          transition: box-shadow 0.25s ease, transform 0.2s ease;
        }

        .hero-btn-primary:hover {
          box-shadow: 0 8px 28px -8px var(--color-accent-mid);
          transform: translateY(-2px);
        }

        .hero-btn-secondary {
          background: transparent;
          color: var(--color-text);
          font-size: 13px;
          font-weight: 500;
          padding: 11px 26px;
          border: 0.5px solid var(--color-border);
          border-radius: 9px;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.2s ease;
        }

        .hero-btn-secondary:hover {
          border-color: var(--color-accent);
          background: var(--color-accent-soft);
          transform: translateY(-2px);
        }

        .hero-skills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .hero-skill-tag {
          background: var(--color-bg-elevated);
          border: 0.5px solid var(--color-border);
          border-radius: 7px;
          padding: 5px 13px;
          font-size: 11px;
          color: var(--color-text);
          font-weight: 500;
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .hero-skill-tag:hover {
          background: var(--color-accent-soft-strong);
          border-color: var(--color-accent);
        }

        /* ── Right setup configuration ── */
        .hero-right {
          flex: 1.15;
          display: flex;
          align-items: end;
          justify-content: center;
          position: relative;
          height: 100%;
          min-height: 460px;
          max-width: 640px;
          z-index: 5;
        }

        .hero-model-slot {
          width: 100%;
          height: 640px;
          position: relative;
          z-index: 2;
        }

        .hero-image-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-badge-served {
          position: absolute;
          top: 15%;
          right: -5%;
          background: linear-gradient(270deg, #0059FF 0%, #041A53 100%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 0.5px solid var(--color-border);
          border-radius: 16px;
          padding: 12px 16px;
          z-index: 20;
          animation: hero-float-a 4.5s ease-in-out infinite;
        }

        @keyframes hero-float-a {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }

        .hero-badge-number {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
        }

        .hero-badge-label {
          font-size: 11px;
          color: #cbd5e1;
          line-height: 1.4;
        }

        .hero-badge-review {
          position: absolute;
          bottom: 12%;
          left: -10%;
          background: linear-gradient(270deg, #0059FF 0%, #041A53 100%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 0.5px solid var(--color-border);
          border-radius: 16px;
          padding: 14px;
          width: 210px;
          z-index: 20;
          animation: hero-float-b 5.5s ease-in-out infinite;
        }

        @keyframes hero-float-b {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(8px); }
        }

        .hero-review-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .hero-review-av {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }

        .hero-review-name {
          font-size: 11px;
          font-weight: 600;
          color: #fff;
        }

        .hero-review-role {
          font-size: 9px;
          color: #cbd5e1;
        }

        .hero-review-stars {
          margin-bottom: 4px;
          font-size: 10px;
        }

        .hero-review-text {
          font-size: 11px;
          color: #cbd5e1;
          line-height: 1.4;
          font-style: italic;
        }

        /* ── Responsive logic adjustments ── */
        @media (max-width: 1024px) {
          .hero-body { gap: 30px; }
          .hero-badge-served { right: 0%; }
          .hero-badge-review { left: 0%; }
        }

        @media (max-width: 768px) {
          .hero-nav-links { display: none; }
          .hero-body {
            flex-direction: column;
            padding-top: 40px;
            align-items: flex-start;
            gap: 48px;
          }
          .hero-left { max-width: 100%; }
          .hero-right {
            width: 100%;
            max-width: 100%;
            height: 420px;
          }
          .hero-model-slot { height: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-eyebrow-dot, .hero-badge-served, .hero-badge-review, .hero-glow-a, .hero-glow-b {
            animation: none !important;
          }
          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        ref={rootRef}
        className="hero-root section-root global-layout-grid"
        id="home"
      >
        <div className="hero-glow hero-glow-a" aria-hidden="true" />
        <div className="hero-glow hero-glow-b" aria-hidden="true" />

        {/* Navigation */}
        <nav className="hero-nav" data-reveal>
          <div className="hero-nav-logo">
            <div className="hero-nav-logomark" aria-hidden="true">
              A
            </div>
            <span className="hero-nav-logotext">ASK</span>
          </div>

          <div
            className="hero-nav-links"
            role="navigation"
            aria-label="Main Navigation"
          >
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className="hero-nav-link">
                {label}
              </a>
            ))}
          </div>

          <button className="hero-nav-cta">Hire Me</button>
        </nav>

        <div className="hero-body">
          {/* Left Side Content Stack */}
          <div className="hero-left" data-reveal>
            <div
              className="section-eyebrow"
              aria-label="Available for remote opportunities"
            >
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              <span className="section-eyebrow-text">
                Available for Freelance &amp; Remote Work
              </span>
            </div>

            <h1 className="hero-headline section-title">
              Building modern
              <br />
              <span className="section-title-accent">web experiences</span>
              <br />
              that perform
            </h1>

            <p className="hero-sub">
              Front-End Developer specializing in React, Next.js, TypeScript,
              and Tailwind CSS. I transform Figma designs into responsive,
              high-performance web applications with clean architecture.
            </p>

            <div className="hero-stats" aria-label="Professional Statistics">
              <div className="hero-stat">
                <span className="hero-stat-num">20+</span>
                <span className="hero-stat-lbl">Projects Built</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">100%</span>
                <span className="hero-stat-lbl">Responsive</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">Fast</span>
                <span className="hero-stat-lbl">Performance</span>
              </div>
            </div>

            <div className="hero-btns">
              <a href="#stky-root" className="hero-btn-primary">
                Explore My Projects
              </a>
              <a href="/resume.pdf" download="Abdul_Salam_Resume.docx">
                <button className="hero-btn-secondary">Download Resume</button>
              </a>
            </div>

            <div className="hero-skills" aria-label="Technical Skills">
              {[
                "React",
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Figma",
                "Framer",
                "UI/UX",
                "Javascript",
                "Github",
              ].map((tag) => (
                <span key={tag} className="hero-skill-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-right" ref={rightRef} data-reveal>
            <canvas
              ref={canvasRef}
              className="hero-global-canvas"
              aria-hidden="true"
            />

            <div
              className="hero-badge-served"
              aria-label="Projects and Expertise"
            >
              <div className="hero-badge-number">20+</div>
              <div className="hero-badge-label">
                Successfully completed
                <br />
                web projects
              </div>
            </div>

            <div className="hero-badge-review">
              <div className="hero-review-top">
                <div className="hero-review-av" aria-hidden="true">
                  {"</>"}
                </div>
                <div>
                  <div className="hero-review-name">Development Focus</div>
                  <div className="hero-review-role">React • TS • Tailwind</div>
                </div>
              </div>
              <div className="hero-review-stars">⭐⭐⭐⭐⭐</div>
              <p className="hero-review-text">
                Building scalable, responsive, and modern user interfaces with
                pixel-perfect implementation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
