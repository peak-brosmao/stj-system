<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StjDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Departments (All ITC Departments for STJ)
        $depts = [
            ['id' => 'dept-gic', 'code' => 'GIC', 'name_kh' => 'ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង', 'name_en' => 'Information and Communication Engineering', 'name_fr' => 'Génie Informatique et Communication'],
            ['id' => 'dept-ams', 'code' => 'AMS', 'name_kh' => 'ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ', 'name_en' => 'Applied Mathematics and Statistics', 'name_fr' => 'Mathématiques Appliquées et Statistique'],
            ['id' => 'dept-gim', 'code' => 'GIM', 'name_kh' => 'ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក', 'name_en' => 'Industrial and Mechanical Engineering', 'name_fr' => 'Génie Industriel et Mécanique'],
            ['id' => 'dept-gee', 'code' => 'GEE', 'name_kh' => 'ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល', 'name_en' => 'Electrical and Energy Engineering', 'name_fr' => 'Génie Électrique et Énergétique'],
            ['id' => 'dept-gci', 'code' => 'GCI', 'name_kh' => 'ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល', 'name_en' => 'Civil Engineering', 'name_fr' => 'Génie Civil'],
            ['id' => 'dept-gca', 'code' => 'GCA', 'name_kh' => 'ដេប៉ាតឺម៉ង់ គីមី និងចំណីអាហារ', 'name_en' => 'Chemical and Food Engineering', 'name_fr' => 'Génie Chimique et Alimentaire'],
            ['id' => 'dept-gar', 'code' => 'GAR', 'name_kh' => 'ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ', 'name_en' => 'Rural Engineering', 'name_fr' => 'Génie Rural'],
            ['id' => 'dept-gtr', 'code' => 'GTR', 'name_kh' => 'ដេប៉ាតឺម៉ង់ ទូរគមនាគមន៍ និងបណ្តាញ', 'name_en' => 'Telecommunications and Network Engineering', 'name_fr' => 'Génie Télécommunication'],
            ['id' => 'dept-gti', 'code' => 'GTI', 'name_kh' => 'ដេប៉ាតឺម៉ង់ បច្ចេកវិទ្យាព័ត៌មាន', 'name_en' => 'Information Technology', 'name_fr' => 'Génie Télécommunications et Réseaux'],
            ['id' => 'dept-ggg', 'code' => 'GGG', 'name_kh' => 'ដេប៉ាតឺម៉ង់ ធនធានរ៉ែ និងភូគព្ភសាស្ត្រ', 'name_en' => 'Geo-resources and Geotechnical Engineering', 'name_fr' => 'Génie Géologique et Géotechnique'],
            ['id' => 'dept-grh', 'code' => 'GRH', 'name_kh' => 'ដេប៉ាតឺម៉ង់ ធនធានទឹក និងបរិស្ថាន', 'name_en' => 'Water and Environmental Engineering', 'name_fr' => 'Génie Rural et Hydrologique'],
        ];
        foreach ($depts as $d) {
            DB::table('departments')->updateOrInsert(['id' => $d['id']], array_merge($d, ['created_at' => now(), 'updated_at' => now()]));
        }

        // 2. Academic Years (ITC Engineering Levels)
        $years = [
            ['id' => 'year-i1', 'code' => 'I1', 'label' => 'ឆ្នាំទី១ ថ្នាក់វិស្វករ (I1)', 'order' => 1],
            ['id' => 'year-i2', 'code' => 'I2', 'label' => 'ឆ្នាំទី២ ថ្នាក់វិស្វករ (I2)', 'order' => 2],
            ['id' => 'year-i3', 'code' => 'I3', 'label' => 'ឆ្នាំទី៣ ថ្នាក់វិស្វករ (I3)', 'order' => 3],
            ['id' => 'year-i4', 'code' => 'I4', 'label' => 'ឆ្នាំទី៤ ថ្នាក់វិស្វករ (I4)', 'order' => 4],
            ['id' => 'year-i5', 'code' => 'I5', 'label' => 'ឆ្នាំទី៥ ថ្នាក់វិស្វករ (I5)', 'order' => 5],
        ];
        foreach ($years as $y) {
            DB::table('academic_years')->updateOrInsert(['id' => $y['id']], array_merge($y, ['created_at' => now(), 'updated_at' => now()]));
        }

        // 3. Courses
        $courses = [
            [
                'id' => 'course-prog101',
                'code' => 'PROG101',
                'slug' => 'programming',
                'title_kh' => 'ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)',
                'title_en' => 'Computer Programming & Algorithms',
                'department_id' => 'dept-gic',
                'academic_year' => '2026-2027',
                'semester' => 'Semester 1',
                'status' => 'ACTIVE',
            ],
            [
                'id' => 'course-math101',
                'code' => 'MATH101',
                'slug' => 'mathematics',
                'title_kh' => 'គណិតវិទ្យាវិស្វកម្ម (Mathematics)',
                'title_en' => 'Engineering Mathematics',
                'department_id' => 'dept-ams',
                'academic_year' => '2026-2027',
                'semester' => 'Semester 1',
                'status' => 'ACTIVE',
            ],
            [
                'id' => 'course-phys101',
                'code' => 'PHYS101',
                'slug' => 'physics',
                'title_kh' => 'រូបវិទ្យាវិស្វកម្ម (Physics)',
                'title_en' => 'Engineering Physics',
                'department_id' => 'dept-gim',
                'academic_year' => '2026-2027',
                'semester' => 'Semester 1',
                'status' => 'ACTIVE',
            ],
            [
                'id' => 'course-chem101',
                'code' => 'CHEM101',
                'slug' => 'chemistry',
                'title_kh' => 'គីមីវិទ្យាទូទៅ (Chemistry)',
                'title_en' => 'General Chemistry',
                'department_id' => 'dept-gca',
                'academic_year' => '2026-2027',
                'semester' => 'Semester 1',
                'status' => 'ACTIVE',
            ],
        ];
        foreach ($courses as $c) {
            DB::table('courses')->updateOrInsert(['id' => $c['id']], array_merge($c, ['created_at' => now(), 'updated_at' => now()]));
        }

        // 4. Official STJ Roster 2026-2027 (39 Unique Members)
        // Format: [member_id, student_id, name_kh, name_en, gender, dept_code, year_code, phone, role_title, course_id, is_leader, role_type]
        $roster = [
            ['STJ001', 'e20230969', 'សុខ សេងលី', 'SOK SENGLY', 'F', 'GCI', 'I4', '015399209', 'គណៈកម្មាធិការសមាគមនិស្សិត', null, true, 'STUDENT_ASSOCIATION'],
            ['STJ002', 'e20221334', 'ផល ដាវីត', 'PHAL David', 'M', 'GTR', 'I5', '086439191', 'ប្រធានក្រុមដឹកនាំ', null, true, 'STJ_PRESIDENT'],
            ['STJ003', 'e20240096', 'គ្រុយ អ៊ីខាង', 'KRUY Ykhang', 'M', 'GIM', 'I3', '0968925682', 'ប្រធានក្រុម រូបវិទ្យា', 'course-phys101', true, 'COURSE_LEADER'],
            ['STJ004', 'e20240866', 'ឈិន តុលា', 'CHHIN TOLA', 'M', 'GIM', 'I3', '0969720656', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ005', 'e20240662', 'ឡាន បូរិន', 'LAN BORIN', 'F', 'GEE', 'I3', '070981465', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ006', 'e20241183', 'ប៉ាក់ ច័ន្ទបូរី', 'PAK CHANBOREY', 'M', 'GCI', 'I3', '093271850', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ007', 'e20241143', 'វី ពិទូរ្យ', 'VY PITOU', 'M', 'GIM', 'I3', '078564295', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ008', 'e20250861', 'ពៅ ជុំរតនៈ', 'PEOU CHUMRATTANAK', 'M', 'GIM', 'I2', '087535899', 'សមាជិក', 'course-math101', false, 'MEMBER'],
            ['STJ009', 'e20250220', 'សុង ស្រីពេជ', 'SONG SREYPICH', 'F', 'GEE', 'I2', '085468553', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ010', 'e20251192', 'សុខា អឺអឺង', 'SOKHA EEING', 'F', 'GIM', 'I2', '015691428', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ011', 'e20251185', 'តឹក ឈាវវិសាល', 'TEK CHHEAVVISAL', 'M', 'GEE', 'I2', '012734562', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ012', 'e20250642', 'អេង ស៊ូ យី', 'Eng Sou Y', 'F', 'AMS', 'I2', '0963012386', 'សមាជិក', 'course-math101', false, 'MEMBER'],
            ['STJ013', 'e20221423', 'គឹម រតនៈ', 'KIM Ratanak', 'M', 'GIM', 'I5', '010650202', 'ប្រធានក្រុម គណិតវិទ្យា', 'course-math101', true, 'COURSE_LEADER'],
            ['STJ014', 'e20221678', 'ប៊ុន សុខបញ្ញា', 'BUN Sokpanha', 'M', 'GCI', 'I5', '0767821209', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ015', 'e20241028', 'ឡេង ច័ន្ទវង្សា', 'LENG Vongsa', 'M', 'GAR', 'I3', '016594999', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ016', 'e20250175', 'ជាតិ វិសាល', 'CHEAT Visal', 'M', 'GAR', 'I2', '017724617', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ017', 'e20251044', 'អិន សុជាតិ', 'ORN Socheat', 'M', 'GEE', 'I2', '0976442857', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ018', 'e20251246', 'ម៉ឹង ហាក់', 'MOEUNG Hak', 'M', 'GAR', 'I2', '0968445445', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ019', 'e20250345', 'សុំ សុធាវី', 'SOM Sotheavy', 'F', 'GCA', 'I2', '011703261', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ020', 'e20250687', 'ហង់ សុជាតា', 'HANG Socheata', 'F', 'GCA', 'I2', '016735656', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ021', 'e20250258', 'ជាលី អមរិន្ទ', 'CHEALY Amrin', 'M', 'GIM', 'I2', '077606122', 'សមាជិក', 'course-math101', false, 'MEMBER'],
            ['STJ022', 'e20251290', 'ឈុំ បញ្ញា', 'CHHUM Panha', 'M', 'AMS', 'I2', '068620824', 'សមាជិក', 'course-math101', false, 'MEMBER'],
            ['STJ024', 'e20241375', 'លៀងលី សុខឡេង', 'LEANGLY Sokleng', 'M', 'GEE', 'I3', '0887045133', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ025', 'e20240704', 'លាង ជឹងហេង', 'LEANG JINGHENG', 'M', 'GTI', 'I3', '0976355500', 'ប្រធានក្រុម Programming', 'course-prog101', true, 'COURSE_LEADER'],
            ['STJ026', 'e20230078', 'ឃន វ៉ិចទ័រ', 'KHORN VICTOR', 'M', 'GIC', 'I4', '081323442', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ027', 'e20230757', 'ប៊ុន បុណ្ណាកា', 'BUN BUNNAKA', 'M', 'GIC', 'I4', '0966677569', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ028', 'e20240672', 'ស៊ឹង វិច្ឆិកា', 'SOUNG VICHKA', 'M', 'GIC', 'I3', '010814529', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ029', 'e20240232', 'សេង ម៉ិញហាវ', 'SENG MINGHAO', 'M', 'GIC', 'I3', '017968212', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ030', 'e20250475', 'ណាំ ម៉េងហួត', 'NAM MENGHOUT', 'M', 'GIC', 'I2', '099998951', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ031', 'e20250731', 'ចៃ ជីជូ', 'CHAI CHICHOU', 'M', 'AMS', 'I2', '090249820', 'សមាជិក', 'course-math101', false, 'MEMBER'],
            ['STJ032', 'e20251399', 'ហាក់ ដូនីឡា', 'HAK DONYLA', 'M', 'GIC', 'I2', '089926734', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ033', 'e20251455', 'ពៀក ប្រុសម៉ៅ', 'PEAK BROSMAO', 'M', 'GIC', 'I2', '099661460', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ034', 'e20250414', 'ចំរើន ដែន', 'CHAMROEN DEN', 'M', 'GIC', 'I2', '0963221116', 'សមាជិក', 'course-prog101', false, 'MEMBER'],
            ['STJ035', 'e20240046', 'ខេង លីឧស្សាហ៍', 'KHENG Lyussa', 'F', 'GCI', 'I3', '0974253117', 'ប្រធានក្រុម គីមីវិទ្យា', 'course-chem101', true, 'COURSE_LEADER'],
            ['STJ037', 'e20240945', 'ឯល មូហាម៉ាត់សាហ្វី', 'EL Muhammadshafi', 'M', 'GAR', 'I3', '093696794', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ038', 'e20240561', 'ឈឿន ធារី', 'KHOEUN Theary', 'F', 'GCI', 'I3', '069944087', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
            ['STJ039', 'e20240670', 'ហាប់ ស៊ីឈាង', 'HAB Sychheang', 'M', 'GIM', 'I3', '093202727', 'សមាជិក', 'course-phys101', false, 'MEMBER'],
            ['STJ040', 'e20241214', 'ឌិន ម៉េងហុង', 'DIN Menghong', 'M', 'AMS', 'I3', '081687375', 'សមាជិក', 'course-math101', false, 'MEMBER'],
            ['STJ041', 'e20240124', 'ហួត សំណាង', 'HOUT Samnang', 'M', 'GCI', 'I3', '0966224473', 'សមាជិក', 'course-chem101', false, 'MEMBER'],
        ];

        $usersByStudentId = [];

        foreach ($roster as $r) {
            [$mId, $stdId, $nameKh, $nameEn, $gender, $deptCode, $yrCode, $phone, $roleTitle, $cId, $isLeader, $roleType] = $r;
            $memberUuid = 'member-' . strtolower($mId);
            $deptId = 'dept-' . strtolower($deptCode);
            $yrId = 'year-' . strtolower($yrCode);
            $email = strtolower($stdId) . '@itc.edu.kh';

            // Insert / Update Member
            DB::table('members')->updateOrInsert(
                ['member_id' => $mId],
                [
                    'id' => $memberUuid,
                    'member_id' => $mId,
                    'student_id' => $stdId,
                    'full_name_kh' => $nameKh,
                    'full_name_en' => $nameEn,
                    'email' => $email,
                    'phone' => $phone,
                    'gender' => $gender,
                    'department_id' => $deptId,
                    'academic_year_id' => $yrId,
                    'status' => 'ACTIVE',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // User account creation
            $userRole = $roleType;
            if ($stdId === 'e20221334') {
                $userRole = 'STJ_PRESIDENT';
            } elseif ($stdId === 'e20230969') {
                $userRole = 'STUDENT_ASSOCIATION';
            } elseif ($isLeader) {
                $userRole = 'COURSE_LEADER';
            } else {
                $userRole = 'MEMBER';
            }

            DB::table('users')->updateOrInsert(
                ['email' => $email],
                [
                    'name' => $nameEn,
                    'full_name_kh' => $nameKh,
                    'full_name_en' => $nameEn,
                    'email' => $email,
                    'student_id' => $stdId,
                    'role' => $userRole,
                    'member_id' => $mId,
                    'password' => Hash::make(strtolower($stdId) . '@ITC!'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            $u = DB::table('users')->where('email', $email)->first();
            if ($u) {
                $usersByStudentId[$stdId] = $u;
            }

            // Enroll member in their course
            if ($cId) {
                DB::table('course_enrollments')->updateOrInsert(
                    ['course_id' => $cId, 'member_id' => $memberUuid],
                    ['enrolled_at' => now()]
                );
            } else {
                DB::table('course_enrollments')->where('member_id', $memberUuid)->delete();
            }
        }

        // 5. Course Leaders Assignment
        $leaderAssignments = [
            ['course-prog101', 'e20240704'], // លាង ជឹងហេង (Programming Leader)
            ['course-math101', 'e20221423'], // គឹម រតនៈ (Mathematics Leader)
            ['course-phys101', 'e20240096'], // គ្រុយ អ៊ីខាង (Physics Leader)
            ['course-chem101', 'e20240046'], // ខេង លីឧស្សាហ៍ (Chemistry Leader)
        ];

        foreach ($leaderAssignments as [$courseId, $leaderStdId]) {
            if (isset($usersByStudentId[$leaderStdId])) {
                $leaderUser = $usersByStudentId[$leaderStdId];
                DB::table('course_leaders')->updateOrInsert(
                    ['course_id' => $courseId, 'user_id' => $leaderUser->id],
                    ['assigned_at' => now()]
                );
            }
        }

        $presidentUser = $usersByStudentId['e20221334'] ?? null;
        $presidentUserId = $presidentUser ? $presidentUser->id : null;

        // 6. Live Teaching Sessions
        $sessionMath = 'session-math-complexe';
        DB::table('teaching_sessions')->updateOrInsert(
            ['id' => $sessionMath],
            [
                'course_id' => 'course-math101',
                'title' => 'Le Nombre Complexe',
                'session_date' => '2026-11-05',
                'start_time' => '11:30',
                'end_time' => '13:00',
                'room' => 'SF1 & SF2',
                'status' => 'COMPLETED',
                'notes' => 'មេរៀនទី១ គណិតវិទ្យាវិស្វកម្ម',
                'created_by_id' => $usersByStudentId['e20221423']->id ?? $presidentUserId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $sessionProg = 'session-prog-intro';
        DB::table('teaching_sessions')->updateOrInsert(
            ['id' => $sessionProg],
            [
                'course_id' => 'course-prog101',
                'title' => 'C PROGRAMING',
                'session_date' => '2026-11-04',
                'start_time' => '11:30',
                'end_time' => '13:00',
                'room' => 'SF2',
                'status' => 'COMPLETED',
                'notes' => 'មេរៀនទី១ ការសរសេរកូដ C',
                'created_by_id' => $usersByStudentId['e20240704']->id ?? $presidentUserId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Attendance for Programming session (All 9 enrolled members)
        $progMembers = ['member-stj025', 'member-stj026', 'member-stj027', 'member-stj028', 'member-stj029', 'member-stj030', 'member-stj032', 'member-stj033', 'member-stj034'];
        foreach ($progMembers as $mId) {
            DB::table('attendance_records')->updateOrInsert(
                ['session_id' => $sessionProg, 'member_id' => $mId],
                [
                    'id' => 'att-' . $sessionProg . '-' . $mId,
                    'status' => 'PRESENT',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Attendance for Mathematics session (All 7 enrolled members)
        $mathMembers = ['member-stj008', 'member-stj012', 'member-stj013', 'member-stj021', 'member-stj022', 'member-stj031', 'member-stj040'];
        foreach ($mathMembers as $mId) {
            DB::table('attendance_records')->updateOrInsert(
                ['session_id' => $sessionMath, 'member_id' => $mId],
                [
                    'id' => 'att-' . $sessionMath . '-' . $mId,
                    'status' => 'PRESENT',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // 7. Public Share Links
        DB::table('share_links')->updateOrInsert(
            ['token' => 'stj-official-2027'],
            [
                'id' => 'share-official-2027',
                'token' => 'stj-official-2027',
                'token_hash' => hash('sha256', 'stj-official-2027'),
                'course_id' => 'course-prog101',
                'session_id' => null,
                'title' => 'របាយការណ៍រួមមុខវិជ្ជា STJ Programming',
                'show_stats' => true,
                'created_by_id' => $presidentUserId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('share_links')->updateOrInsert(
            ['token' => 'stj-demo-token-2026'],
            [
                'id' => 'share-demo-2026',
                'token' => 'stj-demo-token-2026',
                'token_hash' => hash('sha256', 'stj-demo-token-2026'),
                'course_id' => 'course-prog101',
                'session_id' => $sessionProg,
                'title' => 'របាយការណ៍មេរៀន C PROGRAMING (2026-11-04)',
                'show_stats' => true,
                'created_by_id' => $presidentUserId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
