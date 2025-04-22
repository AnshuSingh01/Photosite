document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Calendar functionality
    const calendar = document.getElementById("calendar");
    const monthLabel = document.getElementById("month-label");
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");
    const eventCards = document.querySelectorAll(".event-card");
    const events = Array.from(eventCards).map(card => {
        const date = new Date(card.getAttribute("data-date"));
        if (!isNaN(date)) {
            card.setAttribute("data-date", date.toISOString().split("T")[0]);
        }
        return { date: card.getAttribute("data-date"), element: card };
    });

    let currentDate = new Date();

    // Render calendar for the given date
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Set the month label
        monthLabel.textContent = `${monthNames[month]} ${year}`;

        // Clear previous calendar
        calendar.innerHTML = `
            <div class="calendar-header">
                ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => `<div class="calendar-day-name">${day}</div>`).join("")}
            </div>
        `;

        const calendarBody = document.createElement("div");
        calendarBody.classList.add("calendar-body");

        // Fill empty days before the start of the month
        for (let i = 0; i < firstDay; i++) {
            calendarBody.appendChild(document.createElement("div"));
        }

        // Create calendar days
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement("div");
            day.className = "day";
            day.textContent = i;

            const dateAttr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
            day.setAttribute("data-date", dateAttr);

            // Highlight today's date
            if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                day.classList.add("highlight");
            }

            // Add event indicator
            if (events.find(e => e.date === dateAttr)) {
                day.classList.add("has-event");
            }

            calendarBody.appendChild(day);
        }

        calendar.appendChild(calendarBody);
    }

    // Navigation buttons for month switching
    prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);

    // Modal functionality for event details
    const modal = document.getElementById("eventModal");
    const modalBody = document.getElementById("modal-body");
    const closeModal = document.querySelector(".close-btn");

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("day")) {
            const clickedDate = e.target.getAttribute("data-date");
            const matchingEvent = document.querySelector(`.event-card[data-date="${clickedDate}"]`);

            if (matchingEvent) {
                modalBody.innerHTML = `
                    <h3>${matchingEvent.querySelector("h3").textContent}</h3>
                    <p>${matchingEvent.querySelector("p").innerHTML}</p>
                `;
            } else {
                modalBody.innerHTML = `<p><strong>Date:</strong> ${clickedDate}<br>No event found for this date.</p>`;
            }

            modal.style.display = "block";
        }

        if (e.target === modal || e.target === closeModal) {
            modal.style.display = "none";
        }
    });

    // Scroll and highlight event day when event card is clicked
    document.querySelectorAll(".event-card").forEach(card => {
        card.addEventListener("click", () => {
            const date = card.getAttribute("data-date");
            const dayEl = document.querySelector(`.day[data-date="${date}"]`);
            if (dayEl) {
                dayEl.scrollIntoView({ behavior: "smooth", block: "center" });
                dayEl.classList.add("highlight");
                setTimeout(() => dayEl.classList.remove("highlight"), 2000);
            }
        });
    });

    // Filter functionality to toggle event categories (upcoming/past)
    const upcomingBtn = document.getElementById("show-upcoming");
    const pastBtn = document.getElementById("show-past");

    if (upcomingBtn && pastBtn) {
        upcomingBtn.addEventListener("click", () => {
            document.querySelectorAll("#past-events .event-card").forEach(e => e.style.display = "none");
            document.querySelectorAll("#upcoming-events .event-card").forEach(e => e.style.display = "block");
        });

        pastBtn.addEventListener("click", () => {
            document.querySelectorAll("#past-events .event-card").forEach(e => e.style.display = "block");
            document.querySelectorAll("#upcoming-events .event-card").forEach(e => e.style.display = "none");
        });
    }
});