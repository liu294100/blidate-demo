import { PrismaClient, UserRole, Gender, Education } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const adminPassword = await hash("admin123456", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@blinddate.com" },
        update: {},
        create: {
            email: "admin@blinddate.com",
            passwordHash: adminPassword,
            role: UserRole.ADMIN,
            locale: "zh",
            profile: {
                create: {
                    name: "系统管理员",
                    gender: Gender.MALE,
                    birthDate: new Date("1990-01-01"),
                },
            },
        },
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // Create demo users
    const userPassword = await hash("user123456", 12);

    const demoUsers = [
        {
            email: "alice@example.com",
            name: "Alice Wang",
            gender: Gender.FEMALE,
            birthDate: new Date("1996-05-15"),
            height: 165,
            weight: 52,
            education: Education.BACHELOR,
            occupation: "Product Designer",
            income: "15k-25k",
            bio: "Love traveling, reading and coffee ☕",
            city: "Shanghai",
        },
        {
            email: "bob@example.com",
            name: "Bob Li",
            gender: Gender.MALE,
            birthDate: new Date("1994-08-20"),
            height: 178,
            weight: 72,
            education: Education.MASTER,
            occupation: "Software Engineer",
            income: "25k-40k",
            bio: "Tech enthusiast, gym lover 💪",
            city: "Beijing",
        },
        {
            email: "carol@example.com",
            name: "Carol Chen",
            gender: Gender.FEMALE,
            birthDate: new Date("1997-03-10"),
            height: 162,
            weight: 48,
            education: Education.BACHELOR,
            occupation: "Marketing Manager",
            income: "12k-20k",
            bio: "Foodie and yoga lover 🧘‍♀️",
            city: "Shenzhen",
        },
        {
            email: "david@example.com",
            name: "David Zhang",
            gender: Gender.MALE,
            birthDate: new Date("1993-11-25"),
            height: 182,
            weight: 78,
            education: Education.MASTER,
            occupation: "Finance Analyst",
            income: "30k-50k",
            bio: "Jazz music, hiking and cooking 🎵",
            city: "Guangzhou",
        },
        {
            email: "emma@example.com",
            name: "Emma Liu",
            gender: Gender.FEMALE,
            birthDate: new Date("1998-07-08"),
            height: 168,
            weight: 55,
            education: Education.BACHELOR,
            occupation: "Teacher",
            income: "8k-15k",
            bio: "Cat person, movie buff 🎬",
            city: "Chengdu",
        },
    ];

    for (const u of demoUsers) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                passwordHash: userPassword,
                role: UserRole.USER,
                locale: "zh",
                profile: {
                    create: {
                        name: u.name,
                        gender: u.gender,
                        birthDate: u.birthDate,
                        height: u.height,
                        weight: u.weight,
                        education: u.education,
                        occupation: u.occupation,
                        income: u.income,
                        bio: u.bio,
                        city: u.city,
                        isVerified: true,
                        moderationStatus: "APPROVED",
                    },
                },
                matchPreference: {
                    create: {
                        minAge: 22,
                        maxAge: 40,
                        genderPref: u.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE,
                    },
                },
            },
        });
        console.log(`✅ Demo user created: ${user.email}`);
    }

    // Create system configs
    const configs = [
        { key: "unlock_price", value: "29.9", description: "单次解锁价格(元)" },
        { key: "vip_monthly_price", value: "99", description: "VIP月费(元)" },
        { key: "daily_recommend_count", value: "10", description: "每日推荐数量" },
        { key: "max_photos", value: "9", description: "最大照片数量" },
    ];

    for (const config of configs) {
        await prisma.systemConfig.upsert({
            where: { key: config.key },
            update: { value: config.value },
            create: config,
        });
    }
    console.log("✅ System configs created");

    console.log("🎉 Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
