const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding STJ 2026-2027 Official ITC Data (MySQL)...");

  // 1. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "គណៈគ្រប់គ្រង STJ កណ្តាល នៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
      isSystem: true,
    },
  });

  const stjAdminRole = await prisma.role.upsert({
    where: { name: "STJ_ADMIN" },
    update: {},
    create: {
      name: "STJ_ADMIN",
      description: "គណៈកម្មាធិការសមាគមនិស្សិត និងអ្នកសម្របសម្រួល STJ",
      isSystem: true,
    },
  });

  const courseLeaderRole = await prisma.role.upsert({
    where: { name: "COURSE_LEADER" },
    update: {},
    create: {
      name: "COURSE_LEADER",
      description: "ប្រធានក្រុមមុខវិជ្ជា (Programming, Math, Physics, Chemistry) - សិទ្ធិត្រឹមតែមើលវត្តមាន និងបង្កើត Share Link",
      isSystem: true,
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { name: "MEMBER" },
    update: {},
    create: {
      name: "MEMBER",
      description: "សមាជិកនិស្សិតស្ម័គ្រចិត្ត STJ",
      isSystem: true,
    },
  });

  // 2. Permissions
  const permissionsList = [
    { code: "attendance:mark", module: "attendance", description: "ស្រង់ និងរក្សាទុកវត្តមានផ្លូវការ" },
    { code: "attendance:read", module: "attendance", description: "មើលកំណត់ត្រាវត្តមាន" },
    { code: "attendance:correct", module: "attendance", description: "ពិនិត្យ និងអនុម័តសំណើកែតម្រូវវត្តមាន" },
    { code: "members:manage", module: "members", description: "គ្រប់គ្រងបញ្ជីសមាជិក (CRUD)" },
    { code: "courses:manage", module: "courses", description: "គ្រប់គ្រងមុខវិជ្ជា និងប្រធានក្រុម" },
    { code: "sessions:manage", module: "sessions", description: "បង្កើត និងរៀបចំវគ្គបង្រៀន" },
    { code: "share:create", module: "share", description: "បង្កើតតំណភ្ជាប់ចែករំលែកវត្តមាន" },
    { code: "reports:view", module: "reports", description: "ទាញយករបាយការណ៍ និងស្ថិតិ" },
    { code: "system:settings", module: "system", description: "គ្រប់គ្រងការកំណត់ប្រព័ន្ធ និង Audit Logs" },
  ];

  for (const perm of permissionsList) {
    const p = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });

    // Super Admin gets all
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: p.id },
    });

    // STJ Admin gets all except system:settings
    if (perm.code !== "system:settings") {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: stjAdminRole.id, permissionId: p.id } },
        update: {},
        create: { roleId: stjAdminRole.id, permissionId: p.id },
      });
    }

    // Course Leader gets strictly: attendance:read, share:create, reports:view
    if (["attendance:read", "share:create", "reports:view"].includes(perm.code)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: courseLeaderRole.id, permissionId: p.id } },
        update: {},
        create: { roleId: courseLeaderRole.id, permissionId: p.id },
      });
    }
  }

  // 3. Official ITC Departments
  const departmentsData = [
    { code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង", nameEn: "Department of Information and Communication Engineering", nameFr: "Génie Informatique et Communication" },
    { code: "GTI", nameKh: "ដេប៉ាតឺម៉ង់ បច្ចេកវិទ្យាព័ត៌មាន", nameEn: "Department of Information Technology Engineering", nameFr: "Génie des Technologies de l'Information" },
    { code: "AMS", nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ", nameEn: "Department of Applied Mathematics and Statistics", nameFr: "Mathématiques Appliquées et Statistiques" },
    { code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក", nameEn: "Department of Industrial and Mechanical Engineering", nameFr: "Génie Industriel et Mécanique" },
    { code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល", nameEn: "Department of Civil Engineering", nameFr: "Génie Civil" },
    { code: "GTR", nameKh: "ដេប៉ាតឺម៉ង់ ទូរគមនាគមន៍ និងបណ្តាញ", nameEn: "Department of Telecommunication and Network Engineering", nameFr: "Génie des Télécommunications et Réseaux" },
    { code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល", nameEn: "Department of Electrical and Energy Engineering", nameFr: "Génie Électrique et Énergétique" },
    { code: "GAR", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ / ក្សេត្រសាស្រ្ត", nameEn: "Department of Rural and Agricultural Engineering", nameFr: "Génie Rural et Agro-ressources" },
    { code: "GCA", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល និងក្សេត្រសាស្រ្ត", nameEn: "Department of Civil and Agronomy Engineering", nameFr: "Génie Civil et Agronomie" },
  ];

  const departmentsMap = {};
  for (const dept of departmentsData) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
    departmentsMap[dept.code] = d.id;
  }

  // 4. Academic Years
  const academicYearsData = [
    { code: "I1", label: "Ingénieur 1ère Année (Year 1)", order: 1 },
    { code: "I2", label: "Ingénieur 2ème Année (Year 2)", order: 2 },
    { code: "I3", label: "Ingénieur 3ème Année (Year 3)", order: 3 },
    { code: "I4", label: "Ingénieur 4ème Année (Year 4)", order: 4 },
    { code: "I5", label: "Ingénieur 5ème Année (Year 5)", order: 5 },
  ];

  const academicYearsMap = {};
  for (const yr of academicYearsData) {
    const y = await prisma.academicYear.upsert({
      where: { code: yr.code },
      update: {},
      create: yr,
    });
    academicYearsMap[yr.code] = y.id;
  }

  // 5. Default Password
  const defaultPassword = await bcrypt.hash("ITC@STJ2026!", 12);

  // Super Admin: Central Administrator
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@itc.edu.kh" },
    update: {},
    create: {
      email: "admin@itc.edu.kh",
      passwordHash: defaultPassword,
      fullNameKh: "គណៈគ្រប់គ្រង STJ កណ្តាល",
      fullNameEn: "Central STJ Administrator",
      phone: "+855 23 880 370",
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: superAdminRole.id },
  });

  // Leadership Team President: ផល ដាវីត (PHAL David - e20221334)
  const davidUser = await prisma.user.upsert({
    where: { email: "phal.david@itc.edu.kh" },
    update: {},
    create: {
      email: "phal.david@itc.edu.kh",
      passwordHash: defaultPassword,
      fullNameKh: "ផល ដាវីត",
      fullNameEn: "PHAL David",
      studentId: "e20221334",
      phone: "086439191",
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: davidUser.id, roleId: stjAdminRole.id } },
    update: {},
    create: { userId: davidUser.id, roleId: stjAdminRole.id },
  });

  // Student Association Committee: សុខ សេងលី (SOK SENGLY - e20230969)
  const senglyUser = await prisma.user.upsert({
    where: { email: "sok.sengly@itc.edu.kh" },
    update: {},
    create: {
      email: "sok.sengly@itc.edu.kh",
      passwordHash: defaultPassword,
      fullNameKh: "សុខ សេងលី",
      fullNameEn: "SOK SENGLY",
      studentId: "e20230969",
      phone: "015399209",
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: senglyUser.id, roleId: stjAdminRole.id } },
    update: {},
    create: { userId: senglyUser.id, roleId: stjAdminRole.id },
  });

  // Programming Leader: លាង ជីងហេង (LEANG JINGHENG - e20240704)
  const progLeaderUser = await prisma.user.upsert({
    where: { email: "leang.jingheng@itc.edu.kh" },
    update: {},
    create: {
      email: "leang.jingheng@itc.edu.kh",
      passwordHash: defaultPassword,
      fullNameKh: "លាង ជីងហេង",
      fullNameEn: "LEANG JINGHENG",
      studentId: "e20240704",
      phone: "0976355500",
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: progLeaderUser.id, roleId: courseLeaderRole.id } },
    update: {},
    create: { userId: progLeaderUser.id, roleId: courseLeaderRole.id },
  });

  // Math Leader: គឹម រតនៈ (KIM Ratanak - e20221423)
  const mathLeaderUser = await prisma.user.upsert({
    where: { email: "kim.ratanak@itc.edu.kh" },
    update: {},
    create: {
      email: "kim.ratanak@itc.edu.kh",
      passwordHash: defaultPassword,
      fullNameKh: "គឹម រតនៈ",
      fullNameEn: "KIM Ratanak",
      studentId: "e20221423",
      phone: "010650202",
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: mathLeaderUser.id, roleId: courseLeaderRole.id } },
    update: {},
    create: { userId: mathLeaderUser.id, roleId: courseLeaderRole.id },
  });

  // Physics Leader: គ្រុយ អីុខាង (KRUY Ykhang - e20240096)
  const physLeaderUser = await prisma.user.upsert({
    where: { email: "kruy.ykhang@itc.edu.kh" },
    update: {},
    create: {
      email: "kruy.ykhang@itc.edu.kh",
      passwordHash: defaultPassword,
      fullNameKh: "គ្រុយ អីុខាង",
      fullNameEn: "KRUY Ykhang",
      studentId: "e20240096",
      phone: "0968925682",
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: physLeaderUser.id, roleId: courseLeaderRole.id } },
    update: {},
    create: { userId: physLeaderUser.id, roleId: courseLeaderRole.id },
  });

  // Chemistry Leader: ខេង លីឧស្សាហ៍ (KHENG Lyussa - e20240046)
  const chemLeaderUser = await prisma.user.upsert({
    where: { email: "kheng.lyussa@itc.edu.kh" },
    update: {},
    create: {
      email: "kheng.lyussa@itc.edu.kh",
      passwordHash: defaultPassword,
      fullNameKh: "ខេង លីឧស្សាហ៍",
      fullNameEn: "KHENG Lyussa",
      studentId: "e20240046",
      phone: "0974253117",
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: chemLeaderUser.id, roleId: courseLeaderRole.id } },
    update: {},
    create: { userId: chemLeaderUser.id, roleId: courseLeaderRole.id },
  });

  // 6. Courses
  const coursesData = [
    {
      code: "PROG101",
      slug: "programming",
      titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)",
      titleEn: "Programming & Algorithmic Thinking",
      titleFr: "Programmation et Algorithmique",
      descriptionKh: "ពង្រឹងមូលដ្ឋានគ្រឹះ C, C++, Data Structures, Algorithms ដឹកនាំដោយនិស្សិតរៀមច្បង លាង ជីងហេង (I3-GTI)។",
      descriptionEn: "Mastering C/C++, memory management and practical problem solving.",
      descriptionFr: "Structures de données, pointeurs et algorithmes avancés.",
      category: "Engineering Foundation",
      icon: "Code",
      academicTerm: "2026-2027 Semester 1",
    },
    {
      code: "MATH101",
      slug: "mathematics",
      titleKh: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      titleEn: "Engineering Mathematics & Calculus",
      titleFr: "Mathématiques pour l'Ingénieur",
      descriptionKh: "Calculus, Linear Algebra, Differential Equations ដឹកនាំដោយ គឹម រតនៈ (I5-GIM)។",
      descriptionEn: "Calculus, matrices and differential equations for engineering.",
      descriptionFr: "Calcul différentiel et intégral appliqué à l'ingénierie.",
      category: "Engineering Foundation",
      icon: "Calculator",
      academicTerm: "2026-2027 Semester 1",
    },
    {
      code: "PHYS101",
      slug: "physics",
      titleKh: "រូបវិទ្យាវិស្វកម្ម (Physics)",
      titleEn: "Engineering Physics: Mechanics & Waves",
      titleFr: "Physique pour l'Ingénieur",
      descriptionKh: "មេកានិកបុរាណ ថាមពល និងចលនារលក ដឹកនាំដោយ គ្រុយ អីុខាង (I3-GIM)។",
      descriptionEn: "Classical mechanics and wave motion.",
      descriptionFr: "Mécanique générale et phénomènes ondulatoires.",
      category: "Natural Sciences",
      icon: "Atom",
      academicTerm: "2026-2027 Semester 1",
    },
    {
      code: "CHEM101",
      slug: "chemistry",
      titleKh: "គីមីវិទ្យាទូទៅ (Chemistry)",
      titleEn: "General & Engineering Chemistry",
      titleFr: "Chimie pour l'Ingénieur",
      descriptionKh: "ទម្រង់ម៉ូលេគុល និងប្រតិកម្មគីមី ដឹកនាំដោយ ខេង លីឧស្សាហ៍ (I3-GCI)។",
      descriptionEn: "Chemical kinetics and thermodynamics.",
      descriptionFr: "Cinétique et équilibres chimiques.",
      category: "Natural Sciences",
      icon: "FlaskConical",
      academicTerm: "2026-2027 Semester 1",
    },
  ];

  const coursesMap = {};
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
    coursesMap[c.slug] = course.id;
  }

  // Assign Leaders to Courses
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

  // 7. Complete Official STJ 2026-2027 Roster (41 Students)
  const officialRoster = [
    { num: 1, nameKh: "សុខ សេងលី", nameEn: "SOK SENGLY", gender: "F", studentId: "e20230969", yr: "I4", dept: "GCI", phone: "015399209", role: "គណៈកម្មាធិការសមាគមនិស្សិត" },
    { num: 2, nameKh: "ផល ដាវីត", nameEn: "PHAL David", gender: "M", studentId: "e20221334", yr: "I5", dept: "GTR", phone: "086439191", role: "ប្រធានក្រុមដឹកនាំ" },
    { num: 3, nameKh: "គ្រុយ អីុខាង", nameEn: "KRUY Ykhang", gender: "M", studentId: "e20240096", yr: "I3", dept: "GIM", phone: "0968925682", role: "ប្រធានក្រុម រូបវិទ្យា" },
    { num: 4, nameKh: "ឈិន តុលា", nameEn: "CHHIN TOLA", gender: "M", studentId: "e20240866", yr: "I3", dept: "GIM", phone: "0969720656", role: "សមាជិក" },
    { num: 5, nameKh: "ឡាន បូរិន", nameEn: "LAN BORIN", gender: "F", studentId: "e20240662", yr: "I3", dept: "GEE", phone: "070981465", role: "សមាជិក" },
    { num: 6, nameKh: "ប៉ាក់ ច័ន្ទបូរី", nameEn: "PAK CHANBOREY", gender: "M", studentId: "e20241183", yr: "I3", dept: "GCI", phone: "093271850", role: "សមាជិក" },
    { num: 7, nameKh: "វី ពិទូរ្យ", nameEn: "VY PITOU", gender: "M", studentId: "e20241143", yr: "I3", dept: "GIM", phone: "078564295", role: "សមាជិក" },
    { num: 8, nameKh: "ពៅ ជុំរតនៈ", nameEn: "PEOU CHUMRATTANAK", gender: "M", studentId: "e20250861", yr: "I2", dept: "GIM", phone: "087535899", role: "សមាជិក" },
    { num: 9, nameKh: "សុង ស្រីពេជ្រ", nameEn: "SONG SREYPICH", gender: "F", studentId: "e20250220", yr: "I2", dept: "GEE", phone: "085468553", role: "សមាជិក" },
    { num: 10, nameKh: "សុខា អ៊ីអ៊ីង", nameEn: "SOKHA EEING", gender: "F", studentId: "e20251192", yr: "I2", dept: "GIM", phone: "015691428", role: "សមាជិក" },
    { num: 11, nameKh: "តឹក ឈាវវីសាល", nameEn: "TEK CHHEAVVISAL", gender: "M", studentId: "e20251185", yr: "I2", dept: "GEE", phone: "012734562", role: "សមាជិក" },
    { num: 12, nameKh: "អេង សូអ៊ី", nameEn: "ENG SOU Y", gender: "F", studentId: "e20250642", yr: "I2", dept: "AMS", phone: "0963012386", role: "សមាជិក" },
    { num: 13, nameKh: "គឹម រតនៈ", nameEn: "KIM Ratanak", gender: "M", studentId: "e20221423", yr: "I5", dept: "GIM", phone: "010650202", role: "ប្រធានក្រុម គណិតវិទ្យា" },
    { num: 14, nameKh: "ប៊ុន សុខបញ្ញា", nameEn: "BUN Sokpanha", gender: "M", studentId: "e20221678", yr: "I5", dept: "GCI", phone: "0767821209", role: "សមាជិក" },
    { num: 15, nameKh: "វង្ស ច័ន្ទវង្សា", nameEn: "VONG Sa", gender: "M", studentId: "e20241028", yr: "I3", dept: "GAR", phone: "016594999", role: "សមាជិក" },
    { num: 16, nameKh: "ជាតិ វិសាល", nameEn: "CHEAT Visal", gender: "M", studentId: "e20250175", yr: "I2", dept: "GAR", phone: "017724617", role: "សមាជិក" },
    { num: 17, nameKh: "អន សុជាតិ", nameEn: "ORN Socheat", gender: "M", studentId: "e20251044", yr: "I2", dept: "GEE", phone: "0976442857", role: "សមាជិក" },
    { num: 18, nameKh: "ម៉ឹង ហាក់", nameEn: "MOEUNG Hak", gender: "M", studentId: "e20251246", yr: "I2", dept: "GAR", phone: "0968445445", role: "សមាជិក" },
    { num: 19, nameKh: "សុំ សុធាវី", nameEn: "SOM Sotheavy", gender: "F", studentId: "e20250345", yr: "I2", dept: "GCA", phone: "011703261", role: "សមាជិក" },
    { num: 20, nameKh: "ហង់ សុជាតា", nameEn: "HANG Socheata", gender: "F", studentId: "e20250687", yr: "I2", dept: "GCA", phone: "016735656", role: "សមាជិក" },
    { num: 21, nameKh: "ជាលី អមរិន្ទ", nameEn: "CHEALY Amrin", gender: "M", studentId: "e20250258", yr: "I2", dept: "GIM", phone: "077606122", role: "សមាជិក" },
    { num: 22, nameKh: "ឈុំ បញ្ញា", nameEn: "CHHUM Panha", gender: "M", studentId: "e20251290", yr: "I2", dept: "AMS", phone: "068620824", role: "សមាជិក" },
    { num: 24, nameKh: "លៀងលី សុខឡេង", nameEn: "LEANGLY Sokleng", gender: "M", studentId: "e20241375", yr: "I3", dept: "GEE", phone: "0887045133", role: "សមាជិក" },
    { num: 25, nameKh: "លាង ជីងហេង", nameEn: "LEANG JINGHENG", gender: "M", studentId: "e20240704", yr: "I3", dept: "GTI", phone: "0976355500", role: "ប្រធានក្រុម Programming" },
    { num: 26, nameKh: "ឃន វិទ្យ័រ", nameEn: "KHORN VICTOR", gender: "M", studentId: "e20230078", yr: "I4", dept: "GIC", phone: "081323442", role: "សមាជិក" },
    { num: 27, nameKh: "ប៊ិន បុណ្ណាកា", nameEn: "PEN BUNNAKA", gender: "M", studentId: "e20230757", yr: "I4", dept: "GIC", phone: "0966677569", role: "សមាជិក" },
    { num: 28, nameKh: "ស៊ឹង វិច្ឆិកា", nameEn: "SOUNG VICHKA", gender: "M", studentId: "e20240672", yr: "I3", dept: "GIC", phone: "010814529", role: "សមាជិក" },
    { num: 29, nameKh: "សេង ម៉ិញហាវ", nameEn: "SENG MINGHAO", gender: "M", studentId: "e20240232", yr: "I3", dept: "GIC", phone: "017968212", role: "សមាជិក" },
    { num: 30, nameKh: "ណាំ ម៉េងហួត", nameEn: "NAM MENGHOUT", gender: "M", studentId: "e20250475", yr: "I2", dept: "GIC", phone: "099998951", role: "សមាជិក" },
    { num: 31, nameKh: "ចៃ ជីជូ", nameEn: "CHAI CHICHOU", gender: "M", studentId: "e20250731", yr: "I2", dept: "AMS", phone: "090249820", role: "សមាជិក" },
    { num: 32, nameKh: "ហាក់ ដូនីឡា", nameEn: "HAK DONYLA", gender: "M", studentId: "e20251399", yr: "I2", dept: "GIC", phone: "089926734", role: "សមាជិក" },
    { num: 33, nameKh: "ពៀក ប្រុសម៉ៅ", nameEn: "PEAK BROSMAO", gender: "M", studentId: "e20251455", yr: "I2", dept: "GIC", phone: "099661460", role: "សមាជិក" },
    { num: 34, nameKh: "ចំរើន ដេន", nameEn: "CHAMROEN DEN", gender: "M", studentId: "e20250414", yr: "I2", dept: "GIC", phone: "0963221116", role: "សមាជិក" },
    { num: 35, nameKh: "ខេង លីឧស្សាហ៍", nameEn: "KHENG Lyussa", gender: "F", studentId: "e20240046", yr: "I3", dept: "GCI", phone: "0974253117", role: "ប្រធានក្រុម គីមីវិទ្យា" },
    { num: 37, nameKh: "ឯល មូហាំម៉ាត់សាហ្វី", nameEn: "EL Muhammadshafi", gender: "M", studentId: "e20240945", yr: "I3", dept: "GAR", phone: "093696794", role: "សមាជិក" },
    { num: 38, nameKh: "ខឿន ធារី", nameEn: "KHOEUN Theary", gender: "F", studentId: "e20240561", yr: "I3", dept: "GCI", phone: "069944087", role: "សមាជិក" },
    { num: 39, nameKh: "ហាប់ ស៊ីឈាង", nameEn: "HAB Sychheang", gender: "M", studentId: "e20240670", yr: "I3", dept: "GIM", phone: "093202727", role: "សមាជិក" },
    { num: 40, nameKh: "ឌិន ម៉េងហុង", nameEn: "DIN Menghong", gender: "M", studentId: "e20241214", yr: "I3", dept: "AMS", phone: "081687375", role: "សមាជិក" },
    { num: 41, nameKh: "ហួត សំណាង", nameEn: "HOUT Samnang", gender: "M", studentId: "e20240124", yr: "I3", dept: "GCI", phone: "0966224473", role: "សមាជិក" },
  ];

  const createdMembers = [];
  for (const m of officialRoster) {
    const memberId = `STJ${String(m.num).padStart(3, "0")}`;
    const deptId = departmentsMap[m.dept] || departmentsMap["GIC"];
    const yrId = academicYearsMap[m.yr] || academicYearsMap["I2"];
    const memberEmail = `${m.nameEn.toLowerCase().replace(/\s+/g, ".")}@itc.edu.kh`;

    const member = await prisma.member.upsert({
      where: { memberId },
      update: {
        fullNameKh: m.nameKh,
        fullNameEn: m.nameEn,
        studentId: m.studentId,
        email: memberEmail,
        phone: m.phone,
        gender: m.gender,
        departmentId: deptId,
        academicYearId: yrId,
        notes: `តួនាទី៖ ${m.role}`,
      },
      create: {
        memberId,
        studentId: m.studentId,
        fullNameKh: m.nameKh,
        fullNameEn: m.nameEn,
        email: memberEmail,
        phone: m.phone,
        gender: m.gender,
        departmentId: deptId,
        academicYearId: yrId,
        notes: `តួនាទី៖ ${m.role}`,
        status: "ACTIVE",
      },
    });
    createdMembers.push(member);

    // Create / Link User Account for Member Self-Service Portal
    const userAccount = await prisma.user.upsert({
      where: { email: memberEmail },
      update: {
        memberRecordId: member.id,
      },
      create: {
        email: memberEmail,
        passwordHash: defaultPassword,
        fullNameKh: m.nameKh,
        fullNameEn: m.nameEn,
        studentId: m.studentId,
        phone: m.phone,
        gender: m.gender,
        status: "ACTIVE",
        memberRecordId: member.id,
      },
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: userAccount.id, roleId: memberRole.id } },
      update: {},
      create: { userId: userAccount.id, roleId: memberRole.id },
    });

    // Enroll in courses
    await prisma.courseEnrollment.upsert({
      where: { courseId_memberId: { courseId: coursesMap["programming"], memberId: member.id } },
      update: {},
      create: { courseId: coursesMap["programming"], memberId: member.id },
    });

    await prisma.courseEnrollment.upsert({
      where: { courseId_memberId: { courseId: coursesMap["mathematics"], memberId: member.id } },
      update: {},
      create: { courseId: coursesMap["mathematics"], memberId: member.id },
    });
  }

  // 8. Teaching Session & Sample Attendance for Week 1
  const session1 = await prisma.teachingSession.upsert({
    where: { id: "session-prog-week-1" },
    update: {},
    create: {
      id: "session-prog-week-1",
      courseId: coursesMap["programming"],
      title: "សប្តាហ៍ទី១៖ សេចក្តីផ្តើមអំពី C++ និង Pointer Mechanics",
      sessionDate: new Date("2026-10-15T08:00:00Z"),
      startTime: "08:00",
      endTime: "10:30",
      room: "បន្ទប់ A-204, ITC Campus 1",
      status: "COMPLETED",
      createdById: adminUser.id,
    },
  });

  const statuses = ["PRESENT", "PRESENT", "PRESENT", "LATE", "PRESENT", "PRESENT", "EXCUSED", "PRESENT"];
  for (let i = 0; i < createdMembers.length; i++) {
    const st = statuses[i % statuses.length];
    await prisma.attendanceRecord.upsert({
      where: {
        sessionId_memberId: {
          sessionId: session1.id,
          memberId: createdMembers[i].id,
        },
      },
      update: {
        status: st,
      },
      create: {
        sessionId: session1.id,
        memberId: createdMembers[i].id,
        status: st,
        markedById: adminUser.id,
        remarks: st === "EXCUSED" ? "សុំច្បាប់ប្រឡងពាក់កណ្តាលឆមាស" : null,
      },
    });
  }

  // 9. Public Share Link for Week 1
  await prisma.shareLink.upsert({
    where: { token: "stj-official-2027" },
    update: {},
    create: {
      token: "stj-official-2027",
      tokenHash: "sha256_hash_stj_official_2027",
      courseId: coursesMap["programming"],
      sessionId: session1.id,
      title: "របាយការណ៍វត្តមាន STJ ឆ្នាំសិក្សា ២០២៦-២០២៧",
      showStats: true,
      createdById: progLeaderUser.id,
    },
  });

  // 10. System Settings
  const settings = [
    { key: "org_name", value: "Senior Teaching Junior (STJ)" },
    { key: "institution", value: "Institute of Technology of Cambodia (ITC)" },
    { key: "academic_year_current", value: "2026-2027" },
    { key: "semester_current", value: "Semester 1" },
    { key: "attendance_warning_threshold", value: "75" },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log(`STJ 2026-2027 Database Seed completed with ${createdMembers.length} official members.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
