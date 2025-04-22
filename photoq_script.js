// script.js
const questions = [
    {
        question: "What is the physical principle behind total internal reflection (TIR) in optical fibers?",
        options: [
            "Snell’s Law at n₁ > n₂, θ > θ_critical",
            "Fresnel reflections at the core-cladding interface",
            "Rayleigh scattering in the core",
            "Modal dispersion in multimode fibers"
        ],
        correctAnswer: "Snell’s Law at n₁ > n₂, θ > θ_critical"
    },
    {
        question: "A step-index fiber has a core index (n₁) = 1.48 and cladding index (n₂) = 1.46. What is its numerical aperture (NA)?",
        options: [
            "0.12",
            "0.24",
            "0.34",
            "0.48"
        ],
        correctAnswer: "0.24"
    },
    {
        question: "Why do single-mode fibers (SMF) eliminate modal dispersion?",
        options: [
            "They only allow the fundamental LP₀₁ mode",
            "They have a larger core diameter",
            "They use graded-index profiles",
            "They operate only at visible wavelengths"
        ],
        correctAnswer: "They only allow the fundamental LP₀₁ mode"
    },
    {
        question: "An optical signal at 1550 nm travels 50 km in a fiber with attenuation 0.2 dB/km. What % of power remains?",
        options: [
            "1%",
            "10%",
            "50%",
            "63%"
        ],
        correctAnswer: "10%"
    },
    {
        question: "What is the primary cause of chromatic dispersion in fibers?",
        options: [
            "Different propagation speeds of wavelengths",
            "Polarization-mode coupling",
            "Nonlinear Kerr effect",
            "Rayleigh scattering"
        ],
        correctAnswer: "Different propagation speeds of wavelengths"
    },
    {
        question: "A Gaussian pulse (T₀ = 10 ps) propagates in a fiber with β₂ = -20 ps²/km. What is its width after 5 km?",
        options: [
            "10 ps",
            "14.1 ps",
            "20 ps",
            "22.4 ps"
        ],
        correctAnswer: "14.1 ps"
    },
    {
        question: "Why does the nonlinear Schrödinger equation include both β₂ and γ?",
        options: [
            "To account for dispersion and nonlinearity",
            "To model Raman scattering only",
            "To describe quantum noise",
            "To calculate bending losses"
        ],
        correctAnswer: "To account for dispersion and nonlinearity"
    },
    {
        question: "A soliton requires N² = γP₀T₀² / |β₂| = 1. If γ = 2 W⁻¹km⁻¹, β₂ = -1 ps²/km, and T₀ = 10 ps, what is P₀?",
        options: [
            "5 mW",
            "50 mW",
            "500 mW",
            "5 W"
        ],
        correctAnswer: "50 mW"
    },
    {
        question: "In coherent optical communications, what is the advantage of a dual-polarization quadrature phase-shift keying (DP-QPSK) receiver?",
        options: [
            "Doubles spectral efficiency using polarization multiplexing",
            "Reduces laser linewidth requirements",
            "Eliminates the need for error correction",
            "Uses direct detection instead of local oscillators"
        ],
        correctAnswer: "Doubles spectral efficiency using polarization multiplexing"
    },
    {
        question: "A silicon ring resonator has ng = 4, radius = 10 µm. What is its FSR in GHz?",
        options: [
            "12.5 GHz",
            "25 GHz",
            "50 GHz",
            "100 GHz"
        ],
        correctAnswer: "12.5 GHz"
    },
    {
        question: "Why can’t a PIN photodiode detect squeezed light?",
        options: [
            "It lacks phase-sensitive detection",
            "It has no gain",
            "It is too slow",
            "It only works at 1550 nm"
        ],
        correctAnswer: "It lacks phase-sensitive detection"
    },
    {
        question: "A supercontinuum source pumps at 1064 nm in a PCF with β₂ = -10 ps²/km. Which nonlinear effect dominates at high power?",
        options: [
            "Self-phase modulation (SPM)",
            "Four-wave mixing (FWM)",
            "Stimulated Raman scattering (SRS)",
            "Modulation instability"
        ],
        correctAnswer: "Stimulated Raman scattering (SRS)"
    },
    {
        question: "To design a low-loss silicon-to-InP laser coupler, which technique is most effective?",
        options: [
            "Edge coupling with tapers",
            "Grating couplers",
            "Vertical optical antennas",
            "Hybrid plasmonic waveguides"
        ],
        correctAnswer: "Edge coupling with tapers"
    },
    {
        question: "In a quantum key distribution (QKD) BB84 protocol, how does eavesdropping increase the BER?",
        options: [
            "By introducing phase errors",
            "By reducing photon flux",
            "By altering the wavelength",
            "By polarizing the photons"
        ],
        correctAnswer: "By introducing phase errors"
    },
    {
        question: "If optical fibers use total internal reflection to transmit light, what would happen if the fiber core and cladding had the same refractive index?",
        options: [
            "Light would travel through the fiber normally",
            "Light would get absorbed and not propagate",
            "Light would escape from the fiber instead of being guided",
            "The fiber would become more efficient in transmitting signals"
        ],
        correctAnswer: "Light would escape from the fiber instead of being guided"
    },
    {
        question: "If a laser beam were sent into space without any obstacles, would it spread out or remain a narrow beam indefinitely?",
        options: [
            "It would remain perfectly collimated forever",
            "It would eventually spread out due to diffraction",
            "It would get absorbed by the vacuum of space",
            "It would change into a different wavelength over time"
        ],
        correctAnswer: "It would eventually spread out due to diffraction"
    }
]



















let currentQuestionIndex = 0;
let timer;
let timeLeft = 30;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const timerElement = document.getElementById('timer');
const timeElement = document.getElementById('time');

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const button = document.createElement('div');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        optionsElement.appendChild(button);
    });

    // Reset timer for each new question
    timeLeft = 30;
    timerElement.style.display = 'none';
    optionsElement.style.pointerEvents = 'auto'; // Enable clicking options
}

function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');

    if (selectedOption === currentQuestion.correctAnswer) {
        options.forEach(option => {
            if (option.textContent === selectedOption) {
                option.classList.add('correct');
            }
        });
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion(); // Load the next question
            } else {
                // Redirect to Google after all questions are answered correctly
                window.location.href = "index5.html";
            }
        }, 1000); // Move to next question after 1 second
    } else {
        options.forEach(option => {
            if (option.textContent === selectedOption) {
                option.classList.add('incorrect');
            }
        });
        startTimer();
    }
}

function startTimer() {
    timerElement.style.display = 'block';
    optionsElement.style.pointerEvents = 'none'; // Disable clicking options

    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerElement.style.display = 'none';
            optionsElement.style.pointerEvents = 'auto'; // Re-enable clicking options
            timeLeft = 30;
            loadQuestion(); // Reload the same question
        }
    }, 1000);
}

// Load the first question
loadQuestion();

// You can use JavaScript to disable the right-click context menu:
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});