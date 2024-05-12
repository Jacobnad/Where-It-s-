import { createContext, useContext, useEffect, useState } from 'react';
import useApiStore from './apiStore';
import { useNavigate } from 'react-router-dom';

const OrderContext = createContext();
const useOrderContext = () => useContext(OrderContext);

const OrderContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const { events, fetchEvents } = useApiStore();
    const [orders, setOrders] = useState([]);
    const [ticketCounts, setTicketCounts] = useState([]);
    const [eventPrices, setEventPrices] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [tickets, setTickets] = useState([]);

    const addOrder = (order) => {
        /*console.log('addOrder order', order);*/
        setOrders(prevOrders => {
            const existingOrderIndex = prevOrders.findIndex(o => o.id === order.id);
            if (existingOrderIndex !== -1) {

                const updatedOrders = [...prevOrders];
                updatedOrders[existingOrderIndex] = {
                    ...updatedOrders[existingOrderIndex],
                    ticketCount: updatedOrders[existingOrderIndex].ticketCount + order.ticketCount,
                    totalPrice: updatedOrders[existingOrderIndex].totalPrice + (order.ticketCount * order.price)
                };
                return updatedOrders;
            } else {
                const firstOrder = prevOrders.slice(0, 1);
                const remainingOrders = prevOrders.slice(1);
                return [...firstOrder, order, ...remainingOrders];
            }
        });
    };

    const removeOrder = (orderId) => {
        const updatedOrders = orders.filter((order) => order.id !== orderId);
        setOrders(updatedOrders);
        setTicketCounts({});
        setEventPrices({});
        setTotalPrice(0);
    };

    const addTickets = (eventId, number, pricePerTicket) => {
        const newCount = (ticketCounts[eventId] || 0) + number;
        const newEventPrice = (eventPrices[eventId] || 0) + number * pricePerTicket;
        const newTotalPrice = totalPrice + number * pricePerTicket;

        setTicketCounts(prevTicketCounts => ({ ...prevTicketCounts, [eventId]: newCount }));
        setEventPrices(prevEventPrices => ({ ...prevEventPrices, [eventId]: newEventPrice }));
        setTotalPrice(newTotalPrice);
    };

    const removeTickets = (eventId, number, pricePerTicket) => {
        const currentCount = ticketCounts[eventId] || 0;
        const newCount = Math.max(currentCount - number, 0);
        const priceReduction = number * pricePerTicket;

        setTicketCounts(prevTicketCounts => ({ ...prevTicketCounts, [eventId]: newCount }));
        setEventPrices(prevEventPrices => ({ ...prevEventPrices, [eventId]: Math.max((prevEventPrices[eventId] || 0) - priceReduction, 0) }));
        setTotalPrice(prevTotalPrice => Math.max(prevTotalPrice - priceReduction, 0));

        if (newCount === 0) {
            const updatedOrders = orders.filter(order => order.eventId !== eventId);
            setOrders(updatedOrders);
        }
    };

    const generateTicketsForOrders = (orders) => {
        console.log("Input Orders:", orders);

        const generatedTickets = [];

        if (Array.isArray(orders)) {

            console.log("Input Orders:", orders);

            orders.forEach((order, index) => {
                const numTickets = order.ticketCount || 0;

                // Log individual order details
                console.log(`Order ${index + 1} Details:`, order);

                for (let i = 0; i < numTickets; i++) {
                    // Generate ticket ID using order ID, index, and ticket index
                    const ticketId = `${order.id}-${order.name}-${order.date}-${i}`;

                    console.log(`Generated Ticket ID: ${ticketId}`);

                    const ticketInfo = {
                        ticketId,
                        eventName: order.name,
                        eventLocation: order.where,
                        eventDate: order.date,
                        eventFrom: order.from,
                        eventTo: order.to,
                    };

                    console.log("Ticket Information:", ticketInfo);

                    generatedTickets.push(ticketInfo);
                }
            });
        } else {
            console.error("Orders is not an array.");
        }

        console.log("Generated Tickets:", generatedTickets);

        return generatedTickets;
    };

    const confirmOrder = () => {
        try {
            console.log('Orders before generating tickets:', orders);

            const newTickets = generateTicketsForOrders(Array.isArray(orders) ? orders : [orders]);
            console.log('Generated tickets:', newTickets);

            setTickets(newTickets);
        
            navigate('/tickets');
        } catch (error) {
            console.error('Error in confirmOrder:', error);
        }
    };

    const clearOrders = () => {
        setOrders([]);
        setEventPrices({});
        setTotalPrice(0);
        console.log('Orders and related states cleared');
    }

    const updateOrder = (orderId, ticketChange, isAdding) => {
        const order = orders.find(order => order.eventId === orderId);
        const currentTicketCount = order ? order.ticketCount : 0;
        const updatedTicketCount = isAdding ? currentTicketCount + ticketChange : Math.max(currentTicketCount - ticketChange, 0);

        const updatedOrders = orders.map(order => {
            if (order.eventId === orderId) {
                return { ...order, ticketCount: updatedTicketCount };
            }
            return order;
        });
        setOrders(updatedOrders);

        setTicketCounts(prevTicketCounts => ({
            ...prevTicketCounts,
            [orderId]: updatedTicketCount
        }));

        const newTotalPrice = updatedOrders.reduce((total, order) => {
            return total + (order.ticketCount * order.price);
        }, 0);
        setTotalPrice(newTotalPrice);
    };

    /*------------------------- till tickets ---------------------------*/
    const randomTicketId = (existingIds) => {
        const generateId = () => {
            let Id = '';
            for (let i = 0; i < 5; i++) {
                const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
                Id += randomChar;
            }
            return Id;
        };

        let newId = generateId();
        while (existingIds.includes(newId)) {
            newId = generateId();
        }
        return newId;
    }

    const generateSeating = (existingTickets, numTickets) => {
        const sections = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.replace(/[ÅÄÖ]/g, '');
        let section = sections[Math.floor(Math.random() * sections.length)];

        let maxSeatNum = existingTickets.reduce((max, ticket) => {
            return ticket.section === section ? Math.max(max, ticket.seat) : max;
        }, 0);

        let seats = [];
        for (let i = 1; i <= numTickets; i++) {
            seats.push({
                section: section,
                seat: maxSeatNum + i
            });
        }
        return seats;
    }

    const value = {
        events,
        orders,
        addTickets,
        removeTickets,
        ticketCounts,
        eventPrices,
        setEventPrices,
        totalPrice,
        setTotalPrice,
        addOrder,
        setOrders,
        clearOrders,
        removeOrder,
        confirmOrder,
        updateOrder,
        randomTicketId,
        generateSeating,
        generateTicketsForOrders,
        tickets,
        setTickets
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export { OrderContextProvider, useOrderContext, OrderContext };