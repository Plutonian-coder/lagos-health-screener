export const initialDoctors = [
    {
        id: 1,
        name: "Dr. Chioma Adebayo",
        specialty: "Cardiologist",
        hospital: "LUTH Idi-Araba",
        statusOverride: null, // 'Offline' manually
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        price: 15000,
        rating: 4.9,
        distanceFromUser: 5, // km
        schedule: [
            { time: "09:00 AM", isBooked: false, isBreak: false },
            { time: "10:00 AM", isBooked: true, patient: "John Doe", isBreak: false },
            { time: "11:00 AM", isBooked: false, isBreak: false },
            { time: "12:00 PM", isBooked: false, isBreak: false }, // 3 open
            { time: "01:00 PM", isBooked: false, isBreak: true }, // Break
            { time: "02:00 PM", isBooked: false, isBreak: false }  // 4 open
        ]
    },
    {
        id: 2,
        name: "Dr. Babatunde Okafor",
        specialty: "General Practitioner",
        hospital: "Alimosho General Hospital",
        statusOverride: null,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        price: 5000,
        rating: 4.5,
        distanceFromUser: 2, // km
        schedule: [
            { time: "08:30 AM", isBooked: true, patient: "Sarah K.", isBreak: false },
            { time: "09:30 AM", isBooked: true, patient: "Mike T.", isBreak: false },
            { time: "10:30 AM", isBooked: false, isBreak: false }, // 1 open
            { time: "11:30 AM", isBooked: true, patient: "Lola B.", isBreak: false },
            { time: "12:30 PM", isBooked: false, isBreak: true } // Break
        ]
    },
    {
        id: 3,
        name: "Dr. Funke Akindele",
        specialty: "Pediatrician",
        hospital: "Massey Children Hospital",
        statusOverride: null,
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        price: 8000,
        rating: 4.8,
        distanceFromUser: 12,
        schedule: [
            { time: "09:00 AM", isBooked: true, isBreak: false },
            { time: "09:30 AM", isBooked: true, isBreak: false },
            { time: "10:00 AM", isBooked: true, isBreak: false },
            { time: "10:30 AM", isBooked: true, isBreak: false }
        ]
    },
    {
        id: 4,
        name: "Dr. Emmanuel Kalu",
        specialty: "Neurologist",
        hospital: "Reddington Hospital",
        statusOverride: "Offline",
        image: "https://randomuser.me/api/portraits/men/85.jpg",
        price: 25000,
        rating: 4.7,
        distanceFromUser: 8,
        schedule: [
            { time: "01:00 PM", isBooked: false, isBreak: false },
            { time: "03:00 PM", isBooked: false, isBreak: false }
        ]
    },
    {
        id: 5,
        name: "Dr. Hassan Musa",
        specialty: "General Practitioner",
        hospital: "St Kizito Clinic",
        statusOverride: null,
        image: "https://randomuser.me/api/portraits/men/62.jpg",
        price: 3000, // Cheaper
        rating: 4.6,
        distanceFromUser: 1.5, // Closer
        schedule: [
            { time: "3:00 AM", isBooked: false, isBreak: false }, // Reference to prompt
            { time: "08:00 AM", isBooked: false, isBreak: false },
            { time: "09:00 AM", isBooked: false, isBreak: false },
            { time: "10:00 AM", isBooked: false, isBreak: false }
        ]
    }
];
