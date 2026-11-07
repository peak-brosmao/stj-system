const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prismaBackend = new PrismaClient({ datasources: { db: { url: 'file:' + path.resolve('backend/database/stj.db') } } });

async function testBackendReport() {
  const members = await prismaBackend.$queryRawUnsafe(`
    SELECT m.id, m.member_id as memberId, m.student_id as studentId, m.full_name_kh as nameKh, m.full_name_en as nameEn,
           d.code as dept, y.code as yr
    FROM members m
    LEFT JOIN departments d ON m.department_id = d.id
    LEFT JOIN academic_years y ON m.academic_year_id = y.id
    WHERE m.status = 'ACTIVE'
    ORDER BY m.member_id ASC
  `);

  const enrollments = await prismaBackend.$queryRawUnsafe(`
    SELECT ce.member_id, c.code as course_code
    FROM course_enrollments ce
    JOIN courses c ON ce.course_id = c.id OR ce.course_id = c.code
  `);

  const memberCoursesMap = new Map();
  for (const e of enrollments) {
    if (!memberCoursesMap.has(e.member_id)) memberCoursesMap.set(e.member_id, []);
    memberCoursesMap.get(e.member_id).push(e.course_code);
  }

  const sessions = await prismaBackend.$queryRawUnsafe(`
    SELECT ts.id, ts.title, ts.session_date, c.code as course_code
    FROM teaching_sessions ts
    JOIN courses c ON ts.course_id = c.id OR ts.course_id = c.code
    WHERE ts.status != 'CANCELLED'
  `);
  console.log('Backend active sessions:', sessions.length);
  sessions.forEach(s => console.log(' -', s.id, s.course_code, s.title));

  const attendances = await prismaBackend.$queryRawUnsafe(`
    SELECT session_id, member_id, status FROM attendance_records
  `);

  const attMap = new Map();
  for (const a of attendances) {
    attMap.set(a.session_id + '_' + a.member_id, a.status);
  }

  const testIds = ['STJ001', 'STJ002', 'STJ003', 'STJ008', 'STJ017', 'STJ024', 'STJ025', 'STJ031', 'STJ035', 'STJ036'];
  console.log('\nReport items from Backend DB:');
  for (const m of members.filter(m => testIds.includes(m.memberId))) {
    const isExecutive = m.memberId === 'STJ001' || m.memberId === 'STJ002';
    const courses = memberCoursesMap.get(m.id) || [];

    if (isExecutive) {
      console.log(`- ${m.memberId} (${m.nameEn}): EXECUTIVE | Total: 0 | Status: ថ្នាក់ដឹកនាំ`);
      continue;
    }

    const memberSessions = sessions.filter(s => courses.includes(s.course_code));
    const totalExpected = memberSessions.length;

    let present = 0, late = 0, absent = 0, excused = 0;
    for (const s of memberSessions) {
      const st = attMap.get(s.id + '_' + m.id);
      if (st === 'PRESENT') present++;
      else if (st === 'LATE') late++;
      else if (st === 'EXCUSED') excused++;
      else absent++;
    }

    const eligible = totalExpected - excused;
    const rate = totalExpected > 0 ? (eligible > 0 ? Math.round(((present + late * 0.5) / eligible) * 100) : 100) : 0;
    console.log(`- ${m.memberId} (${m.nameEn}) Courses: [${courses.join(', ')}] | Present: ${present}, Late: ${late}, Abs: ${absent}, Exc: ${excused} | Total: ${totalExpected} | Rate: ${rate}%`);
  }
}

testBackendReport().catch(console.error).finally(() => prismaBackend.$disconnect());

