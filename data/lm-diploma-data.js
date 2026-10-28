/*
 * Diploma for Labour Migration Experts and Practitioners: site content
 * ---------------------------------------------------------------------
 * This is the single place to update programme facts, the 2027 course calendar,
 * course descriptions, images and links. The page reads it at load time
 * (no build step, works on GitHub Pages and from a local folder).
 *
 * Dates are ISO strings (YYYY-MM-DD). Add or edit entries in `courses`; the page
 * sorts them chronologically.
 *
 * Source key used in the notes below
 *   [CAL]  supplied 2027 course calendar (front)
 *   [DECK] supplied Diploma presentation / flyer
 *   [WEB]  official ITCILO course page, checked on `meta.lastChecked`
 *
 * `hotspot` places the course ring on the illustration in "Eligible courses": x and y are the
 * centre and d the diameter, all as a percentage of the picture width. Omit it for no ring.
 *
 * `publicNotes` contains concise participant notices (always visible, including exports).
 * `deadlineVerified: false` prevents an unconfirmed deadline being presented as definitive.
 * `review` lists internal items that need a human decision. The page shows them only while
 * `meta.showReviewFlags` is true (preview builds). Set it to false before launch.
 */
window.LMD_DATA = {
  meta: {
    calendarYear: 2027,
    lastChecked: "2026-10-28",
    showReviewFlags: false,
    siteUrl: "https://m-albertazzi.github.io/LMDiploma/"
  },

  programme: {
    title: "Diploma for Labour Migration Experts and Practitioners",
    subtitle: "A structured learning pathway for strengthening labour migration governance",
    learningHours: 300,
    years: 5,
    electivesRequired: 3,
    email: "migration@itcilo.org",
    website: "https://www.itcilo.org",
    diplomaPageUrl: "https://www.itcilo.org/diplomas/diploma-labour-migration-experts-and-practitioners",
    catalogueUrl: "https://www.itcilo.org/courses?field_topics%5B167%5D=167",
    linkedin: "@itcilomigration",
    address: "International Training Centre of the ILO, Viale Maestri del Lavoro 10, 10127 Turin, Italy",
    flyer: { path: "assets/docs/LM-Diploma-flyer.pdf", label: "Diploma flyer (PDF, 6 MB)" }
  },

  // Thematic clusters from the Diploma presentation [DECK]. A course may sit in several.
  clusters: [
    { id: "governance",  label: "Governance",  color: "#9CC3C9", ink: "#1F4F57", blurb: "How labour migration is planned, negotiated, measured and run." },
    { id: "protection",  label: "Protection",  color: "#E3CBA8", ink: "#6B4A1F", blurb: "Rights, fair recruitment and social protection for migrant workers." },
    { id: "development", label: "Development", color: "#A7BDA5", ink: "#34553A", blurb: "Skills, recruitment and reintegration as levers for development." },
    { id: "crisis",      label: "Crisis",      color: "#DE9B8A", ink: "#7A2E1C", blurb: "Displacement, climate change and protection in times of crisis." }
  ],

  courses: [
    {
      id: "skills",
      hotspot: { x: 7.5, y: 68.0, d: 5.0 },
      title: "Skills dimensions of labour migration and mobility",
      mandatory: false,
      start: "2027-03-15", end: "2027-04-23",
      format: "Online",
      location: "Online (E-Campus)",
      f2f: null,
      languages: ["English"],
      languagesVerified: true,
      clusters: ["development"],
      image: "assets/img/courses/skills.webp",
      imageAlt: "Three workers in hard hats studying a plan together",
      accent: "#B9C337",
      officialUrl: "https://www.itcilo.org/courses/skills-dimensions-labour-migration-and-mobility",
      applyUrl: "https://oarf2.itcilo.org/STF/A9720103/en",
      deadline: "2027-03-01",
      courseCode: "A9720103",
      overview: "An online course on how skills policy and labour migration policy connect: anticipating labour market needs in destination countries, matching and recognising skills, and building skills partnerships between countries.",
      audience: [
        "Labour migration policy makers and technical advisers",
        "Skills and employment policy specialists",
        "Officials of ministries of labour, education and foreign affairs",
        "Qualifications authorities and recognition bodies",
        "Workers' and employers' organisations, and NGO technical staff"
      ],
      topics: [
        "Skills anticipation and matching",
        "Transparency, recognition and portability of skills",
        "Skills development for migrant workers before, during and after migration",
        "Skills components in bilateral and multilateral agreements",
        "Skills mobility and skills partnerships for development"
      ],
      outcomes: [
        "Understand destination-country labour market needs and how to address skills shortages",
        "Use skills anticipation and matching tools to manage labour migration flows",
        "Design and apply skills recognition approaches",
        "Assess skills partnerships between origin and destination countries"
      ],
      review: [
        { field: "Course page text", note: "The 'course structure' paragraph on the official page still refers to a 2024 edition (29 April to 7 June 2024). Dates in the page header match the calendar." }
      ]
    },

    {
      id: "bilateral",
      hotspot: { x: 31.0, y: 31.2, d: 7.7 },
      title: "Developing, Negotiating and Implementing Bilateral Labour Migration Agreements",
      mandatory: false,
      start: "2027-04-26", end: "2027-05-28",
      format: "Blended",
      location: "Online (E-Campus) and Turin, Italy",
      f2f: { start: "2027-05-17", end: "2027-05-21", place: "Turin, Italy" },
      phases: ["Online: 26 April to 14 May 2027", "Face-to-face in Turin: 17 to 21 May 2027", "Online: 24 to 28 May 2027"],
      languages: ["English"],
      languagesVerified: true,
      clusters: ["governance"],
      image: "assets/img/courses/bilateral.webp",
      imageAlt: "Two hands pulling opposite ends of a rope against a blue backdrop",
      accent: "#BFD7D0",
      officialUrl: "https://www.itcilo.org/courses/developing-and-implementing-bilateral-labour-agreements",
      applyUrl: "https://oarf2.itcilo.org/STF/A9719827/en",
      deadline: "2027-03-12",
      courseCode: "A9719827",
      overview: "Covers the full life of a bilateral labour migration agreement or memorandum of understanding, from design and negotiation to implementation, monitoring and joint committees. A negotiation simulation lets participants practise.",
      audience: [
        "Officials dealing with migration policy or international relations",
        "Policy planners involved in concluding bilateral labour agreements",
        "Practitioners in public institutions and ministries working on migration",
        "Representatives of workers' and employers' organisations"
      ],
      topics: [
        "Types, trends and normative foundations of bilateral agreements, including the Global Guidance on Bilateral Labour Migration Agreements",
        "Minimum provisions, skills, social protection and gender-sensitive design",
        "Implementation, monitoring and evaluation, and joint committees",
        "Negotiation stages, position-based and needs-based negotiation"
      ],
      outcomes: [
        "Explain the role, goals and challenges of negotiating bilateral labour agreements",
        "Identify good practice against international norms",
        "Critically review existing agreements and negotiate revisions",
        "Apply negotiation techniques in a simulation"
      ],
      review: [
        { field: "Official URL", note: "The catalogue links this course at /developing-negotiating-and-implementing-bilateral-labour-agreements, while the page checked lives at /courses/developing-and-implementing-bilateral-labour-agreements. Both resolve to the same course (node 2103); confirm the canonical address." }
      ]
    },

    {
      id: "access",
      hotspot: { x: 95.0, y: 58.6, d: 5.3 },
      title: "Access to decent work for refugees and other forcibly displaced persons",
      mandatory: false,
      start: "2027-05-10", end: "2027-06-18",
      format: "Online",
      location: "Online (E-Campus)",
      f2f: null,
      languages: ["English"],
      languagesVerified: true,
      clusters: ["crisis"],
      image: "assets/img/courses/access.webp",
      imageAlt: "A worker in a red cap painting a wall from a ladder",
      accent: "#FADBCE",
      officialUrl: "https://www.itcilo.org/courses/access-decent-work-refugees-and-other-forcibly-displaced-persons",
      applyUrl: "https://oarf2.itcilo.org/DST/A9720020/en",
      deadline: "2027-04-30",
      courseCode: "A9720020",
      overview: "A six-week online course on measures that open labour markets to refugees and other forcibly displaced persons, built around the ILO's 2016 Guiding Principles and national case studies.",
      audience: [
        "Officials of ministries of labour and other bodies responsible for refugee policy",
        "Employers' and workers' organisation representatives",
        "Staff of humanitarian and development organisations"
      ],
      topics: [
        "Forced displacement, livelihoods and self-reliance",
        "International legal and normative frameworks for labour market access",
        "Legislative and administrative conditions and practices",
        "Strategies and examples from different regional contexts"
      ],
      outcomes: [
        "Identify challenges and opportunities, including the gender dimension of access to decent work",
        "Use international human rights and refugee legal frameworks",
        "Propose legal and policy options to improve labour market access",
        "Access tools for employment-based responses to refugee situations"
      ],
      review: []
    },

    {
      id: "digital",
      hotspot: { x: 25.3, y: 48.0, d: 4.3 }, // placeholder: phone posters in the shop window; move when the cover detail is chosen
      title: "Digital transformation for inclusive labour migration governance",
      mandatory: false,
      start: "2027-06-21", end: "2027-06-25",
      format: "Face-to-face",
      location: "Turin, Italy",
      f2f: { start: "2027-06-21", end: "2027-06-25", place: "Turin, Italy" },
      languages: ["English"],
      languagesVerified: true,
      clusters: ["governance"],
      image: null,
      imageAlt: "",
      coverLabel: "Digital transformation",
      accent: "#9FBFCB",
      officialUrl: "https://www.itcilo.org/courses/digital-transformation-inclusive-labour-migration-governance",
      applyUrl: "https://oarf2.itcilo.org/STF/A9020021/en",
      deadline: "2027-05-07",
      courseCode: "A9020021",
      overview: "A week in Turin on how digital tools can make labour migration governance fairer and more effective, and how to manage the risks: data protection, exclusion and exploitation. Participants finish with an action plan.",
      audience: [
        "Officials of ministries of labour and migration",
        "Employers' and workers' organisation representatives",
        "Public employment services, private recruitment agencies and civil society",
        "Officers in charge of digital transformation in the context of migration",
        "Academics and researchers"
      ],
      topics: [
        "Digital governance across the migration cycle, from pre-departure to reintegration",
        "Data governance, privacy, consent and cross-border data exchange",
        "Inclusive, gender-responsive design, including offline access",
        "Digital tools for fair recruitment, skills matching, grievance handling and wage monitoring"
      ],
      outcomes: [
        "Define digital governance for labour migration and its core principles",
        "Identify the main risks of digital technology in migration governance",
        "Run a rapid institutional digital maturity self-assessment",
        "Draft an action plan to pilot or scale digital reforms"
      ],
      review: [
        { field: "Format", note: "The calendar and the official page both say face-to-face, but the page also describes a 15-hour online phase before the Turin week, and the 2026 edition ran online from 1 to 19 June before 22 to 26 June in Turin. Confirm whether the 2027 edition has online dates." },
        { field: "Hotspot position", note: "The ring for this course sits on the phone posters in the shop window as a suggestion, because the course has no cover illustration yet. Change hotspot.x, y and d in the data file when the cover detail is chosen." },
        { field: "Cover image", note: "The deck does not include this course's cover illustration, so the page uses a designed title treatment. Supply the image file to replace it." }
      ]
    },

    {
      id: "academy",
      hotspot: { x: 58.7, y: 50.7, d: 16.0 },
      title: "Academy on Labour Migration",
      mandatory: true,
      start: "2027-06-28", end: "2027-07-30",
      format: "Blended",
      location: "Online (E-Campus) and Turin, Italy",
      f2f: { start: "2027-07-19", end: "2027-07-23", place: "Turin, Italy" },
      phases: ["Online: 28 June to 16 July 2027", "Face-to-face in Turin: 19 to 23 July 2027", "Online: 26 to 30 July 2027"],
      languages: ["English", "French"],
      languagesVerified: true,
      clusters: [],
      image: "assets/img/courses/academy.webp",
      imageAlt: "A busy street crossing with people walking in every direction",
      accent: "#598297",
      officialUrl: "https://www.itcilo.org/courses/academy-labour-migration",
      applyUrl: "https://oarf2.itcilo.org/STF/A9720022/en",
      deadline: "2027-06-04",
      courseCode: "A9720022",
      overview: "The mandatory anchor of the Diploma. Advanced, practice-oriented learning on labour migration governance, protection, migration and sustainable development, and crisis migration, with elective courses, plenary sessions, a group simulation and an individual essay.",
      audience: [
        "Policy planners and officials in labour migration and mobility bodies",
        "Representatives of workers' and employers' organisations",
        "NGO, civil society and diaspora or migrants' association staff",
        "Staff of international development agencies and regional economic communities",
        "Researchers, academics, journalists and media workers"
      ],
      topics: [
        "Fair and effective governance of labour migration",
        "Protection of migrant workers and their families",
        "Migration and sustainable development",
        "Crisis migration"
      ],
      outcomes: [
        "Address labour migration governance and mobility issues at global and regional levels, including from a gender perspective",
        "Promote links between migration and sustainable development",
        "Recognise the role of international labour standards, a rights-based approach and social dialogue",
        "Apply the Decent Work approach for migrant workers and refugees"
      ],
      review: []
    },

    {
      id: "fair-recruitment",
      hotspot: { x: 50.0, y: 24.0, d: 4.7 },
      title: "Establishing Fair Recruitment Processes",
      mandatory: false,
      start: "2027-09-20", end: "2027-10-22",
      format: "Blended",
      location: "Online (E-Campus) and Turin, Italy",
      f2f: { start: "2027-10-11", end: "2027-10-15", place: "Turin, Italy" },
      phases: ["Online: 20 September to 8 October 2027", "Face-to-face in Turin: 11 to 15 October 2027", "Online: 18 to 22 October 2027"],
      languages: ["English"],
      languagesVerified: true,
      clusters: ["protection", "development"],
      image: "assets/img/courses/fair-recruitment.webp",
      imageAlt: "Four workers in different uniforms standing side by side",
      accent: "#F0DAB7",
      officialUrl: "https://www.itcilo.org/courses/establishing-fair-recruitment-processes",
      applyUrl: "https://oarf2.itcilo.org/STF/A9720027/en",
      deadline: "2027-08-27",
      courseCode: "A9720027",
      overview: "How to reduce abusive and fraudulent recruitment: international standards, regulation and enforcement, recruitment fees and costs, supply chains, and the role of employers, trade unions and the media.",
      audience: [
        "Government officials and policy makers",
        "Workers' and employers' organisations",
        "Public and private employment agencies",
        "NGOs, civil society and international agency experts",
        "Recruitment industry and business representatives"
      ],
      topics: [
        "International instruments and the ILO General Principles and Operational Guidelines for Fair Recruitment",
        "Recruitment regulation, licensing, monitoring and enforcement",
        "Recruitment fees and related costs",
        "Supply chains and social auditing",
        "Fair recruitment in a digital context"
      ],
      outcomes: [
        "Apply international labour standards to recruitment practice",
        "Understand the drivers of formal and informal recruitment and how costs are measured",
        "Analyse alternatives to private employment agencies",
        "Protect workers, including migrant workers, from abusive and fraudulent recruitment"
      ],
      review: []
    },

    {
      id: "measuring",
      hotspot: { x: 36.8, y: 44.7, d: 6.3 },
      title: "Measuring and analysing labour migration",
      mandatory: false,
      start: "2027-10-11", end: "2027-11-19",
      format: "Online",
      location: "Online (E-Campus)",
      f2f: null,
      languages: ["English"],
      languagesVerified: true,
      clusters: ["governance"],
      image: "assets/img/courses/measuring.webp",
      imageAlt: "A world map surrounded by charts and data panels",
      accent: "#6AAECF",
      officialUrl: "https://www.itcilo.org/courses/measuring-analysing-labour-migration",
      applyUrl: null,
      deadline: null,
      courseCode: null,
      overview: "An online course on how labour migration is measured: ILO concepts and definitions, the ICLS guidelines, survey and administrative data sources, recruitment-cost indicators and the use of statistics in policy.",
      audience: [
        "Statisticians and analysts in national statistical offices",
        "Ministry policy makers and researchers",
        "Public employment service staff",
        "International organisations, development agencies and NGOs",
        "Workers' and employers' organisations"
      ],
      topics: [
        "ILO labour migration statistics concepts and definitions",
        "ICLS guidelines on statistics of international labour migration",
        "Sampling migrant populations, household surveys and administrative sources",
        "Measuring recruitment costs (SDG indicator 10.7.1)"
      ],
      outcomes: [
        "Understand labour statistics definitions and terminology",
        "Use ICLS guidelines and the ILO labour migration database",
        "Apply methods for quantitative and qualitative reporting",
        "Understand institutional coordination for evidence-based policy"
      ],
      review: [
        { field: "2027 edition", supplied: "11 October to 19 November 2027", official: "Not listed", note: "The official course page lists only the 2026 edition (12 October to 13 November 2026), and the catalogue shows no 2027 edition. The programme coordinator confirmed on 28 October 2026 that the 2027 calendar dates should be maintained. No deadline, course code or application link has been supplied." }
      ]
    },

    {
      id: "social-protection",
      hotspot: { x: 61.7, y: 72.3, d: 5.7 },
      title: "Extending Social Protection to Migrant Workers, Refugees and their Families",
      mandatory: false,
      start: "2027-10-18", end: "2027-11-12",
      format: "Blended",
      location: "Online (E-Campus) and Turin, Italy",
      f2f: { start: "2027-11-08", end: "2027-11-12", place: "Turin, Italy" },
      phases: ["Online: 18 October to 5 November 2027", "Face-to-face in Turin: 8 to 12 November 2027"],
      languages: ["English"],
      languagesVerified: true,
      clusters: ["protection", "crisis"],
      image: "assets/img/courses/social-protection.webp",
      imageAlt: "Three patterned birds perched on a branch among autumn leaves",
      accent: "#FADCC0",
      officialUrl: "https://www.itcilo.org/courses/extending-social-protection-migrant-workers-refugees-and-their-families",
      applyUrl: "https://oarf2.itcilo.org/STF/A9720028/en",
      deadline: "2027-09-18",
      courseCode: "A9720028",
      overview: "Looks at the unilateral, bilateral and multilateral measures that extend social protection to migrant workers and refugees in countries of origin and destination, including for groups often left out, such as domestic workers and temporary migrant workers.",
      audience: [
        "Officials and practitioners working on social protection for migrant workers and refugees",
        "Staff of social security institutions and ministries",
        "Social partner representatives",
        "UN agency practitioners and consultants"
      ],
      topics: [
        "The right to social security and the international legal framework",
        "Bilateral and multilateral social security agreements",
        "Social protection in bilateral labour agreements and memoranda of understanding",
        "Specific groups of migrant workers, refugees and asylum seekers",
        "Gender, social protection and labour migration"
      ],
      outcomes: [
        "Understand the issues and opportunities in extending social protection to migrant workers, refugees and their families",
        "Appreciate the international legal framework",
        "Analyse unilateral, bilateral and multilateral measures",
        "Draw on good practice from other countries"
      ],
      review: []
    },

    {
      id: "climate",
      hotspot: { x: 47.7, y: 42.9, d: 5.0 },
      title: "Exploring the labour dimensions of climate change and human mobility",
      mandatory: false,
      start: "2027-10-25", end: "2027-12-03",
      format: "Online",
      location: "Online (E-Campus)",
      f2f: null,
      languages: ["English"],
      languagesVerified: true,
      clusters: ["crisis"],
      image: "assets/img/courses/climate.webp",
      imageAlt: "Two figures walking across a dry, orange landscape",
      accent: "#F28B59",
      officialUrl: "https://www.itcilo.org/courses/exploring-labour-dimensions-climate-change-and-human-mobility",
      applyUrl: null,
      deadline: "2027-10-10",
      deadlineTime: "23:59",
      deadlineTimeZone: "Europe/Rome",
      deadlineSource: "Programme coordinator, 28 October 2026",
      courseCode: "A9720023",
      overview: "An online course on how climate change affects work and mobility, and what policy can do about it: Just Transition Guidelines, green jobs and skills, and decent work for people who move because of climate impacts.",
      audience: [
        "Climate adaptation, disaster response and migration experts",
        "Policy makers and technical advisers",
        "Workers' and employers' organisation representatives",
        "Local authorities and state actors",
        "Humanitarian, NGO and civil society staff"
      ],
      topics: [
        "Climate change, human mobility and decent work",
        "Integrating displacement and migration into climate legislation and planning",
        "Instruments for decent work in climate-induced mobility: social protection, financial services, livelihoods"
      ],
      outcomes: [
        "Explore how climate change and mobility interact, including by gender",
        "Analyse employment impacts of climate-induced mobility",
        "Review the ILO Just Transition Guidelines in relation to mobility",
        "Apply a rights-based approach grounded in international labour standards"
      ],
      review: [
        { field: "Application link", note: "The official page has an 'Apply now' button but no link behind it, so no application button is shown." }
      ]
    }
  ],

  globalReview: [
    { title: "Diploma languages", note: "The official Diploma page says the Diploma is available in English, French and Spanish. The presentation says all courses are offered in English and the Academy in English and French, with other languages on request. The site follows the presentation and does not imply every course is available in every language." },
    { title: "Eligible-course list on the official Diploma page", note: "That page lists Establishing Fair Recruitment Processes (2027), Extending Social Protection and Climate (both with 2026 dates) and the Digital Governance Academy (7 to 11 December 2026). The Digital Governance Academy is not in the supplied calendar or clusters, so it is not shown. Confirm whether it qualifies, and whether the list is meant to be a general related-courses list." },
    { title: "Application links", note: "Application links are copied from the 'Apply now' buttons on the official course pages. They could not be opened from the build environment, so they are not live-tested. Measuring and analysing, and the climate course, have no link yet." },
    { title: "Course images", note: "Official cover images could not be downloaded from the build environment. Course images are the illustrations from the Diploma presentation (some are small). The digital transformation course has a designed title treatment because no illustration was supplied." },
    { title: "Capstone and five-year rules", note: "The supplied material does not say how the capstone is submitted or assessed, or from what date the five years run. The page says so and points to the team." },
    { title: "LinkedIn", note: "The presentation gives the handle @itcilomigration but no address, so it is shown as text, not a link." },
    { title: "Reference website", note: "The suggested reference site (macielte-collab.github.io/online-mier-2026-2027) could not be opened from the build environment. Navigation and interaction ideas come from the brief only." }
  ],

  credits: {
    display: "Images: Samuele Omati", // shown in the footer when set
    heroIllustration: "Samuele Omati",
    courseImages: "Samuele Omati"
  }
};
