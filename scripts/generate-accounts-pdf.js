const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching STJ official users & members from database...");

  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
      member: {
        include: {
          department: true,
          academicYear: true,
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: [
      { studentId: "asc" },
    ],
  });

  console.log(`Retrieved ${users.length} user accounts.`);

  // Categorize accounts
  const executiveUsers = [];
  const leaderUsers = [];
  const physicsUsers = [];
  const mathUsers = [];
  const progUsers = [];
  const chemUsers = [];

  for (const u of users) {
    const roleNames = u.userRoles.map((ur) => ur.role.name);
    const m = u.member;
    const memberId = m?.memberId || "STJ---";
    const course = m?.enrollments?.[0]?.course;
    const courseCode = course?.code || (m?.notes?.includes("PROG101") ? "PROG101" : m?.notes?.includes("MATH101") ? "MATH101" : m?.notes?.includes("PHYS101") ? "PHYS101" : m?.notes?.includes("CHEM101") ? "CHEM101" : "EXECUTIVE");

    const defaultPassword = `${u.studentId.toLowerCase()}@ITC!`;

    const accountData = {
      memberId,
      studentId: u.studentId,
      fullNameKh: u.fullNameKh || m?.fullNameKh || "",
      fullNameEn: u.fullNameEn || m?.fullNameEn || "",
      email: u.email || `${u.studentId}@itc.edu.kh`,
      defaultPassword,
      dept: m?.department?.code || "-",
      year: m?.academicYear?.code || "-",
      phone: u.phone || m?.phone || "-",
      roleNames,
      courseCode,
      courseTitle: course?.titleKh || (courseCode === "EXECUTIVE" ? "គណៈដឹកនាំរួម" : courseCode),
      notes: m?.notes || "",
    };

    if (roleNames.includes("STJ_PRESIDENT") || roleNames.includes("STUDENT_ASSOCIATION") || courseCode === "EXECUTIVE") {
      executiveUsers.push(accountData);
    } else if (roleNames.includes("COURSE_LEADER")) {
      leaderUsers.push(accountData);
    } else if (courseCode === "PHYS101") {
      physicsUsers.push(accountData);
    } else if (courseCode === "MATH101") {
      mathUsers.push(accountData);
    } else if (courseCode === "PROG101") {
      progUsers.push(accountData);
    } else if (courseCode === "CHEM101") {
      chemUsers.push(accountData);
    } else {
      // Fallback
      physicsUsers.push(accountData);
    }
  }

  // Sort function helper by member ID
  const sortById = (a, b) => a.memberId.localeCompare(b.memberId);
  executiveUsers.sort(sortById);
  leaderUsers.sort(sortById);
  physicsUsers.sort(sortById);
  mathUsers.sort(sortById);
  progUsers.sort(sortById);
  chemUsers.sort(sortById);

  function renderTableRows(list, defaultPortal) {
    return list
      .map(
        (u, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold; color: #475569;">${idx + 1}</td>
          <td style="text-align: center;"><span class="badge badge-stj">${u.memberId}</span></td>
          <td>
            <div style="font-weight: 700; color: #0f172a;">${u.fullNameKh}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">${u.fullNameEn}</div>
          </td>
          <td style="text-align: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1e40af;">
            ${u.studentId}
          </td>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #334155;">
            ${u.email}
          </td>
          <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #b91c1c; background-color: #fef2f2; text-align: center; border-radius: 4px; padding: 4px 6px;">
            <code>${u.defaultPassword}</code>
          </td>
          <td style="text-align: center;">
            <span class="badge badge-dept">${u.dept} - ${u.year}</span>
          </td>
          <td style="text-align: center; font-size: 11px; font-family: monospace;">
            ${u.phone}
          </td>
          <td style="text-align: center;">
            <span class="badge badge-portal">${defaultPortal}</span>
          </td>
        </tr>
      `
      )
      .join("");
  }

  const html = `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>STJ System - Login Credentials & Accounts (2026-2027)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm 14mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Kantumruy Pro', 'Battambang', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      background: #ffffff;
      font-size: 11.5px;
      line-height: 1.45;
    }
    .header {
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-box {
      width: 54px;
      height: 54px;
      background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%);
      color: #ffffff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .logo-box .stj { font-size: 18px; line-height: 1; letter-spacing: 0.5px; }
    .logo-box .itc { font-size: 9px; opacity: 0.9; margin-top: 2px; }
    .header-text h1 {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: -0.2px;
    }
    .header-text h2 {
      margin: 2px 0 0 0;
      font-size: 13px;
      font-weight: 700;
      color: #0369a1;
    }
    .header-text p {
      margin: 2px 0 0 0;
      font-size: 10.5px;
      color: #64748b;
    }
    .header-right {
      text-align: right;
      font-size: 10px;
      color: #475569;
    }
    .header-right .tag {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #bfdbfe;
      margin-bottom: 3px;
    }

    .instructions-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0284c7;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .instructions-card h3 {
      margin: 0 0 6px 0;
      font-size: 12px;
      font-weight: 700;
      color: #0369a1;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .instructions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      font-size: 10.5px;
    }
    .instruction-item {
      background: #ffffff;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .instruction-item b {
      color: #0f172a;
      display: block;
      margin-bottom: 2px;
    }

    .section-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #1e3a8a;
      background: #f1f5f9;
      padding: 6px 10px;
      border-radius: 6px;
      margin: 14px 0 8px 0;
      border-left: 3px solid #1e3a8a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title .count {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10.5px;
    }
    th {
      background: #1e293b;
      color: #ffffff;
      padding: 6px 6px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    td {
      padding: 5px 6px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    tr:hover td {
      background-color: #f1f5f9;
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 700;
    }
    .badge-stj {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
      font-family: 'JetBrains Mono', monospace;
    }
    .badge-dept {
      background: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #e9d5ff;
    }
    .badge-portal {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      font-weight: 600;
    }

    .page-break {
      page-break-before: always;
    }

    .footer {
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <div class="logo-box">
        <span class="stj">STJ</span>
        <span class="itc">ITC</span>
      </div>
      <div class="header-text">
        <h1>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (Institute of Technology of Cambodia)</h1>
        <h2>កម្មវិធីបង្រៀននិស្សិតប្អូន STJ (Senior Teaching Junior) • ឆ្នាំសិក្សា ២០២៦-២០២៧</h2>
        <p>បញ្ជីគណនី និងលេខសម្ងាត់សម្រាប់ចូលប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រង STJ (System Login Credentials)</p>
      </div>
    </div>
    <div class="header-right">
      <div class="tag">ផ្លូវការ • OFFICIAL</div><br>
      <span>កាលបរិច្ឆេទ៖ ០៦ វិច្ឆិកា ២០២៦</span><br>
      <span>ចំនួនសមាជិក៖ <b>៤០ នាក់</b></span>
    </div>
  </div>

  <!-- INSTRUCTIONS CARD -->
  <div class="instructions-card">
    <h3>📌 ការណែនាំអំពីការចូលប្រើប្រាស់ប្រព័ន្ធ (How to Sign In)</h3>
    <div class="instructions-grid">
      <div class="instruction-item">
        <b>🌐 អាសយដ្ឋានប្រព័ន្ធ (Login URL)</b>
        <span>Production: <a href="https://stj.peakbrosmao.me/auth/login" style="color: #0284c7; text-decoration: none; font-weight: bold;">stj.peakbrosmao.me</a></span><br>
        <span>Local Dev: <code>http://localhost:3000/auth/login</code></span>
      </div>
      <div class="instruction-item">
        <b>👤 ឈ្មោះអ្នកប្រើប្រាស់ (Username)</b>
        <span>ប្រើ <b>Student ID</b> (ឧ. <code>e20221334</code>)</span><br>
        <span>ឬ Institutional Email (<code>e20221334@itc.edu.kh</code>)</span>
      </div>
      <div class="instruction-item">
        <b>🔑 លេខសម្ងាត់លំនាំដើម (Default Password)</b>
        <span style="color: #b91c1c; font-weight: bold;">[student_id]@ITC!</span><br>
        <span>(ឧទាហរណ៍៖ <code>e20221334@ITC!</code>)</span>
      </div>
    </div>
    <div style="margin-top: 6px; font-size: 10px; color: #475569;">
      🔒 <b>សុវត្ថិភាព៖</b> លេខសម្ងាត់លំនាំដើមត្រូវបានកំណត់តាមទម្រង់អក្សរតូច Student ID បូក <code>@ITC!</code>។ សូមប្តូរលេខសម្ងាត់ផ្ទាល់ខ្លួនក្រោយពេលចូលប្រើលើកដំបូង។
    </div>
  </div>

  <!-- SECTION 1: EXECUTIVE LEADERSHIP -->
  <div class="section-title">
    <span>១. ថ្នាក់ដឹកនាំកំពូល និងតំណាងសមាគមនិស្សិត (Executive Leadership & Student Association)</span>
    <span class="count">២ គណនី • System Portal (/system)</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">ល.រ</th>
        <th style="width: 55px; text-align: center;">កូដ STJ</th>
        <th style="width: 140px;">គោត្តនាម-នាម</th>
        <th style="width: 75px; text-align: center;">Student ID</th>
        <th style="width: 155px;">អ៊ីមែលស្ថាប័ន (ITC Email)</th>
        <th style="width: 105px; text-align: center;">លេខសម្ងាត់ (Password)</th>
        <th style="width: 65px; text-align: center;">ដេប៉ាតឺម៉ង់</th>
        <th style="width: 75px; text-align: center;">ទូរស័ព្ទ</th>
        <th style="width: 75px; text-align: center;">Portal</th>
      </tr>
    </thead>
    <tbody>
      ${renderTableRows(executiveUsers, "System / Admin")}
    </tbody>
  </table>

  <!-- SECTION 2: COURSE LEADERS -->
  <div class="section-title">
    <span>២. ប្រធានក្រុមដឹកនាំមុខវិជ្ជាទាំង ៤ (Course Team Leaders)</span>
    <span class="count">៤ គណនី • Leader Portal (/leader)</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">ល.រ</th>
        <th style="width: 55px; text-align: center;">កូដ STJ</th>
        <th style="width: 140px;">គោត្តនាម-នាម</th>
        <th style="width: 75px; text-align: center;">Student ID</th>
        <th style="width: 155px;">អ៊ីមែលស្ថាប័ន (ITC Email)</th>
        <th style="width: 105px; text-align: center;">លេខសម្ងាត់ (Password)</th>
        <th style="width: 65px; text-align: center;">ដេប៉ាតឺម៉ង់</th>
        <th style="width: 75px; text-align: center;">ទូរស័ព្ទ</th>
        <th style="width: 75px; text-align: center;">Portal</th>
      </tr>
    </thead>
    <tbody>
      ${renderTableRows(leaderUsers, "Leader / Tutors")}
    </tbody>
  </table>

  <!-- SECTION 3: PHYSICS TUTORS -->
  <div class="section-title">
    <span>៣. ក្រុមគ្រូបង្រៀនស្ម័គ្រចិត្ត រូបវិទ្យាវិស្វកម្ម (Physics Team - PHYS101)</span>
    <span class="count">${physicsUsers.length} គណនី • Tutor Portal (/portal)</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">ល.រ</th>
        <th style="width: 55px; text-align: center;">កូដ STJ</th>
        <th style="width: 140px;">គោត្តនាម-នាម</th>
        <th style="width: 75px; text-align: center;">Student ID</th>
        <th style="width: 155px;">អ៊ីមែលស្ថាប័ន (ITC Email)</th>
        <th style="width: 105px; text-align: center;">លេខសម្ងាត់ (Password)</th>
        <th style="width: 65px; text-align: center;">ដេប៉ាតឺម៉ង់</th>
        <th style="width: 75px; text-align: center;">ទូរស័ព្ទ</th>
        <th style="width: 75px; text-align: center;">Portal</th>
      </tr>
    </thead>
    <tbody>
      ${renderTableRows(physicsUsers, "Member / Tutor")}
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- HEADER PAGE 2 -->
  <div class="header">
    <div class="header-left">
      <div class="logo-box">
        <span class="stj">STJ</span>
        <span class="itc">ITC</span>
      </div>
      <div class="header-text">
        <h1>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា • កម្មវិធី STJ ២០២៦-២០២៧</h1>
        <h2>បញ្ជីគណនី និងលេខសម្ងាត់សម្រាប់ចូលប្រើប្រាស់ប្រព័ន្ធ (ទំព័រទី ២)</h2>
      </div>
    </div>
    <div class="header-right">
      <div class="tag">ផ្លូវការ • OFFICIAL</div><br>
      <span>stj.peakbrosmao.me</span>
    </div>
  </div>

  <!-- SECTION 4: MATHEMATICS TUTORS -->
  <div class="section-title">
    <span>៤. ក្រុមគ្រូបង្រៀនស្ម័គ្រចិត្ត គណិតវិទ្យាវិស្វកម្ម (Mathematics Team - MATH101)</span>
    <span class="count">${mathUsers.length} គណនី • Tutor Portal (/portal)</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">ល.រ</th>
        <th style="width: 55px; text-align: center;">កូដ STJ</th>
        <th style="width: 140px;">គោត្តនាម-នាម</th>
        <th style="width: 75px; text-align: center;">Student ID</th>
        <th style="width: 155px;">អ៊ីមែលស្ថាប័ន (ITC Email)</th>
        <th style="width: 105px; text-align: center;">លេខសម្ងាត់ (Password)</th>
        <th style="width: 65px; text-align: center;">ដេប៉ាតឺម៉ង់</th>
        <th style="width: 75px; text-align: center;">ទូរស័ព្ទ</th>
        <th style="width: 75px; text-align: center;">Portal</th>
      </tr>
    </thead>
    <tbody>
      ${renderTableRows(mathUsers, "Member / Tutor")}
    </tbody>
  </table>

  <!-- SECTION 5: PROGRAMMING TUTORS -->
  <div class="section-title">
    <span>៥. ក្រុមគ្រូបង្រៀនស្ម័គ្រចិត្ត ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming Team - PROG101)</span>
    <span class="count">${progUsers.length} គណនី • Tutor Portal (/portal)</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">ល.រ</th>
        <th style="width: 55px; text-align: center;">កូដ STJ</th>
        <th style="width: 140px;">គោត្តនាម-នាម</th>
        <th style="width: 75px; text-align: center;">Student ID</th>
        <th style="width: 155px;">អ៊ីមែលស្ថាប័ន (ITC Email)</th>
        <th style="width: 105px; text-align: center;">លេខសម្ងាត់ (Password)</th>
        <th style="width: 65px; text-align: center;">ដេប៉ាតឺម៉ង់</th>
        <th style="width: 75px; text-align: center;">ទូរស័ព្ទ</th>
        <th style="width: 75px; text-align: center;">Portal</th>
      </tr>
    </thead>
    <tbody>
      ${renderTableRows(progUsers, "Member / Tutor")}
    </tbody>
  </table>

  <!-- SECTION 6: CHEMISTRY TUTORS -->
  <div class="section-title">
    <span>៦. ក្រុមគ្រូបង្រៀនស្ម័គ្រចិត្ត គីមីវិទ្យាទូទៅ (Chemistry Team - CHEM101)</span>
    <span class="count">${chemUsers.length} គណនី • Tutor Portal (/portal)</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">ល.រ</th>
        <th style="width: 55px; text-align: center;">កូដ STJ</th>
        <th style="width: 140px;">គោត្តនាម-នាម</th>
        <th style="width: 75px; text-align: center;">Student ID</th>
        <th style="width: 155px;">អ៊ីមែលស្ថាប័ន (ITC Email)</th>
        <th style="width: 105px; text-align: center;">លេខសម្ងាត់ (Password)</th>
        <th style="width: 65px; text-align: center;">ដេប៉ាតឺម៉ង់</th>
        <th style="width: 75px; text-align: center;">ទូរស័ព្ទ</th>
        <th style="width: 75px; text-align: center;">Portal</th>
      </tr>
    </thead>
    <tbody>
      ${renderTableRows(chemUsers, "Member / Tutor")}
    </tbody>
  </table>

  <!-- FOOTER -->
  <div class="footer">
    <div><b>Senior Teaching Junior (STJ)</b> — Institute of Technology of Cambodia (ITC)</div>
    <div>ប្រព័ន្ធគ្រប់គ្រងវត្តមាន និងសកម្មភាពបង្រៀន • stj.peakbrosmao.me</div>
  </div>

</body>
</html>`;

  // Write HTML file to public directory
  const htmlPath = path.resolve("public/STJ_User_Accounts_Credentials.html");
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log(`Saved HTML report to: ${htmlPath}`);

  // Generate PDF via Chrome headless
  const pdfRootPath = path.resolve("STJ_User_Accounts_Credentials.pdf");
  const pdfPublicPath = path.resolve("public/STJ_User_Accounts_Credentials.pdf");
  const artifactDir = "C:\\Users\\PEAK BROSMAO\\.gemini\\antigravity\\brain\\229abe5b-323d-4755-9c1c-7a7f259f5d1c";
  const pdfArtifactPath = path.join(artifactDir, "STJ_User_Accounts_Credentials.pdf");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const fileUri = `file:///${htmlPath.replace(/\\/g, "/")}`;

  console.log(`Generating PDF using: ${browserPath}`);
  const cmd = `"${browserPath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfRootPath}" "${fileUri}"`;

  try {
    execSync(cmd, { stdio: "inherit" });
    if (fs.existsSync(pdfRootPath)) {
      const stats = fs.statSync(pdfRootPath);
      console.log(`PDF successfully created at ${pdfRootPath} (${(stats.size / 1024).toFixed(1)} KB)`);

      // Copy to public folder
      fs.copyFileSync(pdfRootPath, pdfPublicPath);
      console.log(`Copied PDF to: ${pdfPublicPath}`);

      // Copy to artifacts folder
      if (fs.existsSync(artifactDir)) {
        fs.copyFileSync(pdfRootPath, pdfArtifactPath);
        console.log(`Copied PDF to artifacts: ${pdfArtifactPath}`);
      }
    } else {
      console.error("PDF file was not found after execution.");
    }
  } catch (err) {
    console.error("Error executing browser PDF print:", err);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
