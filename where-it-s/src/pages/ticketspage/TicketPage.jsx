import { useEffect } from 'react';
import { useOrderContext } from '../../OrderContextProvider';
import TicketCard from '../../components/ticketCard/TicketCard';
import './ticketPage.css'

const TicketPage = () => {
    const { orders, clearOrders } = useOrderContext();
    console.log('orders in ticketPage', orders);

    return (
        <div className="ticket-page">
            {orders.length === 0 ? (
                <p>No tickets available</p>
            ) : (
                <div className="ticket-list">
                    {orders.map(order => (
                        <TicketCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};


export default TicketPage;

