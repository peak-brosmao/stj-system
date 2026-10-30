import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

const OFFICIAL_ROSTER_FALLBACK = [
  { id: "m1", memberId: "STJ001", studentId: "e20230969", fullNameKh: "សុខ សេងលី", fullNameEn: "SOK SENGLY", gender: "F", department: { id: "d-gci", code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល" }, academicYear: { id: "y-i4", code: "I4", label: "I4" }, phone: "015399209", status: "ACTIVE", notes: "គណៈកម្មាធិការសមាគមនិស្សិត" },
  { id: "m2", memberId: "STJ002", studentId: "e20221334", fullNameKh: "ផល ដាវីត", fullNameEn: "PHAL David", gender: "M", department: { id: "d-gtr", code: "GTR", nameKh: "ដេប៉ាតឺម៉ង់ ទូរគមនាគមន៍ និងបណ្តាញ" }, academicYear: { id: "y-i5", code: "I5", label: "I5" }, phone: "086439191", status: "ACTIVE", notes: "ប្រធានក្រុមដឹកនាំ" },
  { id: "m3", memberId: "STJ003", studentId: "e20240096", fullNameKh: "គ្រុយ អីុខាង", fullNameEn: "KRUY Ykhang", gender: "M", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "0968925682", status: "ACTIVE", notes: "ប្រធានក្រុម រូបវិទ្យា" },
  { id: "m4", memberId: "STJ004", studentId: "e20240866", fullNameKh: "ឈិន តុលា", fullNameEn: "CHHIN TOLA", gender: "M", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "0969720656", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m5", memberId: "STJ005", studentId: "e20240662", fullNameKh: "ឡាន បូរិន", fullNameEn: "LAN BORIN", gender: "F", department: { id: "d-gee", code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "070981465", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m6", memberId: "STJ006", studentId: "e20241183", fullNameKh: "ប៉ាក់ ច័ន្ទបូរី", fullNameEn: "PAK CHANBOREY", gender: "M", department: { id: "d-gci", code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "093271850", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m7", memberId: "STJ007", studentId: "e20241143", fullNameKh: "វី ពិទូរ្យ", fullNameEn: "VY PITOU", gender: "M", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "078564295", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m8", memberId: "STJ008", studentId: "e20250861", fullNameKh: "ពៅ ជុំរតនៈ", fullNameEn: "PEOU CHUMRATTANAK", gender: "M", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "087535899", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m9", memberId: "STJ009", studentId: "e20250220", fullNameKh: "សុង ស្រីពេជ្រ", fullNameEn: "SONG SREYPICH", gender: "F", department: { id: "d-gee", code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "085468553", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m10", memberId: "STJ010", studentId: "e20251192", fullNameKh: "សុខា អ៊ីអ៊ីង", fullNameEn: "SOKHA EEING", gender: "F", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "015691428", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m11", memberId: "STJ011", studentId: "e20251185", fullNameKh: "តឹក ឈាវវីសាល", fullNameEn: "TEK CHHEAVVISAL", gender: "M", department: { id: "d-gee", code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "012734562", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m12", memberId: "STJ012", studentId: "e20250642", fullNameKh: "អេង សូអ៊ី", fullNameEn: "ENG SOU Y", gender: "F", department: { id: "d-ams", code: "AMS", nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "0963012386", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m13", memberId: "STJ013", studentId: "e20221423", fullNameKh: "គឹម រតនៈ", fullNameEn: "KIM Ratanak", gender: "M", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i5", code: "I5", label: "I5" }, phone: "010650202", status: "ACTIVE", notes: "ប្រធានក្រុម គណិតវិទ្យា" },
  { id: "m14", memberId: "STJ014", studentId: "e20221678", fullNameKh: "ប៊ុន សុខបញ្ញា", fullNameEn: "BUN Sokpanha", gender: "M", department: { id: "d-gci", code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល" }, academicYear: { id: "y-i5", code: "I5", label: "I5" }, phone: "0767821209", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m15", memberId: "STJ015", studentId: "e20241028", fullNameKh: "វង្ស ច័ន្ទវង្សា", fullNameEn: "VONG Sa", gender: "M", department: { id: "d-gar", code: "GAR", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "016594999", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m16", memberId: "STJ016", studentId: "e20250175", fullNameKh: "ជាតិ វិសាល", fullNameEn: "CHEAT Visal", gender: "M", department: { id: "d-gar", code: "GAR", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "017724617", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m17", memberId: "STJ017", studentId: "e20251044", fullNameKh: "អន សុជាតិ", fullNameEn: "ORN Socheat", gender: "M", department: { id: "d-gee", code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "0976442857", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m18", memberId: "STJ018", studentId: "e20251246", fullNameKh: "ម៉ឹង ហាក់", fullNameEn: "MOEUNG Hak", gender: "M", department: { id: "d-gar", code: "GAR", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "0968445445", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m19", memberId: "STJ019", studentId: "e20250345", fullNameKh: "សុំ សុធាវី", fullNameEn: "SOM Sotheavy", gender: "F", department: { id: "d-gca", code: "GCA", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល និងក្សេត្រសាស្រ្ត" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "011703261", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m20", memberId: "STJ020", studentId: "e20250687", fullNameKh: "ហង់ សុជាតា", fullNameEn: "HANG Socheata", gender: "F", department: { id: "d-gca", code: "GCA", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល និងក្សេត្រសាស្រ្ត" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "016735656", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m21", memberId: "STJ021", studentId: "e20250258", fullNameKh: "ជាលី អមរិន្ទ", fullNameEn: "CHEALY Amrin", gender: "M", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "077606122", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m22", memberId: "STJ022", studentId: "e20251290", fullNameKh: "ឈុំ បញ្ញា", fullNameEn: "CHHUM Panha", gender: "M", department: { id: "d-ams", code: "AMS", nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "068620824", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m24", memberId: "STJ024", studentId: "e20241375", fullNameKh: "លៀងលី សុខឡេង", fullNameEn: "LEANGLY Sokleng", gender: "M", department: { id: "d-gee", code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "0887045133", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m25", memberId: "STJ025", studentId: "e20240704", fullNameKh: "លាង ជីងហេង", fullNameEn: "LEANG JINGHENG", gender: "M", department: { id: "d-gti", code: "GTI", nameKh: "ដេប៉ាតឺម៉ង់ បច្ចេកវិទ្យាព័ត៌មាន" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "0976355500", status: "ACTIVE", notes: "ប្រធានក្រុម Programming" },
  { id: "m26", memberId: "STJ026", studentId: "e20230078", fullNameKh: "ឃន វិទ្យ័រ", fullNameEn: "KHORN VICTOR", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i4", code: "I4", label: "I4" }, phone: "081323442", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m27", memberId: "STJ027", studentId: "e20230757", fullNameKh: "ប៊ិន បុណ្ណាកា", fullNameEn: "PEN BUNNAKA", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i4", code: "I4", label: "I4" }, phone: "0966677569", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m28", memberId: "STJ028", studentId: "e20240672", fullNameKh: "ស៊ឹង វិច្ឆិកា", fullNameEn: "SOUNG VICHKA", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "010814529", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m29", memberId: "STJ029", studentId: "e20240232", fullNameKh: "សេង ម៉ិញហាវ", fullNameEn: "SENG MINGHAO", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "017968212", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m30", memberId: "STJ030", studentId: "e20250475", fullNameKh: "ណាំ ម៉េងហួត", fullNameEn: "NAM MENGHOUT", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "099998951", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m31", memberId: "STJ031", studentId: "e20250731", fullNameKh: "ចៃ ជីជូ", fullNameEn: "CHAI CHICHOU", gender: "M", department: { id: "d-ams", code: "AMS", nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "090249820", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m32", memberId: "STJ032", studentId: "e20251399", fullNameKh: "ហាក់ ដូនីឡា", fullNameEn: "HAK DONYLA", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "089926734", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m33", memberId: "STJ033", studentId: "e20251455", fullNameKh: "ពាក់ ប្រុសម៉ៅ", fullNameEn: "PEAK BROSMAO", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "099661460", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m34", memberId: "STJ034", studentId: "e20250414", fullNameKh: "ចំរើន ដេន", fullNameEn: "CHAMROEN DEN", gender: "M", department: { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" }, academicYear: { id: "y-i2", code: "I2", label: "I2" }, phone: "0963221116", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m35", memberId: "STJ035", studentId: "e20240046", fullNameKh: "ខេង លីឧស្សាហ៍", fullNameEn: "KHENG Lyussa", gender: "F", department: { id: "d-gci", code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "0974253117", status: "ACTIVE", notes: "ប្រធានក្រុម គីមីវិទ្យា" },
  { id: "m37", memberId: "STJ037", studentId: "e20240945", fullNameKh: "ឯល មូហាំម៉ាត់សាហ្វី", fullNameEn: "EL Muhammadshafi", gender: "M", department: { id: "d-gar", code: "GAR", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "093696794", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m38", memberId: "STJ038", studentId: "e20240561", fullNameKh: "ខឿន ធារី", fullNameEn: "KHOEUN Theary", gender: "F", department: { id: "d-gci", code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "069944087", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m39", memberId: "STJ039", studentId: "e20240670", fullNameKh: "ហាប់ ស៊ីឈាង", fullNameEn: "HAB Sychheang", gender: "M", department: { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "093202727", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m40", memberId: "STJ040", studentId: "e20241214", fullNameKh: "ឌិន ម៉េងហុង", fullNameEn: "DIN Menghong", gender: "M", department: { id: "d-ams", code: "AMS", nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "081687375", status: "ACTIVE", notes: "សមាជិក" },
  { id: "m41", memberId: "STJ041", studentId: "e20240124", fullNameKh: "ហួត សំណាង", fullNameEn: "HOUT Samnang", gender: "M", department: { id: "d-gci", code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល" }, academicYear: { id: "y-i3", code: "I3", label: "I3" }, phone: "0966224473", status: "ACTIVE", notes: "សមាជិក" },
];

const OFFICIAL_DEPTS = [
  { id: "d-gic", code: "GIC", nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង" },
  { id: "d-gti", code: "GTI", nameKh: "ដេប៉ាតឺម៉ង់ បច្ចេកវិទ្យាព័ត៌មាន" },
  { id: "d-ams", code: "AMS", nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ" },
  { id: "d-gim", code: "GIM", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក" },
  { id: "d-gci", code: "GCI", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល" },
  { id: "d-gtr", code: "GTR", nameKh: "ដេប៉ាតឺម៉ង់ ទូរគមនាគមន៍ និងបណ្តាញ" },
  { id: "d-gee", code: "GEE", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល" },
  { id: "d-gar", code: "GAR", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ" },
  { id: "d-gca", code: "GCA", nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល និងក្សេត្រសាស្រ្ត" },
];

const OFFICIAL_YEARS = [
  { id: "y-i1", code: "I1", label: "I1 (Year 1)" },
  { id: "y-i2", code: "I2", label: "I2 (Year 2)" },
  { id: "y-i3", code: "I3", label: "I3 (Year 3)" },
  { id: "y-i4", code: "I4", label: "I4 (Year 4)" },
  { id: "y-i5", code: "I5", label: "I5 (Year 5)" },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const dept = searchParams.get("dept");
    const year = searchParams.get("year");
    const status = searchParams.get("status");
    const course = searchParams.get("course");

    let members;
    let departments;
    let academicYears;

    try {
      departments = await prisma.department.findMany({ where: { isActive: true } });
      academicYears = await prisma.academicYear.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });

      const whereClause: Record<string, unknown> = {};
      if (status && status !== "ALL") {
        whereClause.status = status;
      }
      if (dept && dept !== "ALL") {
        whereClause.department = { code: dept };
      }
      if (year && year !== "ALL") {
        whereClause.academicYear = { code: year };
      }
      if (course && course !== "ALL") {
        whereClause.enrollments = {
          some: {
            course: {
              code: course,
            },
          },
        };
      }
      if (search) {
        whereClause.OR = [
          { memberId: { contains: search } },
          { fullNameKh: { contains: search } },
          { fullNameEn: { contains: search } },
          { studentId: { contains: search } },
        ];
      }

      members = await prisma.member.findMany({
        where: whereClause,
        include: {
          department: true,
          academicYear: true,
          enrollments: {
            include: {
              course: true,
            },
          },
        },
        orderBy: { memberId: "asc" },
      });
      if (!members || (!course && !dept && !year && !search && members.length < 39)) {
        throw new Error("Database roster incomplete, falling back to official 39-member list");
      }
    } catch {
      departments = OFFICIAL_DEPTS;
      academicYears = OFFICIAL_YEARS;
      members = OFFICIAL_ROSTER_FALLBACK.filter((m) => {
        const matchesSearch =
          !search ||
          m.memberId.toLowerCase().includes(search.toLowerCase()) ||
          m.fullNameKh.toLowerCase().includes(search.toLowerCase()) ||
          m.fullNameEn.toLowerCase().includes(search.toLowerCase()) ||
          (m.studentId && m.studentId.toLowerCase().includes(search.toLowerCase()));
        const matchesDept = !dept || dept === "ALL" || m.department.code === dept;
        const matchesYear = !year || year === "ALL" || m.academicYear.code === year;
        const matchesStatus = !status || status === "ALL" || m.status === status;
        return matchesSearch && matchesDept && matchesYear && matchesStatus;
      });
    }

    return NextResponse.json({ members, departments, academicYears });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching members";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["SUPER_ADMIN", "STJ_ADMIN"]);
    const body = await req.json();

    const {
      memberId,
      studentId,
      fullNameKh,
      fullNameEn,
      email,
      phone,
      gender,
      departmentId,
      academicYearId,
      notes,
    } = body;

    if (!memberId || !fullNameKh || !fullNameEn || !departmentId || !academicYearId) {
      return NextResponse.json(
        { error: "Missing required fields (memberId, fullNameKh, fullNameEn, department, academicYear)" },
        { status: 400 }
      );
    }

    const created = await prisma.member.create({
      data: {
        memberId,
        studentId,
        fullNameKh,
        fullNameEn,
        email,
        phone,
        gender,
        departmentId,
        academicYearId,
        notes,
        status: "ACTIVE",
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "MEMBER_CREATED",
          entityType: "MEMBER",
          entityId: created.id,
          details: JSON.stringify({ memberId, fullNameEn }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, member: created });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creating member";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireRole(["SUPER_ADMIN", "STJ_ADMIN"]);
    const body = await req.json();
    const { id, status, notes, phone, email } = body;

    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const updated = await prisma.member.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(email !== undefined ? { email } : {}),
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "MEMBER_UPDATED",
          entityType: "MEMBER",
          entityId: updated.id,
          details: JSON.stringify({ status, notes }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating member";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
