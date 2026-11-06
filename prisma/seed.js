const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding STJ SQLite Database (Academic Year 2026-2027)...");

  // Clean up obsolete generic admin account if it exists
  await prisma.user.deleteMany({
    where: { email: "admin@itc.edu.kh" },
  });

  // 1. Roles Definition
  const roles = [
    { name: "SUPER_ADMIN", description: "អភិបាលជាន់ខ្ពស់ប្រព័ន្ធ (STJ Top Authority / President)" },
    { name: "STJ_PRESIDENT", description: "ប្រធានក្រុមដឹកនាំ STJ (Overall STJ President)" },
    { name: "STJ_ADMIN", description: "គណៈគ្រប់គ្រង STJ និងតំណាងសមាគមនិស្សិត" },
    { name: "STUDENT_ASSOCIATION", description: "គណៈកម្មាធិការសមាគមនិស្សិត (ITC Student Association)" },
    { name: "COURSE_LEADER", description: "ប្រធានក្រុមមុខវិជ្ជាបង្រៀន (Course Team Leader)" },
    { name: "MEMBER", description: "សមាជិកបង្រៀនស្ម័គ្រចិត្ត STJ (Senior Tutor Member)" },
  ];

  const rolesMap = {};
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
    rolesMap[r.name] = role.id;
  }

  // 2. Core Permissions
  const permissions = [
    { code: "attendance:mark", module: "attendance", description: "ស្រង់វត្តមានសមាជិកក្នុងក្រុម" },
    { code: "attendance:read", module: "attendance", description: "មើលកំណត់ត្រាវត្តមាន" },
    { code: "attendance:correct", module: "attendance", description: "ស្នើសុំ ឬអនុម័តការកែតម្រូវវត្តមាន" },
    { code: "members:manage", module: "members", description: "គ្រប់គ្រង និងចាត់ចែងសមាជិក" },
    { code: "courses:manage", module: "courses", description: "គ្រប់គ្រងមុខវិជ្ជា និងមេរៀន" },
    { code: "sessions:manage", module: "sessions", description: "បង្កើត និងកែសម្រួលវគ្គបង្រៀន" },
    { code: "share_links:manage", module: "share_links", description: "បង្កើត និងគ្រប់គ្រងតំណភ្ជាប់ចែករំលែក" },
    { code: "reports:view", module: "reports", description: "មើលរបាយការណ៍ និងស្ថិតិទូទៅ" },
    { code: "system:admin", module: "system", description: "គ្រប់គ្រងការកំណត់ប្រព័ន្ធទាំងមូល" },
    { code: "leadership:handover", module: "system", description: "ប្រគល់សិទ្ធិដឹកនាំ STJ ទៅប្រធានអាណត្តិថ្មី" },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: { description: p.description },
      create: p,
    });
  }

  // 3. Departments (ITC Departments)
  const departments = [
    { code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង", nameEn: "Information and Communication Engineering", nameFr: "Génie Informatique et Communication" },
    { code: "AMS", nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ", nameEn: "Applied Mathematics and Statistics", nameFr: "Mathématiques Appliquées et Statistique" },
    { code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក", nameEn: "Industrial and Mechanical Engineering", nameFr: "Génie Industriel et Mécanique" },
    { code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល", nameEn: "Civil Engineering", nameFr: "Génie Civil" },
    { code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល", nameEn: "Electrical and Energy Engineering", nameFr: "Génie Électrique et Énergétique" },
    { code: "GTI", nameKh: "ដេប៉ាតឺម៉ង់ បច្ចេកវិទ្យាព័ត៌មាន", nameEn: "Information Technology", nameFr: "Génie Télécommunications et Réseaux" },
    { code: "GAR", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ", nameEn: "Rural Engineering", nameFr: "Génie Rural" },
    { code: "GCA", nameKh: "ដេប៉ាតឺម៉ង់ គីមី និងចំណីអាហារ", nameEn: "Chemical and Food Engineering", nameFr: "Génie Chimique et Alimentaire" },
    { code: "GTR", nameKh: "ដេប៉ាតឺម៉ង់ ទូរគមនាគមន៍ និងបណ្តាញ", nameEn: "Telecommunications and Network Engineering", nameFr: "Génie Télécommunication" },
    { code: "GGG", nameKh: "ដេប៉ាតឺម៉ង់ ធនធានរ៉ែ និងភូគព្ភសាស្ត្រ", nameEn: "Geo-resources and Geotechnical Engineering", nameFr: "Génie Géologique et Géotechnique" },
    { code: "GRH", nameKh: "ដេប៉ាតឺម៉ង់ ធនធានទឹក និងបរិស្ថាន", nameEn: "Water and Environmental Engineering", nameFr: "Génie Rural et Hydrologique" },
  ];

  const departmentsMap = {};
  for (const d of departments) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: { nameKh: d.nameKh, nameEn: d.nameEn, nameFr: d.nameFr },
      create: d,
    });
    departmentsMap[d.code] = dept.id;
  }

  // 4. Academic Years (Levels)
  const academicYears = [
    { code: "I1", label: "I1 (Ingénieur 1ère Année - Year 1)", order: 1 },
    { code: "I2", label: "I2 (Ingénieur 2ème Année - Year 2)", order: 2 },
    { code: "I3", label: "I3 (Ingénieur 3ème Année - Year 3)", order: 3 },
    { code: "I4", label: "I4 (Ingénieur 4ème Année - Year 4)", order: 4 },
    { code: "I5", label: "I5 (Ingénieur 5ème Année - Year 5)", order: 5 },
  ];

  const academicYearsMap = {};
  for (const yr of academicYears) {
    const y = await prisma.academicYear.upsert({
      where: { code: yr.code },
      update: { label: yr.label, order: yr.order },
      create: yr,
    });
    academicYearsMap[yr.code] = y.id;
  }

  // 5. 4 Core Courses
  const coursesData = [
    {
      code: "PROG101",
      slug: "programming",
      titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)",
      titleEn: "Programming & Algorithmic Thinking",
      titleFr: "Programmation et Algorithmique",
      descriptionKh: "ពង្រឹងមូលដ្ឋានគ្រឹះ C, C++, Data Structures, Algorithms ដឹកនាំដោយនិស្សិតរៀមច្បង លាង ជឹងហេង (I3-GTI)។ ក្រុមបង្រៀនមកពីដេប៉ាតឺម៉ង់ GIC & GTI ចំនួន ៩ នាក់។",
      descriptionEn: "Mastering C/C++, memory management and practical problem solving by GIC/GTI mentors.",
      descriptionFr: "Structures de données, pointeurs et algorithmes avancés.",
      category: "Engineering Foundation",
      icon: "Code",
      academicTerm: "2026-2027",
    },
    {
      code: "MATH101",
      slug: "mathematics",
      titleKh: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      titleEn: "Engineering Mathematics & Calculus",
      titleFr: "Mathématiques pour l'Ingénieur",
      descriptionKh: "Calculus, Linear Algebra, Differential Equations ដឹកនាំដោយ គឹម រតនៈ (I5-GIM)។ ក្រុមបង្រៀនមកពីដេប៉ាតឺម៉ង់ AMS & GIM ចំនួន ៧ នាក់។",
      descriptionEn: "Calculus, matrices and differential equations for engineering by AMS/GIM mentors.",
      descriptionFr: "Calcul différentiel et intégral appliqué à l'ingénierie.",
      category: "Engineering Foundation",
      icon: "Calculator",
      academicTerm: "2026-2027",
    },
    {
      code: "PHYS101",
      slug: "physics",
      titleKh: "រូបវិទ្យាវិស្វកម្ម (Physics)",
      titleEn: "Engineering Physics: Mechanics & Waves",
      titleFr: "Physique pour l'Ingénieur",
      descriptionKh: "មេកានិកបុរាណ ថាមពល និងចលនារលក ដឹកនាំដោយ គ្រុយ អ៊ីខាង (I3-GIM)។ ក្រុមបង្រៀនមកពីដេប៉ាតឺម៉ង់ GIM & GEE ចំនួន ១០ នាក់។",
      descriptionEn: "Classical mechanics and wave motion by GIM/GEE mentors.",
      descriptionFr: "Mécanique générale et phénomènes ondulatoires.",
      category: "Natural Sciences",
      icon: "Atom",
      academicTerm: "2026-2027",
    },
    {
      code: "CHEM101",
      slug: "chemistry",
      titleKh: "គីមីវិទ្យាទូទៅ (Chemistry)",
      titleEn: "General & Engineering Chemistry",
      titleFr: "Chimie pour l'Ingénieur",
      descriptionKh: "ទម្រង់ម៉ូលេគុល និងប្រតិកម្មគីមី ដឹកនាំដោយ ខេង លីឧស្សាហ៍ (I3-GCI)។ ក្រុមបង្រៀនមកពីដេប៉ាតឺម៉ង់ GCI, GAR, GCA ចំនួន ១១ នាក់។",
      descriptionEn: "Chemical kinetics and thermodynamics by GCI/GAR/GCA mentors.",
      descriptionFr: "Cinétique et équilibres chimiques.",
      category: "Natural Sciences",
      icon: "FlaskConical",
      academicTerm: "2026-2027",
    },
  ];

  const coursesMap = {};
  const coursesByCode = {};
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
    coursesMap[c.slug] = course.id;
    coursesByCode[c.code] = course.id;
  }

  // 6. Complete Official STJ 2026-2027 Roster (39 Official Senior Members)
  const officialRoster = [
    { num: 1, nameKh: "សុខ សេងលី", nameEn: "SOK SENGLY", gender: "F", studentId: "e20230969", yr: "I4", dept: "GCI", phone: "015399209", assignedCourse: "EXECUTIVE", role: "គណៈកម្មាធិការសមាគមនិស្សិត" },
    { num: 2, nameKh: "ផល ដាវីត", nameEn: "PHAL David", gender: "M", studentId: "e20221334", yr: "I5", dept: "GTR", phone: "086439191", assignedCourse: "EXECUTIVE", role: "ប្រធានក្រុមដឹកនាំ STJ (Overall President)" },
    { num: 3, nameKh: "គ្រុយ អ៊ីខាង", nameEn: "KRUY Ykhang", gender: "M", studentId: "e20240096", yr: "I3", dept: "GIM", phone: "0968925682", assignedCourse: "PHYS101", role: "ប្រធានក្រុម រូបវិទ្យា (Physics Leader)" },
    { num: 4, nameKh: "ឈិន តុលា", nameEn: "CHHIN TOLA", gender: "M", studentId: "e20240866", yr: "I3", dept: "GIM", phone: "0969720656", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GIM)" },
    { num: 5, nameKh: "ឡាន បូរិន", nameEn: "LAN BORIN", gender: "F", studentId: "e20240662", yr: "I3", dept: "GEE", phone: "070981465", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GEE)" },
    { num: 6, nameKh: "ប៉ាក់ ច័ន្ទបូរី", nameEn: "PAK CHANBOREY", gender: "M", studentId: "e20241183", yr: "I3", dept: "GCI", phone: "093271850", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GCI)" },
    { num: 7, nameKh: "វី ពិទូរ្យ", nameEn: "VY PITOU", gender: "M", studentId: "e20241143", yr: "I3", dept: "GIM", phone: "078564295", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GIM)" },
    { num: 8, nameKh: "ពៅ ជុំរតនៈ", nameEn: "PEOU CHUMRATTANAK", gender: "M", studentId: "e20250861", yr: "I2", dept: "GIM", phone: "087535899", assignedCourse: "MATH101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Mathematics (GIM)" },
    { num: 9, nameKh: "សុង ស្រីពេជ", nameEn: "SONG SREYPICH", gender: "F", studentId: "e20250220", yr: "I2", dept: "GEE", phone: "085468553", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GEE)" },
    { num: 10, nameKh: "សុខា អឺអឺង", nameEn: "SOKHA EEING", gender: "F", studentId: "e20251192", yr: "I2", dept: "GIM", phone: "015691428", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GIM)" },
    { num: 11, nameKh: "តឹក ឈាវវិសាល", nameEn: "TEK CHHEAVVISAL", gender: "M", studentId: "e20251185", yr: "I2", dept: "GEE", phone: "012734562", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GEE)" },
    { num: 12, nameKh: "អេង ស៊ូ យី", nameEn: "Eng Sou Y", gender: "F", studentId: "e20250642", yr: "I2", dept: "AMS", phone: "0963012386", assignedCourse: "MATH101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Mathematics (AMS)" },
    { num: 13, nameKh: "គឹម រតនៈ", nameEn: "KIM Ratanak", gender: "M", studentId: "e20221423", yr: "I5", dept: "GIM", phone: "010650202", assignedCourse: "MATH101", role: "ប្រធានក្រុម គណិតវិទ្យា (Math Leader)" },
    { num: 14, nameKh: "ប៊ុន សុខបញ្ញា", nameEn: "BUN Sokpanha", gender: "M", studentId: "e20221678", yr: "I5", dept: "GCI", phone: "0767821209", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GCI)" },
    { num: 15, nameKh: "ឡេង ច័ន្ទវង្សា", nameEn: "LENG Vongsa", gender: "M", studentId: "e20241028", yr: "I3", dept: "GAR", phone: "016594999", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GAR)" },
    { num: 16, nameKh: "ជាតិ វិសាល", nameEn: "CHEAT Visal", gender: "M", studentId: "e20250175", yr: "I2", dept: "GAR", phone: "017724617", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GAR)" },
    { num: 17, nameKh: "អិន សុជាតិ", nameEn: "ORN Socheat", gender: "M", studentId: "e20251044", yr: "I2", dept: "GEE", phone: "0976442857", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GEE)" },
    { num: 18, nameKh: "ម៉ឹង ហាក់", nameEn: "MOEUNG Hak", gender: "M", studentId: "e20251246", yr: "I2", dept: "GAR", phone: "0968445445", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GAR)" },
    { num: 19, nameKh: "សុំ សុធាវី", nameEn: "SOM Sotheavy", gender: "F", studentId: "e20250345", yr: "I2", dept: "GCA", phone: "011703261", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GCA)" },
    { num: 20, nameKh: "ហង់ សុជាតា", nameEn: "HANG Socheata", gender: "F", studentId: "e20250687", yr: "I2", dept: "GCA", phone: "016735656", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GCA)" },
    { num: 21, nameKh: "ជាលី អមរិន្ទ", nameEn: "CHEALY Amrin", gender: "M", studentId: "e20250258", yr: "I2", dept: "GIM", phone: "077606122", assignedCourse: "MATH101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Mathematics (GIM)" },
    { num: 22, nameKh: "ឈុំ បញ្ញា", nameEn: "CHHUM Panha", gender: "M", studentId: "e20251290", yr: "I2", dept: "AMS", phone: "068620824", assignedCourse: "MATH101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Mathematics (AMS)" },
    { num: 24, nameKh: "លៀងលី សុខឡេង", nameEn: "LEANGLY Sokleng", gender: "M", studentId: "e20241375", yr: "I3", dept: "GEE", phone: "0887045133", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GEE)" },
    { num: 25, nameKh: "លាង ជឹងហេង", nameEn: "LEANG JINGHENG", gender: "M", studentId: "e20240704", yr: "I3", dept: "GTI", phone: "0976355500", assignedCourse: "PROG101", role: "ប្រធានក្រុម Programming (Leader)" },
    { num: 26, nameKh: "ឃន វ៉ិចទ័រ", nameEn: "KHORN VICTOR", gender: "M", studentId: "e20230078", yr: "I4", dept: "GIC", phone: "081323442", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 27, nameKh: "ប៊ុន បុណ្ណាកា", nameEn: "BUN BUNNAKA", gender: "M", studentId: "e20230757", yr: "I4", dept: "GIC", phone: "0966677569", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 28, nameKh: "ស៊ឹង វិច្ឆិកា", nameEn: "SOUNG VICHKA", gender: "M", studentId: "e20240672", yr: "I3", dept: "GIC", phone: "010814529", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 29, nameKh: "សេង ម៉ិញហាវ", nameEn: "SENG MINGHAO", gender: "M", studentId: "e20240232", yr: "I3", dept: "GIC", phone: "017968212", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 30, nameKh: "ណាំ ម៉េងហួត", nameEn: "NAM MENGHOUT", gender: "M", studentId: "e20250475", yr: "I2", dept: "GIC", phone: "099998951", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 31, nameKh: "ចៃ ជីជូ", nameEn: "CHAI CHICHOU", gender: "M", studentId: "e20250731", yr: "I2", dept: "AMS", phone: "090249820", assignedCourse: "MATH101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Mathematics (AMS)" },
    { num: 32, nameKh: "ហាក់ ដូនីឡា", nameEn: "HAK DONYLA", gender: "M", studentId: "e20251399", yr: "I2", dept: "GIC", phone: "089926734", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 33, nameKh: "ពៀក ប្រុសម៉ៅ", nameEn: "PEAK BROSMAO", gender: "M", studentId: "e20251455", yr: "I2", dept: "GIC", phone: "099661460", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 34, nameKh: "ចំរើន ដែន", nameEn: "CHAMROEN DEN", gender: "M", studentId: "e20250414", yr: "I2", dept: "GIC", phone: "0963221116", assignedCourse: "PROG101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Programming (GIC)" },
    { num: 35, nameKh: "ខេង លីឧស្សាហ៍", nameEn: "KHENG Lyussa", gender: "F", studentId: "e20240046", yr: "I3", dept: "GCI", phone: "0974253117", assignedCourse: "CHEM101", role: "ប្រធានក្រុម គីមីវិទ្យា (Chemistry Leader)" },
    { num: 37, nameKh: "ឯល មូហាម៉ាត់សាហ្វី", nameEn: "EL Muhammadshafi", gender: "M", studentId: "e20240945", yr: "I3", dept: "GAR", phone: "093696794", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GAR)" },
    { num: 38, nameKh: "ឈឿន ធារី", nameEn: "KHOEUN Theary", gender: "F", studentId: "e20240561", yr: "I3", dept: "GCI", phone: "069944087", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GCI)" },
    { num: 39, nameKh: "ហាប់ ស៊ីឈាង", nameEn: "HAB Sychheang", gender: "M", studentId: "e20240670", yr: "I3", dept: "GIM", phone: "093202727", assignedCourse: "PHYS101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Physics (GIM)" },
    { num: 40, nameKh: "ឌិន ម៉េងហុង", nameEn: "DIN Menghong", gender: "M", studentId: "e20241214", yr: "I3", dept: "AMS", phone: "081687375", assignedCourse: "MATH101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Mathematics (AMS)" },
    { num: 41, nameKh: "ហួត សំណាង", nameEn: "HOUT Samnang", gender: "M", studentId: "e20240124", yr: "I3", dept: "GCI", phone: "0966224473", assignedCourse: "CHEM101", role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត Chemistry (GCI)" },
  ];

  const membersByCourse = {
    PROG101: [],
    MATH101: [],
    PHYS101: [],
    CHEM101: [],
    EXECUTIVE: [],
  };

  const createdUsers = {};
  const createdMembers = [];

  for (const m of officialRoster) {
    const memberId = `STJ${String(m.num).padStart(3, "0")}`;
    const deptId = departmentsMap[m.dept] || departmentsMap["GIC"];
    const yrId = academicYearsMap[m.yr] || academicYearsMap["I2"];

    // Login credentials format: e202xxxxx@itc.edu.kh & password e202xxxxx@ITC!
    const studentEmail = `${m.studentId.toLowerCase()}@itc.edu.kh`;
    const studentPassword = `${m.studentId.toLowerCase()}@ITC!`;
    const passwordHash = await bcrypt.hash(studentPassword, 10);

    const member = await prisma.member.upsert({
      where: { memberId },
      update: {
        fullNameKh: m.nameKh,
        fullNameEn: m.nameEn,
        studentId: m.studentId,
        email: studentEmail,
        phone: m.phone,
        gender: m.gender,
        departmentId: deptId,
        academicYearId: yrId,
        cohortYear: "2026-2027",
        notes: `មុខវិជ្ជាទទួលខុសត្រូវ៖ ${m.assignedCourse} | តួនាទី៖ ${m.role}`,
      },
      create: {
        id: `member-${memberId.toLowerCase()}`,
        memberId,
        studentId: m.studentId,
        fullNameKh: m.nameKh,
        fullNameEn: m.nameEn,
        email: studentEmail,
        phone: m.phone,
        gender: m.gender,
        departmentId: deptId,
        academicYearId: yrId,
        cohortYear: "2026-2027",
        notes: `មុខវិជ្ជាទទួលខុសត្រូវ៖ ${m.assignedCourse} | តួនាទី៖ ${m.role}`,
        status: "ACTIVE",
      },
    });

    createdMembers.push(member);
    if (membersByCourse[m.assignedCourse]) {
      membersByCourse[m.assignedCourse].push(member);
    }

    // Find existing user by memberRecordId, studentId, or email
    let userAccount = await prisma.user.findFirst({
      where: {
        OR: [
          { memberRecordId: member.id },
          { studentId: m.studentId },
          { email: studentEmail },
        ],
      },
    });

    if (userAccount) {
      userAccount = await prisma.user.update({
        where: { id: userAccount.id },
        data: {
          email: studentEmail,
          passwordHash,
          fullNameKh: m.nameKh,
          fullNameEn: m.nameEn,
          studentId: m.studentId,
          phone: m.phone,
          gender: m.gender,
          status: "ACTIVE",
          memberRecordId: member.id,
        },
      });
    } else {
      userAccount = await prisma.user.create({
        data: {
          email: studentEmail,
          passwordHash,
          fullNameKh: m.nameKh,
          fullNameEn: m.nameEn,
          studentId: m.studentId,
          phone: m.phone,
          gender: m.gender,
          status: "ACTIVE",
          memberRecordId: member.id,
        },
      });
    }

    createdUsers[m.studentId] = userAccount;

    // Role assignment
    // Num 2 = ផល ដាវីត (STJ President & Top Authority)
    if (m.num === 2) {
      for (const rName of ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN", "MEMBER"]) {
        await prisma.userRole.upsert({
          where: { userId_roleId: { userId: userAccount.id, roleId: rolesMap[rName] } },
          update: {},
          create: { userId: userAccount.id, roleId: rolesMap[rName] },
        });
      }
    }
    // Num 1 = សុខ សេងលី (Student Association Committee)
    else if (m.num === 1) {
      for (const rName of ["STUDENT_ASSOCIATION", "STJ_ADMIN", "MEMBER"]) {
        await prisma.userRole.upsert({
          where: { userId_roleId: { userId: userAccount.id, roleId: rolesMap[rName] } },
          update: {},
          create: { userId: userAccount.id, roleId: rolesMap[rName] },
        });
      }
    }
    // Course Leaders
    else if (m.num === 25 || m.num === 13 || m.num === 3 || m.num === 35) {
      for (const rName of ["COURSE_LEADER", "MEMBER"]) {
        await prisma.userRole.upsert({
          where: { userId_roleId: { userId: userAccount.id, roleId: rolesMap[rName] } },
          update: {},
          create: { userId: userAccount.id, roleId: rolesMap[rName] },
        });
      }
    }
    // Regular Members
    else {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: userAccount.id, roleId: rolesMap["MEMBER"] } },
        update: {},
        create: { userId: userAccount.id, roleId: rolesMap["MEMBER"] },
      });
    }

    // Enrollments
    if (m.assignedCourse !== "EXECUTIVE" && coursesByCode[m.assignedCourse]) {
      await prisma.courseEnrollment.upsert({
        where: { courseId_memberId: { courseId: coursesByCode[m.assignedCourse], memberId: member.id } },
        update: {},
        create: { courseId: coursesByCode[m.assignedCourse], memberId: member.id },
      });
    }
  }

  // 7. Course Leader Assignments
  const davidUser = createdUsers["e20221334"];
  const progLeaderUser = createdUsers["e20240704"]; // លាង ជឹងហេង
  const mathLeaderUser = createdUsers["e20221423"]; // គឹម រតនៈ
  const physLeaderUser = createdUsers["e20240096"]; // គ្រុយ អ៊ីខាង
  const chemLeaderUser = createdUsers["e20240046"]; // ខេង លីឧស្សាហ៍

  await prisma.courseLeader.upsert({
    where: { courseId_userId: { courseId: coursesMap["programming"], userId: progLeaderUser.id } },
    update: {},
    create: { courseId: coursesMap["programming"], userId: progLeaderUser.id },
  });

  await prisma.courseLeader.upsert({
    where: { courseId_userId: { courseId: coursesMap["mathematics"], userId: mathLeaderUser.id } },
    update: {},
    create: { courseId: coursesMap["mathematics"], userId: mathLeaderUser.id },
  });

  await prisma.courseLeader.upsert({
    where: { courseId_userId: { courseId: coursesMap["physics"], userId: physLeaderUser.id } },
    update: {},
    create: { courseId: coursesMap["physics"], userId: physLeaderUser.id },
  });

  await prisma.courseLeader.upsert({
    where: { courseId_userId: { courseId: coursesMap["chemistry"], userId: chemLeaderUser.id } },
    update: {},
    create: { courseId: coursesMap["chemistry"], userId: chemLeaderUser.id },
  });

  // 8. Academic Mandate (2026-2027) with ផល ដាវីត as STJ President
  await prisma.stjMandate.upsert({
    where: { academicYear: "2026-2027" },
    update: {
      presidentId: davidUser.id,
      presidentNameKh: "ផល ដាវីត",
      presidentStudentId: "e20221334",
      status: "ACTIVE",
      isLocked: false,
    },
    create: {
      academicYear: "2026-2027",
      titleKh: "អាណត្តិដឹកនាំ STJ ឆ្នាំសិក្សា ២០២៦-២០២៧",
      presidentId: davidUser.id,
      presidentNameKh: "ផល ដាវីត",
      presidentStudentId: "e20221334",
      status: "ACTIVE",
      isLocked: false,
    },
  });

  // 8.5 Live Teaching Sessions
  const mathSession = await prisma.teachingSession.upsert({
    where: { id: "session-math-complexe" },
    update: {
      title: "Le Nombre Complexe",
      sessionDate: new Date("2026-11-05"),
      startTime: "11:30",
      endTime: "13:00",
      room: "SF1 and SF2",
      status: "COMPLETED",
    },
    create: {
      id: "session-math-complexe",
      courseId: coursesMap["mathematics"],
      title: "Le Nombre Complexe",
      sessionDate: new Date("2026-11-05"),
      startTime: "11:30",
      endTime: "13:00",
      room: "SF1 and SF2",
      status: "COMPLETED",
      createdById: mathLeaderUser.id,
    },
  });

  const progSession = await prisma.teachingSession.upsert({
    where: { id: "session-prog-intro" },
    update: {
      title: "C PROGRAMING",
      sessionDate: new Date("2026-11-04"),
      startTime: "11:30",
      endTime: "13:00",
      room: "SF2",
      status: "COMPLETED",
    },
    create: {
      id: "session-prog-intro",
      courseId: coursesMap["programming"],
      title: "C PROGRAMING",
      sessionDate: new Date("2026-11-04"),
      startTime: "11:30",
      endTime: "13:00",
      room: "SF2",
      status: "COMPLETED",
      createdById: progLeaderUser.id,
    },
  });

  // Seed attendance for prog session
  const progEnrolled = await prisma.courseEnrollment.findMany({
    where: { courseId: coursesMap["programming"] },
  });
  for (const enr of progEnrolled) {
    await prisma.attendanceRecord.upsert({
      where: { sessionId_memberId: { sessionId: progSession.id, memberId: enr.memberId } },
      update: { status: "PRESENT" },
      create: {
        sessionId: progSession.id,
        memberId: enr.memberId,
        status: "PRESENT",
      },
    });
  }

  // Seed attendance for math session
  const mathEnrolled = await prisma.courseEnrollment.findMany({
    where: { courseId: coursesMap["mathematics"] },
  });
  for (const enr of mathEnrolled) {
    await prisma.attendanceRecord.upsert({
      where: { sessionId_memberId: { sessionId: mathSession.id, memberId: enr.memberId } },
      update: { status: "PRESENT" },
      create: {
        sessionId: mathSession.id,
        memberId: enr.memberId,
        status: "PRESENT",
      },
    });
  }

  // Session share link
  await prisma.shareLink.upsert({
    where: { token: "stj-demo-token-2026" },
    update: {
      title: "របាយការណ៍មេរៀន C PROGRAMING (2026-11-04)",
      sessionId: progSession.id,
      courseId: coursesMap["programming"],
      showStats: true,
    },
    create: {
      token: "stj-demo-token-2026",
      tokenHash: "sha256_hash_stj_demo_token_2026",
      courseId: coursesMap["programming"],
      sessionId: progSession.id,
      title: "របាយការណ៍មេរៀន C PROGRAMING (2026-11-04)",
      showStats: true,
      createdById: progLeaderUser.id,
    },
  });

  // 9. Initial Public Share Links
  await prisma.shareLink.upsert({
    where: { token: "stj-official-2027" },
    update: {},
    create: {
      token: "stj-official-2027",
      tokenHash: "sha256_hash_stj_official_2027",
      courseId: coursesMap["programming"],
      title: "របាយការណ៍វត្តមាន STJ Programming ឆ្នាំសិក្សា ២០២៦-២០២៧",
      showStats: true,
      createdById: progLeaderUser.id,
    },
  });

  // 10. Multi-Year System Settings
  const settings = [
    { key: "org_name", value: "Senior Teaching Junior (STJ)" },
    { key: "institution", value: "Institute of Technology of Cambodia (ITC)" },
    { key: "academic_year_current", value: "2026-2027" },
    { key: "stj_current_president_id", value: davidUser.id },
    { key: "stj_current_president_name", value: "ផល ដាវីត" },
    { key: "stj_current_president_student_id", value: "e20221334" },
    { key: "semester_current", value: "Semester 1" },
    { key: "attendance_warning_threshold", value: "75" },
    { key: "target_audience", value: "STJ Senior Members (Tutors) Only - Not For Junior Students" },
    { key: "database_storage_type", value: "SQLite .db File (prisma/stj.db)" },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log(`STJ Database successfully seeded into prisma/stj.db:`);
  console.log(`- Created Accounts for ALL ${createdMembers.length} Senior Members`);
  console.log(`  * Login Email Format: e202xxxxx@itc.edu.kh`);
  console.log(`  * Default Password Format: e202xxxxx@ITC!`);
  console.log(`- Top Authority / STJ President: ផល ដាវីត (e20221334@itc.edu.kh)`);
  console.log(`- Student Association: សុខ សេងលី (e20230969@itc.edu.kh)`);
  console.log(`- Programming Leader: លាង ជឹងហេង (e20240704@itc.edu.kh)`);
  console.log(`- Mathematics Leader: គឹម រតនៈ (e20221423@itc.edu.kh)`);
  console.log(`- Physics Leader: គ្រុយ អ៊ីខាង (e20240096@itc.edu.kh)`);
  console.log(`- Chemistry Leader: ខេង លីឧស្សាហ៍ (e20240046@itc.edu.kh)`);
  console.log(`- Active Mandate: 2026-2027 (Under ផល ដាវីត)`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
