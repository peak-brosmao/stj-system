const fs = require("fs");
const path = require("path");

function fixFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  for (const [target, repl] of replacements) {
    content = content.replace(target, repl);
  }
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Fixed:", filePath);
}

// 1. portal/attendance/page.tsx
const attPath = path.join(__dirname, "../src/app/portal/attendance/page.tsx");
let att = fs.readFileSync(attPath, "utf8");
att = att.replace(
  /\?{20,}\s*\(Lessons set by your Leader Team\)/,
  "មេរៀនដែលបានរៀបចំដោយប្រធានក្រុម (Lessons set by your Leader Team)"
);
att = att.replace(
  /\?{20,}\s*\?{20,}\s*\(No lessons have been/,
  "ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ។ មេរៀននឹងបង្ហាញនៅទីនេះភ្លាមៗនៅពេល Leader បានបង្កើតវា។ (No lessons have been"
);
att = att.replace(/\?{10,}\s*\(Upcoming\)/, "មេរៀនខាងមុខ (Upcoming)");
att = att.replace(/\?{10,}\s*\(Not taught yet\)/, "មិនទាន់បង្រៀន (Not taught yet)");
att = att.replace(/\?{15,}\s*\(Awaiting attendance\)/, "មេរៀនរង់ចាំការស្រង់វត្តមាន (Awaiting attendance)");
att = att.replace(/\?{15,}\s*\(Not marked yet\)/, "មិនទាន់ស្រង់វត្តមាន (Not marked yet)");
att = att.replace(/\?{20,}\s*\(No attendance recorded yet\)/, "ពុំទាន់មានកំណត់ត្រាវត្តមានដែលបានកត់ត្រានៅឡើយទេ (No attendance recorded yet)");
att = att.replace(/\uFFFD/g, "•");
fs.writeFileSync(attPath, att, "utf8");
console.log("Fixed attendance page.");

// 2. portal/schedule/page.tsx
const schedPath = path.join(__dirname, "../src/app/portal/schedule/page.tsx");
let sched = fs.readFileSync(schedPath, "utf8");
sched = sched.replace(/\?{10,}\s*\(Lesson Schedule\)/, "កាលវិភាគមេរៀន (Lesson Schedule)");
sched = sched.replace(/\?{20,}\s*\(Shows only lessons created by your Leader Team\.\)/, "បង្ហាញតែមេរៀនដែលប្រធានក្រុមបានរៀបចំ (Shows only lessons created by your Leader Team.)");
sched = sched.replace(/\?{10,}\s*\(Upcoming\)/, "មេរៀនខាងមុខ (Upcoming)");
sched = sched.replace(/\?{20,}\s*\(No lessons created yet\.\)/, "ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ (No lessons created yet.)");
sched = sched.replace(/\?{10,}\s*\(Not taught yet\)/, "មិនទាន់បង្រៀន (Not taught yet)");
sched = sched.replace(/\?{15,}\s*\(Awaiting attendance\)/, "មេរៀនរង់ចាំការស្រង់វត្តមាន (Awaiting attendance)");
sched = sched.replace(/\?{15,}\s*\(Not marked yet\)/, "មិនទាន់ស្រង់វត្តមាន (Not marked yet)");
sched = sched.replace(/\?{10,}\.\.\./g, "កំពុងដំណើរការ...");
sched = sched.replace(/\uFFFD/g, "•");
fs.writeFileSync(schedPath, sched, "utf8");
console.log("Fixed schedule page.");

// 3. portal/courses/[courseId]/page.tsx
const courseDetailPath = path.join(__dirname, "../src/app/portal/courses/[courseId]/page.tsx");
let cdp = fs.readFileSync(courseDetailPath, "utf8");
cdp = cdp.replace(/\?{10,}\s*\(Scheduled\)/, "តាមកាលវិភាគ (Scheduled)");
cdp = cdp.replace(/\?{10,}\s*\(In progress\)/, "កំពុងបង្រៀន (In progress)");
cdp = cdp.replace(/\?{10,}\s*\(Completed\)/, "បានបញ្ចប់ (Completed)");
cdp = cdp.replace(/\?{8,}\s*\(Cancelled\)/, "បានលុបចោល (Cancelled)");
cdp = cdp.replace(/\?{10,}\s*\(Back\)/, "ថយក្រោយ (Back)");
cdp = cdp.replace(/\?{10,}\.\.\./, "កំពុងដំណើរការ...");
cdp = cdp.replace(/\?{15,}\s*\(Course not found\.\)/, "រកមិនឃើញមុខវិជ្ជាឡើយ (Course not found.)");
cdp = cdp.replace(/\?{15,}\s*\(Course Leaders\)/, "ប្រធានក្រុមបង្រៀន (Course Leaders)");
cdp = cdp.replace(/\?{10,}\s*\(Not assigned yet\.\)/, "ពុំទាន់បានចាត់តាំង (Not assigned yet.)");
cdp = cdp.replace(/\?{5}\s*\(Lessons\)/, "មេរៀន (Lessons)");
cdp = cdp.replace(/\?{20,}\s*\(No lessons created yet\.\)/, "ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ (No lessons created yet.)");
cdp = cdp.replace(/\?{15,}\s*\(Team\)/, "ក្រុមគ្រូបង្រៀន (Team)");
cdp = cdp.replace(/\uFFFD/g, "•");
fs.writeFileSync(courseDetailPath, cdp, "utf8");
console.log("Fixed courses detail page.");

// 4. portal/profile/edit/page.tsx
const editProfilePath = path.join(__dirname, "../src/app/portal/profile/edit/page.tsx");
let ep = fs.readFileSync(editProfilePath, "utf8");
ep = ep.replace('placeholder="?. ???????????"', 'placeholder="ឧ. ភ្នំពេញ"');
fs.writeFileSync(editProfilePath, ep, "utf8");
console.log("Fixed profile edit page.");

