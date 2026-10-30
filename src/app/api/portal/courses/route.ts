import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("id");

    if (courseId) {
      // Return single course detail
      const course = {
        id: courseId,
        code: "PROG101",
        titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)",
        titleEn: "Programming & Algorithmic Thinking",
        titleFr: "Programmation et Algorithmique",
        category: "Engineering Foundation",
        academicTerm: "2026-2027 Semester 1",
        descriptionKh: "ពង្រឹងមូលដ្ឋានគ្រឹះ C, C++, Data Structures, Memory Management, Algorithms និងការដោះស្រាយបញ្ហាជាក់ស្តែងសម្រាប់និស្សិតវិស្វកម្ម។",
        descriptionEn: "Mastering C/C++, pointer memory architectures and advanced data structures.",
        room: "Campus 1, Building A, Room 204",
        schedule: "រៀងរាល់ថ្ងៃសៅរ៍ ម៉ោង 08:00 - 10:00 ព្រឹក",
        leaders: [
          {
            fullNameKh: "លាង ជីងហេង",
            fullNameEn: "LEANG JINGHENG",
            email: "leang.jingheng@itc.edu.kh",
            department: "GTI (Year I3)",
            phone: "0976355500",
          },
        ],
        announcements: [
          {
            id: "ann-c1",
            title: "កាលវិភាគពិនិត្យកូដ និងការដំឡើង GCC Compiler",
            date: "2026-10-15",
            content: "សូមនិស្សិតទាំងអស់ដំឡើង MinGW-w64 ឬ Clang លើកុំព្យូទ័រយួរដៃឱ្យបានរួចរាល់មុនថ្ងៃសិក្សា។",
          },
        ],
        sessions: [
          {
            id: "s1",
            title: "វគ្គទី១៖ Pointers, Structs and Dynamic Memory",
            date: "2026-10-10",
            time: "08:00 - 10:00",
            room: "Room 204",
            status: "COMPLETED",
          },
          {
            id: "s2",
            title: "វគ្គទី២៖ Big-O Analysis & Sorting Algorithms",
            date: "2026-10-17",
            time: "08:00 - 10:00",
            room: "Room 204",
            status: "COMPLETED",
          },
          {
            id: "s3",
            title: "វគ្គទី៣៖ Linked Lists and Stack/Queue",
            date: "2026-10-24",
            time: "08:00 - 10:00",
            room: "Room 204",
            status: "COMPLETED",
          },
          {
            id: "s4",
            title: "វគ្គទី៤៖ Binary Search Trees and Recursion",
            date: "2026-11-07",
            time: "08:00 - 10:00",
            room: "Room 204",
            status: "SCHEDULED",
          },
        ],
      };
      return NextResponse.json({ success: true, course });
    }

    // Return all courses for the user
    const courses = [
      {
        id: "c-prog",
        code: "PROG101",
        slug: "programming",
        titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
        titleEn: "Programming & Algorithmic Thinking",
        category: "Engineering Foundation",
        academicTerm: "2026-2027 Semester 1",
        description: "C/C++, Data Structures, Memory Management និង Problem Solving",
        leaderName: "លាង ជីងហេង (LEANG JINGHENG)",
        enrolledMembersCount: 41,
        totalSessions: 12,
        completedSessions: 3,
        myAttendanceRate: 100,
        roleInCourse: session.roles.includes("COURSE_LEADER") ? "Course Leader" : "Enrolled Member",
      },
      {
        id: "c-math",
        code: "MATH101",
        slug: "mathematics",
        titleKh: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
        titleEn: "Engineering Mathematics",
        category: "Engineering Foundation",
        academicTerm: "2026-2027 Semester 1",
        description: "Calculus, Linear Algebra, Differential Equations និង Numerical Methods",
        leaderName: "គឹម រតនៈ (KIM Ratanak)",
        enrolledMembersCount: 38,
        totalSessions: 12,
        completedSessions: 2,
        myAttendanceRate: 100,
        roleInCourse: "Enrolled Member",
      },
      {
        id: "c-phys",
        code: "PHYS101",
        slug: "physics",
        titleKh: "រូបវិទ្យាវិស្វកម្ម (Physics)",
        titleEn: "Engineering Physics",
        category: "Engineering Foundation",
        academicTerm: "2026-2027 Semester 1",
        description: "Classical Mechanics, Wave Dynamics និង Thermodynamics",
        leaderName: "គ្រុយ អីុខាង (KRUY Ykhang)",
        enrolledMembersCount: 35,
        totalSessions: 10,
        completedSessions: 2,
        myAttendanceRate: 100,
        roleInCourse: "Enrolled Member",
      },
      {
        id: "c-chem",
        code: "CHEM101",
        slug: "chemistry",
        titleKh: "គីមីវិទ្យាទូទៅ (Chemistry)",
        titleEn: "General Chemistry",
        category: "Engineering Foundation",
        academicTerm: "2026-2027 Semester 1",
        description: "Chemical Bonding, Kinetics, Catalysis និង Physical Chemistry",
        leaderName: "ខេង លីឧស្សាហ៍ (KHENG Lyussa)",
        enrolledMembersCount: 30,
        totalSessions: 10,
        completedSessions: 1,
        myAttendanceRate: 100,
        roleInCourse: "Enrolled Member",
      },
    ];

    return NextResponse.json({ success: true, courses });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load courses";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
