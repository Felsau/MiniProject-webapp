import { PrismaClient } from '@prisma/client'
// 👇 เพิ่มบรรทัดนี้: เลือกใช้อันใดอันหนึ่งตามที่คุณลงไว้ใน package.json
import * as bcrypt from 'bcrypt' 
// import * as bcrypt from 'bcryptjs' // <--- ถ้าบรรทัดบน error ให้เปิดบรรทัดนี้แทน

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 กำลังล้างข้อมูลเก่า...')
  try {
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
  } catch (e) {
    console.log('สร้าง Database ใหม่...')
  }

  // ✅ สร้างรหัส "123456" แบบสดๆ จากเครื่องคุณเอง (ชัวร์แน่นอน)
  const passwordHash = await bcrypt.hash('123456', 10)

  console.log('👤 กำลังสร้าง User...')
  
  // 1. สร้าง Admin
  await prisma.user.create({
    data: {
      username: 'admin',
      password: passwordHash, // ใช้ตัวแปรที่เราเพิ่งสร้าง
      role: 'ADMIN',
      fullName: 'สมชาย แอดมิน',
      email: 'admin@company.com',
      phone: '081-111-1111',
      position: 'CTO',
      bio: 'ดูแลระบบทั้งหมดของบริษัท',
      jobs: {
        create: [
          {
            title: 'Senior React Developer',
            department: 'IT',
            location: 'Bangkok',
            salary: '60,000+',
            description: 'เขียน Frontend ด้วย Next.js'
          }
        ]
      }
    }
  })

  // 2. สร้าง HR
  await prisma.user.create({
    data: {
      username: 'hr',
      password: passwordHash,
      role: 'HR',
      fullName: 'สุดสวย ใจดี',
      email: 'hr@company.com',
      phone: '099-999-9999',
      position: 'HR Manager',
      jobs: {
        create: [
          {
            title: 'Marketing Officer',
            department: 'Marketing',
            location: 'Chiang Mai',
            salary: '25,000',
            description: 'ดูแล Content และ Social Media'
          }
        ]
      }
    }
  })

  // 3. สร้าง User ทั่วไป
  await prisma.user.create({
    data: {
      username: 'employee',
      password: passwordHash,
      role: 'USER',
      fullName: 'พนักงานใหม่ ไฟแรง',
      email: 'employee@company.com',
      position: 'Junior Developer',
      bio: 'เพิ่งจบใหม่ครับ ฝากเนื้อฝากตัวด้วยครับ',
    }
  })

  console.log('✅ เสร็จแล้ว! ข้อมูลมาครบ (รหัส 123456 ใช้ได้ชัวร์)')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })