<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StjDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Departments
        $depts = [
            ['id' => 'dept-gic', 'code' => 'GIC', 'name_kh' => 'ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង', 'name_en' => 'Information and Communication Engineering', 'name_fr' => 'Génie Informatique et Communication'],
            ['id' => 'dept-ams', 'code' => 'AMS', 'name_kh' => 'ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ', 'name_en' => 'Applied Mathematics and Statistics', 'name_fr' => 'Mathématiques Appliquées et Statistique'],
            ['id' => 'dept-gim', 'code' => 'GIM', 'name_kh' => 'ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក', 'name_en' => 'Industrial and Mechanical Engineering', 'name_fr' => 'Génie Industriel et Mécanique'],
            ['id' => 'dept-gee', 'code' => 'GEE', 'name_kh' => 'ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល', 'name_en' => 'Electrical and Energy Engineering', 'name_fr' => 'Génie Électrique et Énergétique'],
            ['id' => 'dept-gci', 'code' => 'GCI', 'name_kh' => 'ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល', 'name_en' => 'Civil Engineering', 'name_fr' => 'Génie Civil'],
            ['id' => 'dept-gca', 'code' => 'GCA', 'name_kh' => 'ដេប៉ាតឺម៉ង់ គីមី និងចំណីអាហារ', 'name_en' => 'Chemical and Food Engineering', 'name_fr' => 'Génie Chimique et Alimentaire'],
            ['id' => 'dept-ggg', 'code' => 'GGG', 'name_kh' => 'ដេប៉ាតឺម៉ង់ ធនធានរ៉ែ និងភូគព្ភសាស្ត្រ', 'name_en' => 'Geo-resources and Geotechnical Engineering', 'name_fr' => 'Génie Géologique et Géotechnique'],
            ['id' => 'dept-grh', 'code' => 'GRH', 'name_kh' => 'ដេប៉ាតឺម៉ង់ ធនធានទឹក និងបរិស្ថាន', 'name_en' => 'Water and Environmental Engineering', 'name_fr' => 'Génie Rural et Hydrologique'],
        ];
        foreach ($depts as $d) {
            DB::table('departments')->updateOrInsert(['id' => $d['id']], array_merge($d, ['created_at' => now(), 'updated_at' => now()]));
        }

        // 2. Academic Years
        $years = [
            ['id' => 'year-i1', 'code' => 'I1', 'label' => 'ឆ្នាំទី១ ថ្នាក់វិស្វករ', 'order' => 1],
            ['id' => 'year-i2', 'code' => 'I2', 'label' => 'ឆ្នាំទី២ ថ្នាក់វិស្វករ', 'order' => 2],
            ['id' => 'year-i3', 'code' => 'I3', 'label' => 'ឆ្នាំទី៣ ថ្នាក់វិស្វករ', 'order' => 3],
            ['id' => 'year-i4', 'code' => 'I4', 'label' => 'ឆ្នាំទី៤ ថ្នាក់វិស្វករ', 'order' => 4],
            ['id' => 'year-i5', 'code' => 'I5', 'label' => 'ឆ្នាំទី៥ ថ្នាក់វិស្វករ', 'order' => 5],
        ];
        foreach ($years as $y) {
            DB::table('academic_years')->updateOrInsert(['id' => $y['id']], array_merge($y, ['created_at' => now(), 'updated_at' => now()]));
        }

        // 3. Courses
        $courses = [
            ['id' => 'course-prog101', 'code' => 'PROG101', 'slug' => 'programming', 'title_kh' => 'ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)', 'title_en' => 'Computer Programming & Algorithms', 'department_id' => 'dept-gic'],
            ['id' => 'course-math101', 'code' => 'MATH101', 'slug' => 'mathematics', 'title_kh' => 'គណិតវិទ្យាវិស្វកម្ម (Mathematics)', 'title_en' => 'Engineering Mathematics', 'department_id' => 'dept-ams'],
            ['id' => 'course-phys101', 'code' => 'PHYS101', 'slug' => 'physics', 'title_kh' => 'រូបវិទ្យាវិស្វកម្ម (Physics)', 'title_en' => 'Engineering Physics', 'department_id' => 'dept-gim'],
            ['id' => 'course-chem101', 'code' => 'CHEM101', 'slug' => 'chemistry', 'title_kh' => 'គីមីវិទ្យាទូទៅ (Chemistry)', 'title_en' => 'General Chemistry', 'department_id' => 'dept-gca'],
        ];
        foreach ($courses as $c) {
            DB::table('courses')->updateOrInsert(['id' => $c['id']], array_merge($c, ['created_at' => now(), 'updated_at' => now()]));
        }

        // 4. STJ President User
        $presidentUserId = DB::table('users')->insertGetId([
            'name' => 'PHAL David',
            'full_name_kh' => 'ផល ដាវីត',
            'full_name_en' => 'PHAL David',
            'email' => 'e20221334@itc.edu.kh',
            'student_id' => 'e20221334',
            'role' => 'STJ_PRESIDENT',
            'member_id' => 'STJ002',
            'password' => Hash::make('password123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Official Roster (39 members)
        $roster = [
            ['STJ001', 'e20230969', 'សុខ សេងលី', 'SOK SENGLY', 'dept-gci', 'year-i4', 'course-prog101'],
            ['STJ002', 'e20221334', 'ផល ដាវីត', 'PHAL David', 'dept-grh', 'year-i5', 'course-prog101'],
            ['STJ003', 'e20240096', 'គ្រុយ អ៊ីងខាង', 'KRUY Ykhang', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ004', 'e20240866', 'ឈិន តុលា', 'CHHIN TOLA', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ005', 'e20240662', 'ឡាន បូរិន', 'LAN BORIN', 'dept-gee', 'year-i3', 'course-phys101'],
            ['STJ006', 'e20241699', 'ប៉ាក់ ច័ន្ទបុរី', 'PAK CHANBOREY', 'dept-gci', 'year-i3', 'course-chem101'],
            ['STJ007', 'e20240409', 'គឹម រតនៈ', 'KIM RATANAK', 'dept-gim', 'year-i5', 'course-math101'],
            ['STJ008', 'e20241285', 'ខេង សិលា', 'KHENG SELA', 'dept-gci', 'year-i3', 'course-chem101'],
            ['STJ009', 'e20241671', 'ភិន សុគន្ធា', 'PHIN SOKUNTHEA', 'dept-gca', 'year-i3', 'course-chem101'],
            ['STJ010', 'e20241203', 'ទ្រី ធីតា', 'TRY THIDA', 'dept-gca', 'year-i3', 'course-chem101'],
            ['STJ011', 'e20240058', 'ហ៊ន ហាក់', 'HORN HAK', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ012', 'e20241269', 'ឈួន សុភ័ក្ត្រ', 'CHHUON SOPHEAKTRA', 'dept-ams', 'year-i3', 'course-math101'],
            ['STJ013', 'e20240728', 'លឹម គឹមសួរ', 'LIM KIMSUR', 'dept-gci', 'year-i3', 'course-chem101'],
            ['STJ014', 'e20240618', 'ជា សុខជា', 'CHEA SOKCHEA', 'dept-gci', 'year-i3', 'course-chem101'],
            ['STJ015', 'e20240428', 'ស៊ុន សុបញ្ញា', 'SUN SOPANHA', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ016', 'e20240429', 'តុង ហុងលី', 'TONG HONGLY', 'dept-gci', 'year-i3', 'course-chem101'],
            ['STJ017', 'e20240049', 'ឡឹក លាងអ៊ី', 'LEAK LEANGY', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ018', 'e20240398', 'សាំង គឹមឡាយ', 'SANG KIMLAY', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ019', 'e20240833', 'ជា ប៊ុនថេន', 'CHEA BUNTHEN', 'dept-ams', 'year-i3', 'course-math101'],
            ['STJ020', 'e20241517', 'តូក វិចិត្រ', 'TOK VICHET', 'dept-gca', 'year-i3', 'course-chem101'],
            ['STJ021', 'e20240243', 'ខៀវ ពេជ្រមុនីរត្ន', 'KHIEV PICHMUNYROTH', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ022', 'e20241088', 'ខន ស៊ីណា', 'KHORN SINA', 'dept-ams', 'year-i3', 'course-math101'],
            ['STJ023', 'e20241193', 'ឃិត តុលា', 'KHIT TOLA', 'dept-gca', 'year-i3', 'course-chem101'],
            ['STJ024', 'e20240050', 'អុល ពិសិដ្ឋ', 'OL PISETH', 'dept-ams', 'year-i3', 'course-math101'],
            ['STJ025', 'e20240704', 'លាង ជីងហេង', 'LEANG JINGHENG', 'dept-gic', 'year-i3', 'course-prog101'],
            ['STJ026', 'e20230245', 'ឃន វិចិត្រ', 'KHORN VICTOR', 'dept-gic', 'year-i4', 'course-prog101'],
            ['STJ027', 'e20230752', 'ប៊ិន បុញ្ញាកា', 'PEN BUNNAKA', 'dept-gic', 'year-i4', 'course-prog101'],
            ['STJ028', 'e20240209', 'ស៊ឹង វិច្ឆិកា', 'SOUNG VICHKA', 'dept-gic', 'year-i3', 'course-prog101'],
            ['STJ029', 'e20240683', 'សេង ម៉េងហាវ', 'SENG MINGHAO', 'dept-gic', 'year-i3', 'course-prog101'],
            ['STJ030', 'e20251336', 'ណាំ ម៉េងហួត', 'NAM MENGHOUT', 'dept-gic', 'year-i2', 'course-prog101'],
            ['STJ031', 'e20240166', 'ខេង សុជាតិ', 'KHENG SOCHEAT', 'dept-ams', 'year-i3', 'course-math101'],
            ['STJ032', 'e20251717', 'ហាក់ ដូនីឡា', 'HAK DONYLA', 'dept-gic', 'year-i2', 'course-prog101'],
            ['STJ033', 'e20251455', 'ភៀក ប្រុសម៉ៅ', 'PEAK BROSMAO', 'dept-gic', 'year-i2', 'course-prog101'],
            ['STJ034', 'e20250762', 'ចំរើន ដេន', 'CHAMROEN DEN', 'dept-gic', 'year-i2', 'course-prog101'],
            ['STJ035', 'e20240106', 'ហេង លីហួរ', 'HENG LYHOUR', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ036', 'e20240156', 'ឈិត សុធារិទ្ធ', 'CHHIT SOTHEARITH', 'dept-ams', 'year-i3', 'course-math101'],
            ['STJ037', 'e20241031', 'ខេង សុខលីដា', 'KHENG SOKLYDA', 'dept-gca', 'year-i3', 'course-chem101'],
            ['STJ038', 'e20240155', 'ថោង ផានិត', 'THONG PHANITH', 'dept-gim', 'year-i3', 'course-phys101'],
            ['STJ039', 'e20240150', 'ហេង សំណាង', 'HENG SAMNANG', 'dept-gca', 'year-i3', 'course-chem101'],
        ];

        foreach ($roster as $r) {
            $memberUuid = 'member-' . strtolower($r[0]);
            DB::table('members')->updateOrInsert(
                ['member_id' => $r[0]],
                [
                    'id' => $memberUuid,
                    'member_id' => $r[0],
                    'student_id' => $r[1],
                    'full_name_kh' => $r[2],
                    'full_name_en' => $r[3],
                    'email' => $r[1] . '@itc.edu.kh',
                    'department_id' => $r[4],
                    'academic_year_id' => $r[5],
                    'status' => 'ACTIVE',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Enroll member in course
            DB::table('course_enrollments')->updateOrInsert(
                ['course_id' => $r[6], 'member_id' => $memberUuid],
                ['enrolled_at' => now()]
            );

            // Create user account if not already exists
            if ($r[1] !== 'e20221334') {
                DB::table('users')->updateOrInsert(
                    ['student_id' => $r[1]],
                    [
                        'name' => $r[3],
                        'full_name_kh' => $r[2],
                        'full_name_en' => $r[3],
                        'email' => $r[1] . '@itc.edu.kh',
                        'student_id' => $r[1],
                        'role' => 'MEMBER',
                        'member_id' => $r[0],
                        'password' => Hash::make('password123'),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        // 6. Share Links
        DB::table('share_links')->updateOrInsert(
            ['token' => 'stj-official-2027'],
            [
                'id' => 'share-official-2027',
                'token' => 'stj-official-2027',
                'token_hash' => hash('sha256', 'stj-official-2027'),
                'course_id' => 'course-prog101',
                'title' => 'របាយការណ៍វត្តមាន STJ Programming ឆ្នាំសិក្សា ២០២៦-២០២៧',
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
                'title' => 'របាយការណ៍វត្តមាន STJ Programming ឆ្នាំសិក្សា ២០២៦-២០២៧',
                'show_stats' => true,
                'created_by_id' => $presidentUserId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
