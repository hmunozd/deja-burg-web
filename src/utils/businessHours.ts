export interface BusinessHours {
    open: string; // Format: "HH:MM" (24h)
    close: string; // Format: "HH:MM" (24h)
    name: string;
}

export type WeekSchedule = Record<number, BusinessHours | null>;

function timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

export const BUSINESS_SCHEDULE: WeekSchedule = {
    0: { open: '17:30', close: '23:00', name: 'Domingo' },
    1: { open: '18:00', close: '22:40', name: 'Lunes' },
    2: null,
    3: { open: '18:00', close: '22:40', name: 'Miércoles' },
    4: { open: '18:00', close: '22:40', name: 'Jueves' },
    5: { open: '18:00', close: '22:40', name: 'Viernes' },
    6: { open: '12:00', close: '23:30', name: 'Sábado' }
};

export interface OpenStatus {
    isOpen: boolean;
    reason?: 'closed_tuesday' | 'outside_hours';
}

export function isRestaurantOpen(date: Date = new Date()): OpenStatus {
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const currentTime = hours * 60 + minutes;

    const todaySchedule = BUSINESS_SCHEDULE[day];

    if (!todaySchedule) {
        return { isOpen: false, reason: 'closed_tuesday' };
    }

    const openTime = timeToMinutes(todaySchedule.open);
    const closeTime = timeToMinutes(todaySchedule.close);

    if (currentTime >= openTime && currentTime <= closeTime) {
        return { isOpen: true };
    }

    return { isOpen: false, reason: 'outside_hours' };
}

export function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}
