import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create Bus Operators
  const operator1 = await prisma.busOperator.create({
    data: {
      name: 'RedBus Express',
      email: 'contact@redbusexpress.com',
      phone: '+91-9876543210',
      address: '123 Transport Hub, Mumbai, Maharashtra',
      licenseNo: 'MH-OP-2024-001',
    },
  })

  const operator2 = await prisma.busOperator.create({
    data: {
      name: 'TravelSafe Coaches',
      email: 'info@travelsafe.com',
      phone: '+91-9876543211',
      address: '456 Bus Terminal, Delhi, Delhi',
      licenseNo: 'DL-OP-2024-002',
    },
  })

  console.log('✅ Created bus operators')

  // Create Buses
  const bus1 = await prisma.bus.create({
    data: {
      operatorId: operator1.id,
      busNumber: 'MH-12-AB-1234',
      model: 'Volvo B11R',
      capacity: 45,
      amenities: JSON.stringify(['AC', 'WiFi', 'Charging Points', 'Entertainment System']),
    },
  })

  const bus2 = await prisma.bus.create({
    data: {
      operatorId: operator2.id,
      busNumber: 'DL-01-CD-5678',
      model: 'Mercedes-Benz 1623',
      capacity: 40,
      amenities: JSON.stringify(['AC', 'Reclining Seats', 'Reading Lights']),
    },
  })

  console.log('✅ Created buses')

  // Create Routes
  const route1 = await prisma.route.create({
    data: {
      operatorId: operator1.id,
      fromCity: 'Mumbai',
      toCity: 'Pune',
      distance: 150.5,
      estimatedDuration: 180, // 3 hours
    },
  })

  const route2 = await prisma.route.create({
    data: {
      operatorId: operator2.id,
      fromCity: 'Delhi',
      toCity: 'Agra',
      distance: 230.0,
      estimatedDuration: 240, // 4 hours
    },
  })

  console.log('✅ Created routes')

  // Create Schedules
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(8, 0, 0, 0) // 8 AM departure

  const arrivalTime1 = new Date(tomorrow)
  arrivalTime1.setHours(11, 0, 0, 0) // 11 AM arrival

  const schedule1 = await prisma.schedule.create({
    data: {
      routeId: route1.id,
      busId: bus1.id,
      departureTime: tomorrow,
      arrivalTime: arrivalTime1,
      basePrice: 500.0,
    },
  })

  const dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
  dayAfterTomorrow.setHours(14, 0, 0, 0) // 2 PM departure

  const arrivalTime2 = new Date(dayAfterTomorrow)
  arrivalTime2.setHours(18, 0, 0, 0) // 6 PM arrival

  const schedule2 = await prisma.schedule.create({
    data: {
      routeId: route2.id,
      busId: bus2.id,
      departureTime: dayAfterTomorrow,
      arrivalTime: arrivalTime2,
      basePrice: 750.0,
    },
  })

  console.log('✅ Created schedules')

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+91-9876543212',
      dateOfBirth: new Date('1990-05-15'),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+91-9876543213',
      dateOfBirth: new Date('1985-08-22'),
    },
  })

  console.log('✅ Created users')

  // Create Refund Policies
  const policy1 = await prisma.refundPolicy.create({
    data: {
      operatorId: operator1.id,
      name: 'Standard Refund Policy',
      description: 'Full refund if cancelled 24+ hours before departure',
      hoursBeforeDeparture: 24,
      refundPercentage: 100.0,
      processingFee: 0.0,
    },
  })

  const policy2 = await prisma.refundPolicy.create({
    data: {
      operatorId: operator1.id,
      name: 'Partial Refund Policy',
      description: '75% refund if cancelled 6-24 hours before departure',
      hoursBeforeDeparture: 6,
      refundPercentage: 75.0,
      processingFee: 50.0,
    },
  })

  const policy3 = await prisma.refundPolicy.create({
    data: {
      operatorId: operator2.id,
      name: 'Flexible Refund Policy',
      description: '90% refund if cancelled 12+ hours before departure',
      hoursBeforeDeparture: 12,
      refundPercentage: 90.0,
      processingFee: 25.0,
    },
  })

  console.log('✅ Created refund policies')

  // Create Sample Booking
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      scheduleId: schedule1.id,
      bookingRef: 'BS-' + Date.now(),
      totalAmount: 1000.0,
      status: 'CONFIRMED',
      passengerCount: 2,
      contactEmail: user1.email,
      contactPhone: user1.phone!,
    },
  })

  console.log('✅ Created booking')

  // Create Tickets for the booking
  await prisma.ticket.create({
    data: {
      bookingId: booking1.id,
      seatNumber: 'A1',
      passengerName: 'John Doe',
      passengerAge: 34,
      gender: 'MALE',
      price: 500.0,
      status: 'ACTIVE',
    },
  })

  await prisma.ticket.create({
    data: {
      bookingId: booking1.id,
      seatNumber: 'A2',
      passengerName: 'Jane Doe',
      passengerAge: 32,
      gender: 'FEMALE',
      price: 500.0,
      status: 'ACTIVE',
    },
  })

  console.log('✅ Created tickets')

  // Create Payment for the booking
  await prisma.payment.create({
    data: {
      userId: user1.id,
      bookingId: booking1.id,
      amount: 1000.0,
      paymentMethod: 'UPI',
      transactionId: 'TXN-' + Date.now(),
      status: 'COMPLETED',
      processedAt: new Date(),
    },
  })

  console.log('✅ Created payment')

  // Create a sample refund request
  await prisma.refund.create({
    data: {
      userId: user2.id,
      bookingId: booking1.id,
      policyId: policy1.id,
      requestedAmount: 1000.0,
      refundAmount: 1000.0,
      processingFee: 0.0,
      reason: 'Change of travel plans',
      status: 'PENDING',
    },
  })

  console.log('✅ Created refund request')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })