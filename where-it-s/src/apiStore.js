import { create } from 'zustand';
import axios from 'axios';
import { useEffect } from 'react';

const useEvents = create((set) => ({
    events: [],
    fetchEvents: async () => {
        try {
            const response = await axios.get('https://santosnr6.github.io/Data/events.json');
            const eventsWithId = response.data.events.map(event => ({
                ...event,
                eventId: event.id,
            }));
            set({ events: eventsWithId });
        } catch (error) {
            console.error('Fel i hämtningen av events:', error);
        }
    },
}));

export default useEvents;
