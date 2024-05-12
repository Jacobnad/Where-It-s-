import React, { useState } from 'react';
import { GoHomeFill, GoHome } from 'react-icons/go';
import { IoCalendar, IoCalendarClearOutline, IoTicket, IoTicketOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom'
import './navBar.css';

function NavBar() {
    const [activePage, setActivePage] = useState(null);

    const NavItem = ({ to, label, icon, iconFilled }) => {
        const IconComponent = activePage === label ? iconFilled : icon;

        return (
            <Link to={to} role='link' aria-label={`link to ${label}`}>
                <IconComponent
                    className="navBar__icon"
                    color='white'
                    size={35}
                    onMouseEnter={() => setActivePage(label)}
                    onMouseLeave={() => setActivePage(null)}
                />
            </Link>
        );
    };

    return (
        <div>
            <section className="navBar__container">
                <NavItem to="/" label="home" icon={GoHome} iconFilled={GoHomeFill} />
                <NavItem to="/events" label="calendar" icon={IoCalendarClearOutline} iconFilled={IoCalendar} />
                <NavItem to="/orders" label="tickets" icon={IoTicketOutline} iconFilled={IoTicket} />
            </section>
        </div>
    );
}

export default NavBar;

