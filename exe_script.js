document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Team data with photo filenames (firstname.png format)
    const facultyMembers = [
        {
            name: "Dr. Saneesh",
            position: "Faculty Advisor",
            department: "ECE",
            photo: "a.png",
            email: "#",
            linkedin: "#",
            website: "#"
        },
        {
            name: "Dr. Asha",
            position: "Co-Advisor",
            department: "ECE",
            photo: "a.png",
            email: "#",
            linkedin: "#",
            website: "#"
        }
    ];

    const studentMembers = [
        {
            name: "AMIT Patil",
            position: "Chairperson",
            department: "ECE",
            photo: "a.png",
            email: "#",
            linkedin: "https://www.linkedin.com/in/amit-patil-480773155?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bhn8QL4azTxGrlHYo4rMqSg%3D%3D"
        },
        {
            name: "Abhishek V V",
            position: "Vice Chair",
            department: "ECE",
            photo: "a.png",
            email: "#",
            linkedin: "https://www.linkedin.com/in/abhishek-v-v-09012b300?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {
            name: "Varsha S Kundur",
            position: "Secretary",
            department: "ECE",
            photo: "a.png",
            email: "#",
            linkedin: "https://www.linkedin.com/in/varsha-s-kundur?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B22D%2FMFPGTbG7KtJVsVkSvw%3D%3D"
        },
        {
            name: "Vaishnavi S Ghasti",
            position: "R&D Head",
            department: "ECE",
            photo: "a.png",
            email: "#",
            linkedin: "#"
        },
        {
            name: "Shreyas Bhat V",
            position: "CO R&D Head",
            department: "ECE",
            photo: "sbv.png",
            email: "#",
            linkedin: "https://www.linkedin.com/in/shreyas-bhat-v-48a18a25b?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BnTBdv9FoTZCz2HI5EFsJLg%3D%3D"
        },
        {
            name: "Yashvanth",
            position: "Project Head",
            department: "ECE",
            photo: "a.png",
            email: "#",
            linkedin: "#"
        },
        {
            name: "Prathibha Gowda",
            position: "Treasurer",
            department: "ISE",
            photo: "prathibha.jpg",
            email: "#",
            linkedin: "#"
        },
        {
            name: "Anshu Singh",
            position: "Web Master",
            department: "CSE",
            photo: "anshu.png",
            email: "mailto:anshusingh63761@gmail.com",
            linkedin: "https://www.linkedin.com/in/anshu-singh-a11994330?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BAPXeUS8hS3mMdHnK1EuvRA%3D%3D"
        },
        {
            name: "Sumit Hirave",
            position: "Web Master",
            department: "CSE",
            photo: "sumit.jpg",
            email: "mailto:sumithirave7@gmail.com",
            linkedin: "https://www.linkedin.com/in/sumit-hirave-b7b2b5302?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        }
    ];

    // Load faculty members
    const facultyGrid = document.getElementById('faculty-grid');
    facultyMembers.forEach((member, index) => {
        facultyGrid.appendChild(createMemberCard(member, true, index));
    });

    // Load student members
    const studentGrid = document.getElementById('student-grid');
    studentMembers.forEach((member, index) => {
        studentGrid.appendChild(createMemberCard(member, false, index + facultyMembers.length));
    });

    // Create member card with photo
    function createMemberCard(member, isFaculty, delayIndex) {
        const memberCard = document.createElement('div');
        memberCard.className = `team-member ${isFaculty ? 'faculty' : ''}`;
        
        memberCard.innerHTML = `
            <div class="member-photo">
                <img src="${member.photo}" alt="${member.name}" onerror="this.src='team-photos/default.png'">
            </div>
            <div class="member-info">
                <h3 class="member-name">${member.name}</h3>
                <div class="member-position">${member.position}</div>
                <div class="member-department">${member.department}</div>
                <div class="social-links">
                    <a href="${member.email}" aria-label="Email"><i class="fas fa-envelope"></i></a>
                    <a href="${member.linkedin}" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    ${isFaculty ? `<a href="${member.website}" aria-label="Website"><i class="fas fa-globe"></i></a>` : ''}
                </div>
            </div>
        `;
        
        // Animate with delay
        setTimeout(() => {
            memberCard.classList.add('show');
        }, delayIndex * 100);
        
        return memberCard;
    }
});




document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
});