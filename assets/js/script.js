function initThreeJS(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return;
    }

    const container = canvas.parentElement;
    if (!container) {
        return;
    }

    if (canvas.hasAttribute('data-threejs-init')) return;
    canvas.setAttribute('data-threejs-init', 'true');

    let scene, camera, renderer, particles, wireframe, wireframe2, mouseX = 0, mouseY = 0;
    let windowHalfX = container.clientWidth / 2;
    let windowHalfY = container.clientHeight / 2;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    scene.add(new THREE.AmbientLight(0x404040, 2));
    const pointLight = new THREE.PointLight(0xffffff, 2.5, 1000);
    pointLight.position.set(50, 50, 100);
    scene.add(pointLight);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 1500;
    const posArray = new Float32Array(particlesCnt * 3);
    for (let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (Math.random() * 15) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xF59E0B,
        opacity: 0.8
    });
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const geometry1 = new THREE.IcosahedronGeometry(15, 1);
    const wireframeMaterial1 = new THREE.LineBasicMaterial({
        color: 0x1E3A8A, 
        transparent: true,
        opacity: 0.3
    });
    wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geometry1), wireframeMaterial1);
    scene.add(wireframe);

    const geometry2 = new THREE.BoxGeometry(40, 40, 40, 5, 5, 5);
    const wireframeMaterial2 = new THREE.LineBasicMaterial({
        color: 0x4B5563, 
        transparent: true,
        opacity: 0.1
    });
    wireframe2 = new THREE.LineSegments(new THREE.WireframeGeometry(geometry2), wireframeMaterial2);
    scene.add(wireframe2);

    function onMouseMove(event) {
        const rect = container.getBoundingClientRect();
        mouseX = (event.clientX - rect.left) - (container.clientWidth / 2);
        mouseY = (event.clientY - rect.top) - (container.clientHeight / 2);
    }
    container.addEventListener('mousemove', onMouseMove, { passive: true });

    function onWindowResize() {
        if (!container) return;
        windowHalfX = container.clientWidth / 2;
        windowHalfY = container.clientHeight / 2;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0010;
        particles.rotation.y = time * 0.2;
        wireframe.rotation.x = time * 0.1;
        wireframe.rotation.y = time * 0.15;
        wireframe2.rotation.x = time * 0.05;
        wireframe2.rotation.y = time * 0.05;

        camera.position.x += (mouseX * 0.001 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.001 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();
}


let currentLang = 'fr'; 
let currentBookingData = {}; 

const BREVO_FORM_ACTION_URL = 'https://bd6310c2.sibforms.com/serve/MUIFACXEohFQ0C2kdH600BbEi7iQQWqmKTi4D8c6I4CJPmERFVNwoBAw1EGJuo7ZaABR9cauTOHRNTNkG_djmihnkC776-dot0anAnlEhQa4BwhTzFl0390HGAzuiU4XncI16Na0Y4Z9leW7lOIpi3_wzpUgJmbl_7Ips-jib5qf5AigoEuQIAHqGECC2RZsJTmdy1QuMIQfxC0zDw==';
const BREVO_FORM_EMAIL_FIELD_NAME = 'EMAIL';
const BREVO_LOCALE_FIELD_NAME = 'locale';
const HONEYPOT_FIELD_NAME = 'email_address_check';
const ALLOWED_EMAIL_DOMAINS = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.fr',
    'live.com', 'live.fr', 'msn.com', 'icloud.com', 'protonmail.com',
    'menara.ma', 'iam.ma', 'maroc.ma', 'ocpgroup.ma', 'marsamaroc.co.ma',
    'tadrib.ma'
];

const courseData = {
    pmp: { originalPrice: 2800 },
    planning: { originalPrice: 2800 },
    qse: { originalPrice: 2450 },
    softskills: { originalPrice: 1700 },
    other: { originalPrice: 199 }
};
const discountPercentage = 35;

const translations = {
    ar: {
        modalTitle: "هل تخطط للحصول على شهادة PMP®؟",
        modalDesc: "احصل على قائمتنا المجانية لمساعدتك في تجهيز ملفك بنجاح وقبول طلبك من المرة الأولى.",
        modalEmail: "أدخل بريدك الإلكتروني هنا",
        modalSubmit: "احصل على دليلك المجاني الآن",
        pageTitle: "Tadrib.ma | دورات احترافية في إدارة المشاريع للمهندسين والمديرين",
        currency: "درهم",
        saveText: "وفر",
        BrevoThankYouTitle: "شكراً لك!",
        BrevoThankYouDesc: "تم تسجيل بريدك. المرجو التحقق من صندوق الوارد لتأكيد الاشتراك.",
        BrevoErrorRequired: "المرجو إدخال بريدك الإلكتروني.",
        BrevoErrorInvalid: "تنسيق البريد الإلكتروني غير صالح.",
        BrevoErrorDomain: "نحن نقبل فقط نطاقات البريد الشائعة (مثل Gmail, Hotmail).",
        PaymentSuccessTitle: "تم الدفع بنجاح!",
        PaymentSuccessMessage: "شكراً لك! لقد تم تأكيد حجزك. سنتواصل معك قريباً.",
        PaymentFailedTitle: "فشل الدفع",
        PaymentFailedMessage: "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو الاتصال بنا.",
        Close: "إغلاق",
        metaDescriptions:"يقدم موقع Tadrib.ma، الذي أسسه المهندس سمير بوشريط، تدريبًا عمليًا في إدارة المشاريع (PMP®)، والتخطيط، والجودة والسلامة والبيئة (QSE)، ومهارات قابلة للتحويل للمهندسين والمديرين في المغرب. طوّر مسيرتك المهنية مع خبير معتمد."
    },
    fr: {
        modalTitle: "Vous prévoyez d'obtenir la certification PMP® ?",
        modalDesc: "Obtenez notre guide gratuit pour vous aider à préparer votre dossier avec succès et à faire accepter votre demande du premier coup.",
        modalEmail: "Entrez votre adresse e-mail ici",
        modalSubmit: "Obtenez votre guide gratuit maintenant",
        pageTitle: "Tadrib.ma | Formations professionnelles en gestion de projet",
        currency: "DH",
        saveText: "Économisez",
        BrevoThankYouTitle: "Merci !",
        BrevoThankYouDesc: "Votre e-mail est enregistré. Veuillez vérifier votre boîte de réception pour confirmer.",
        BrevoErrorRequired: "Veuillez saisir votre e-mail.",
        BrevoErrorInvalid: "Le format de l'e-mail est invalide.",
        BrevoErrorDomain: "Nous n'acceptons que les domaines d'e-mail courants (ex: Gmail, Hotmail).",
        PaymentSuccessTitle: "Paiement réussi !",
        PaymentSuccessMessage: "Merci ! Votre réservation est confirmée. Nous vous contacterons bientôt.",
        PaymentFailedTitle: "Échec du paiement",
        PaymentFailedMessage: "Une erreur est survenue lors du paiement. Veuillez réessayer ou nous contacter.",
        Close: "Fermer",
        metaDescriptions:"Tadrib.ma, créé par l'ingénieur Samir Bouchrit, propose des formations pratiques en gestion de projet (PMP®), planification, QSE et compétences transversales pour les ingénieurs et les managers au Maroc. Boostez votre carrière avec un expert certifié."
    },
    en: {
        modalTitle: "Planning to get PMP® certified?",
        modalDesc: "Get our free checklist to help you prepare your application successfully and get it approved on the first try.",
        modalEmail: "Enter your email here",
        modalSubmit: "Get Your Free Guide Now",
        pageTitle: "Tadrib.ma | Professional Project Management Courses",
        currency: "MAD",
        saveText: "Save",
        BrevoThankYouTitle: "Thank You!",
        BrevoThankYouDesc: "Your email is registered. Please check your inbox to confirm.",
        BrevoErrorRequired: "Please enter your email.",
        BrevoErrorInvalid: "The email format is invalid.",
        BrevoErrorDomain: "We only accept common email domains (e.g., Gmail, Hotmail).",
        PaymentSuccessTitle: "Payment Successful!",
        PaymentSuccessMessage: "Thank you! Your booking is confirmed. We will contact you shortly.",
        PaymentFailedTitle: "Payment Failed",
        PaymentFailedMessage: "An error occurred while processing your payment. Please try again or contact us.",
        Close: "Close",
        metaDescriptions:"Tadrib.ma, founded by engineer Samir Bouchrit, offers practical training in project management (PMP®), planning, QSE (Quality, Safety, and Environment), and transferable skills for engineers and managers in Morocco. Boost your career with a certified expert."
    }
};

const bookingConfig = {
    paymentApiUrl: 'https://tadrib-notify-pay.vercel.app/api/payment',
    
    
    youcanPublicKey: 'pub_5c4db849-75e4-4978-9fb6-44a9926c',
    youcanMode: 'live', 

    steps: [1, 2],
    defaultLang: 'fr',
    courses: {
        pmp: { ar: 'الإدارة الاحترافية للمشاريع (PMP®)', fr: 'Gestion de Projet Professionnelle (PMP®)', en: 'Professional Project Management (PMP®)' },
        planning: { ar: 'إعداد وتخطيط المواقع', fr: 'Préparation et Planification de Chantier', en: 'Site Preparation and Planning' },
        qse: { ar: 'معايير QSE في المواقع', fr: 'Normes QSE en Chantier', en: 'QSE Standards on Sites' },
        softskills: { ar: 'المهارات الناعمة للمديرين', fr: 'Soft Skills pour Managers', en: 'Soft Skills for Managers' },
        other: { ar: 'استفسار عام', fr: 'Demande générale', en: 'General Inquiry' }
    },
    qualifications: {
        technician: { ar: 'تقني', fr: 'Technicien', en: 'Technician' },
        engineer: { ar: 'مهندس', fr: 'Ingénieur', en: 'Engineer' },
        master: { ar: 'ماستر', fr: 'Master', en: 'Master' },
        license: { ar: 'إجازة', fr: 'License', en: 'License' },
        other: { ar: 'آخر', fr: 'Autre', en: 'Other' },
    },
    experiences: {
        less_than_5: { ar: 'أقل من 5 سنوات', fr: 'Moins de 5 ans', en: 'Less than 5 years' },
        between_5_10: { ar: 'بين 5 و 10 سنوات', fr: 'Entre 5 et 10 ans', en: 'Between 5 and 10 years' },
        more_than_10: { ar: 'أكثر من 10 سنوات', fr: 'Plus que 10 ans', en: 'More than 10 years' },
    },
    
    translations: {
        ar: {
            ...translations.ar, 
            BookConsultation: "حجز مقعد أو استفسار", FillDetails: "املأ التفاصيل أدناه وسنتواصل معك.",
            Course: "الدورة المطلوبة", Qualification: "المؤهل العلمي", Experience: "عدد سنوات الخبرة", Email: "البريد الإلكتروني",
            YourDetails: "معلوماتك الشخصية", FullName: "الاسم الكامل", PhoneNumber: "رقم الهاتف",
            Next: 'التالي', Back: 'رجوع', SubmitInquiry: "تأكيد والانتقال للدفع",
            Processing: 'جاري المعالجة...',
            ConfirmDetails: "الرجاء تأكيد معلوماتك", ConfirmName: "الاسم:", ConfirmEmail: "البريد الإلكتروني:", ConfirmPhone: "الهاتف:", ConfirmCourse: "الدورة:", ConfirmQualification: "المؤهل:", ConfirmExperience: "الخبرة:",
            ConfirmCorrect: "هل هذه المعلومات صحيحة؟", EditButton: "تعديل", ConfirmButton: "نعم، تأكيد",
            ValidPhone: "الرجاء إدخال رقم هاتف صحيح.", ValidEmail: "الرجاء إدخال بريد إلكتروني صحيح.",
        },
        fr: {
            ...translations.fr, 
            BookConsultation: "Réserver une place ou se renseigner", FillDetails: "Remplissez les détails ci-dessous.",
            Course: "Formation souhaitée", Qualification: "Qualification", Experience: "Années d'expérience", Email: "Adresse e-mail",
            YourDetails: "Vos Coordonnées", FullName: "Nom complet", PhoneNumber: "Téléphone",
            Next: 'Suivant', Back: 'Retour', SubmitInquiry: "Confirmer et Payer",
            Processing: 'Traitement...',
            ConfirmDetails: "Confirmez vos informations", ConfirmName: "Nom :", ConfirmEmail: "E-mail :", ConfirmPhone: "Téléphone :", ConfirmCourse: "Formation :", ConfirmQualification: "Qualification :", ConfirmExperience: "Expérience :",
            ConfirmCorrect: "Ces informations sont-elles correctes ?", EditButton: "Modifier", ConfirmButton: "Oui, Confirmer",
            ValidPhone: "Veuillez entrer un numéro de téléphone valide.", ValidEmail: "Veuillez entrer une adresse e-mail valide.",
        },
        en: {
            ...translations.en, 
            BookConsultation: "Book a Seat or Inquire", FillDetails: "Fill out the details below.",
            Course: "Desired Course", Qualification: "Qualification", Experience: "Years of Experience", Email: "Email Address",
            YourDetails: "Your Details", FullName: "Full Name", PhoneNumber: "Phone Number",
            Next: 'Next', Back: 'Back', SubmitInquiry: "Confirm and Pay",
            Processing: 'Processing...',
            ConfirmDetails: "Please Confirm Your Details", ConfirmName: "Name:", ConfirmEmail: "Email:", ConfirmPhone: "Phone:", ConfirmCourse: "Course:", ConfirmQualification: "Qualification:", ConfirmExperience: "Experience:",
            ConfirmCorrect: "Is this information correct?", EditButton: "Edit", ConfirmButton: "Yes, Confirm",
            ValidPhone: "Please enter a valid phone number.", ValidEmail: "Please enter a valid email address.",
        }
    }
};



const body = document.body;

const leadMagnetModal = document.getElementById('leadMagnetModal');
const brevoThankYouModal = document.getElementById('brevoThankYouModal');
const brevoForm = document.getElementById('brevo-form');
const brevoEmailInput = document.getElementById('modal-email');
const brevoSubmitButton = document.getElementById('modal-submit');
const brevoErrorMessage = document.getElementById('brevo-error-message');
const brevoHoneypot = document.querySelector(`input[name="${HONEYPOT_FIELD_NAME}"]`);

const contactModalGeneric = document.getElementById('contact-modal-generic');
const courseSelectGeneric = document.getElementById('course-select-generic');
const formStep1Generic = document.getElementById('form-step-1-generic');
const formStep2Generic = document.getElementById('form-step-2-generic');
const nextButtonGeneric = document.getElementById('next-button-generic');
const backButtonStep2Generic = document.getElementById('back-button-step2-generic');
const formGeneric = document.getElementById('contact-form-generic');
const fullNameInputGeneric = document.getElementById('full-name-generic');
const emailInputGeneric = document.getElementById('email-generic');
const phoneInputGeneric = document.getElementById('phone-number-generic');
const submitButtonGeneric = document.getElementById('submit-button-generic');
const emailFormatErrorGeneric = document.getElementById('email-format-error-generic');
const phoneFormatErrorGeneric = document.getElementById('phone-format-error-generic');

const confirmationModalGeneric = document.getElementById('confirmation-modal-generic');
const confirmModalContentGeneric = document.getElementById('modal-content-confirm-generic');
const confirmButtonGeneric = document.getElementById('confirm-button-generic');
const confirmButtonTextGeneric = document.getElementById('confirm-button-text-generic');
const editButtonGeneric = document.getElementById('edit-button-generic');

const paymentStatusModal = document.getElementById('payment-status-modal');
const paymentStatusTitle = document.getElementById('payment-status-title');
const paymentStatusMessage = document.getElementById('payment-status-message');
const paymentSuccessIcon = document.getElementById('payment-success-icon');
const paymentFailedIcon = document.getElementById('payment-failed-icon');

const videoModal = document.getElementById('video-modal');
const courseVideo = document.getElementById('course-video');



const scrollPoints = { 25: false, 50: false, 75: false, 90: false, 100: false };
window.addEventListener('scroll', () => {
    if (typeof dataLayer === 'undefined') return;
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    for (const point in scrollPoints) {
        if (scrollPercentage >= point && !scrollPoints[point]) {
            dataLayer.push({ event: 'scroll_depth', 'scroll_percentage': parseInt(point) });
            scrollPoints[point] = true;
        }
    }
}, { passive: true });

/** 
 * @param {string} eventName 
 * @param {object} eventData
 */
function pushGtmEvent(eventName, eventData = {}) {
    console.log(`GTM Event: ${eventName}`, eventData);
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({ event: eventName, ...eventData });
    }
    if (typeof clarity === 'function') {
        clarity('set', eventName, 'true');
        if(eventData.transaction_id) {
            clarity('set', 'transaction_id', eventData.transaction_id);
        }
    }
}



function openModal() {
    if (leadMagnetModal) {
        leadMagnetModal.classList.remove('hidden');
        leadMagnetModal.classList.add('flex');
    }
    body.style.overflow = 'hidden';
}

function closeModal() {
    if (leadMagnetModal) {
        leadMagnetModal.classList.add('hidden');
        leadMagnetModal.classList.remove('flex');
    }
    body.style.overflow = 'auto';
    resetBrevoForm();
}

function showBrevoError(langKey) {
    brevoErrorMessage.textContent = translations[currentLang][langKey] || 'Error';
    brevoEmailInput.classList.add('border-red-500');
}

function resetBrevoForm() {
    if(brevoErrorMessage) brevoErrorMessage.textContent = '';
    if(brevoEmailInput) {
        brevoEmailInput.value = '';
        brevoEmailInput.classList.remove('border-red-500');
    }
    if (brevoSubmitButton) brevoSubmitButton.disabled = false;
}

function closeBrevoThankYouModal() {
    if (brevoThankYouModal) brevoThankYouModal.classList.add('modal-hidden');
    body.style.overflow = 'auto';
    resetBrevoForm();
}
window.closeBrevoThankYouModal = closeBrevoThankYouModal;

function validateAdvancedEmail(email) {
    if (!email) {
        showBrevoError('BrevoErrorRequired');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showBrevoError('BrevoErrorInvalid');
        return false;
    }
    const domain = email.split('@')[1].toLowerCase();
    if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
        showBrevoError('BrevoErrorDomain');
        return false;
    }
    return true;
}

async function submitToBrevo(email, lang) {
    if (brevoSubmitButton) brevoSubmitButton.disabled = true;
    resetBrevoForm();

    const formData = new FormData();
    formData.append(BREVO_FORM_EMAIL_FIELD_NAME, email);
    formData.append(BREVO_LOCALE_FIELD_NAME, lang);
    if (brevoHoneypot) formData.append(HONEYPOT_FIELD_NAME, brevoHoneypot.value);

    try {
        await fetch(BREVO_FORM_ACTION_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        closeModal();

        const langTranslations = translations[lang];
        document.getElementById('brevo-thankyou-title').textContent = langTranslations.BrevoThankYouTitle;
        document.getElementById('brevo-thankyou-desc').textContent = langTranslations.BrevoThankYouDesc;

        if (brevoThankYouModal) brevoThankYouModal.classList.remove('modal-hidden');
        body.style.overflow = 'hidden';

        
        pushGtmEvent('generate_lead_tadrib', {
            lead_details: {
                type: 'PMP Guide',
                email: email
            }
        });

    } catch (error) {
        console.error('Brevo submission error:', error);
        showBrevoError('BrevoErrorInvalid');
        if (brevoSubmitButton) brevoSubmitButton.disabled = false;
    }
}



function updateGenericFormLanguage(lang) {
    currentLang = lang;
    const translationSet = bookingConfig.translations[lang] || bookingConfig.translations[bookingConfig.defaultLang];
    document.querySelectorAll('#contact-modal-generic [data-lang-key], #confirmation-modal-generic [data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translationSet && translationSet[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = translationSet[key];
            else el.innerText = translationSet[key];
        }
    });
    populateGenericSelects(lang);
}

function showStepGeneric(step) {
    bookingConfig.steps.forEach(s => {
        const stepEl = document.getElementById(`form-step-${s}-generic`);
        if (stepEl) stepEl.classList.toggle('hidden', s !== step);
    });
}

function createRadioOptions(containerId, options, groupName, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    Object.keys(options).forEach(key => {
        const labelText = options[key][lang];
        const wrapper = document.createElement('div');
        wrapper.className = 'relative flex items-start';
        wrapper.innerHTML = `
            <div class="flex h-6 items-center">
                <input id="${groupName}-${key}" name="${groupName}" type="radio" value="${key}" class="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-amber" required>
            </div>
            <div class="ml-3 rtl:ml-0 rtl:mr-3 text-sm leading-6">
                <label for="${groupName}-${key}" class="font-medium text-gray-900">${labelText}</label>
            </div>`;
        container.appendChild(wrapper);
    });
}

function populateGenericSelects(lang) {
    if (courseSelectGeneric) {
        const placeholderKey = 'Course';
        courseSelectGeneric.innerHTML = `<option value="" disabled selected>${bookingConfig.translations[lang]?.[placeholderKey] || 'Select Course'}</option>`;
        for (const key in bookingConfig.courses) {
            courseSelectGeneric.innerHTML += `<option value="${key}">${bookingConfig.courses[key][lang] || key}</option>`;
        }
    }
    createRadioOptions('qualification-options', bookingConfig.qualifications, 'qualification', lang);
    createRadioOptions('experience-options', bookingConfig.experiences, 'experience', lang);
}

window.openContactModalGeneric = function(lang, preselectCourse = null) {
    if (!lang || !bookingConfig.translations[lang]) lang = bookingConfig.defaultLang;
    

    if (currentLang !== lang) {
        switchLang(lang);
    } else {
   
        updateGenericFormLanguage(lang);
    }

    setTimeout(() => {
        if (preselectCourse && courseSelectGeneric && courseSelectGeneric.querySelector(`option[value="${preselectCourse}"]`)) {
            courseSelectGeneric.value = preselectCourse;
        }
        showStepGeneric(bookingConfig.steps[0]); 
        if (contactModalGeneric) {
            contactModalGeneric.classList.remove('modal-hidden');
            document.body.style.overflow = 'hidden';
        }
    }, 50);
}

window.closeContactModalGeneric = function() {
    if (contactModalGeneric) {
        contactModalGeneric.classList.add('modal-hidden');
        document.body.style.overflow = '';
        if(confirmationModalGeneric) confirmationModalGeneric.classList.add('modal-hidden');
        if(formGeneric) formGeneric.reset();
        
        populateGenericSelects(currentLang);
        showStepGeneric(bookingConfig.steps[0]);
        
        if (submitButtonGeneric && submitButtonGeneric.parentElement) {
            submitButtonGeneric.parentElement.classList.remove('hidden');
        }
        
      
        if (confirmButtonGeneric) confirmButtonGeneric.disabled = false;
        if (editButtonGeneric) editButtonGeneric.disabled = false;
        if (confirmButtonTextGeneric) {
            const t = bookingConfig.translations[currentLang] || bookingConfig.translations[bookingConfig.defaultLang];
            confirmButtonTextGeneric.innerText = t['ConfirmButton'];
        }
    }
}

function showConfirmDialogGeneric() {
    if (!confirmationModalGeneric) return;

    const selectedCourseKey = courseSelectGeneric.value;
    const selectedCourseText = bookingConfig.courses[selectedCourseKey]?.[currentLang] || courseSelectGeneric.options[courseSelectGeneric.selectedIndex].text;
    const selectedQualKey = document.querySelector('input[name="qualification"]:checked')?.value;
    const selectedQualText = bookingConfig.qualifications[selectedQualKey]?.[currentLang] || 'N/A';
    const selectedExpKey = document.querySelector('input[name="experience"]:checked')?.value;
    const selectedExpText = bookingConfig.experiences[selectedExpKey]?.[currentLang] || 'N/A';

    document.getElementById('confirm-name-generic').innerText = fullNameInputGeneric.value;
    document.getElementById('confirm-email-generic').innerText = emailInputGeneric.value;
    document.getElementById('confirm-phone-generic').innerText = phoneInputGeneric.value;
    document.getElementById('confirm-course-generic').innerText = selectedCourseText;
    document.getElementById('confirm-qualification-generic').innerText = selectedQualText;
    document.getElementById('confirm-experience-generic').innerText = selectedExpText;


    currentBookingData = {
        inquiryId: `TADRIB-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`.toUpperCase(),
        courseKey: selectedCourseKey,
        courseText: selectedCourseText,
        qualText: selectedQualText,
        expText: selectedExpText,
        qualKey: selectedQualKey,
        expKey: selectedExpKey,
        name: fullNameInputGeneric.value,
        email: emailInputGeneric.value,
        phone: phoneInputGeneric.value
    };

    confirmationModalGeneric.classList.remove('modal-hidden');
    if (submitButtonGeneric?.parentElement) submitButtonGeneric.parentElement.classList.add('hidden');
    
    setTimeout(() => {
        if (confirmModalContentGeneric) {
            confirmModalContentGeneric.style.transform = 'scale(1)';
            confirmModalContentGeneric.style.opacity = '1';
        }
    }, 50);
}

function hideConfirmDialogGeneric() {
    if (confirmationModalGeneric) {
        if (confirmModalContentGeneric) {
            confirmModalContentGeneric.style.transform = 'scale(0.95)';
            confirmModalContentGeneric.style.opacity = '0';
        }
        if (formStep2Generic && !formStep2Generic.classList.contains('hidden') && submitButtonGeneric?.parentElement) {
            submitButtonGeneric.parentElement.classList.remove('hidden');
        }
        setTimeout(() => {
            confirmationModalGeneric.classList.add('modal-hidden');
        }, 300);
    }
}


 
async function handleBookingSubmit() {
    if (confirmButtonGeneric) confirmButtonGeneric.disabled = true;
    if (editButtonGeneric) editButtonGeneric.disabled = true;

    const t = bookingConfig.translations[currentLang] || bookingConfig.translations[bookingConfig.defaultLang];
    if (confirmButtonTextGeneric) {
        confirmButtonTextGeneric.innerText = t['Processing'] || 'Processing...';
    }

    try {
        
        const utmData = {};
        new URLSearchParams(window.location.search).forEach((value, key) => {
            if (key.startsWith('utm_')) utmData[key] = value;
        });

      
        const paymentData = {
            inquiryId: currentBookingData.inquiryId,
            clientName: currentBookingData.name,
            clientEmail: currentBookingData.email,
            clientPhone: currentBookingData.phone,
            courseKey: currentBookingData.courseKey,
            selectedCourse: currentBookingData.courseText,
            qualification: currentBookingData.qualText,
            experience: currentBookingData.expText,
            ...utmData
        };
      
        const tokenResponse = await fetch(bookingConfig.paymentApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(errorData.message || 'Failed to initialize payment');
        }
        
        const tokenData = await tokenResponse.json();
        if (tokenData.result !== 'success' || !tokenData.tokenId) {
            throw new Error(tokenData.message || 'Invalid payment token received');
        }
        
        const tokenId = tokenData.tokenId;
        

        pushGtmEvent('begin_checkout', {
            ecommerce: {
                items: [{
                    item_id: currentBookingData.courseKey,
                    item_name: currentBookingData.courseText,
                    price: Math.round((courseData[currentBookingData.courseKey].originalPrice * (1 - discountPercentage / 100)) / 50) * 50,
                    quantity: 1
                }],
                currency: 'MAD'
            },
            lead_details: currentBookingData
        });

     
        const isSandbox = bookingConfig.youcanMode === 'sandbox';
        const paymentBaseUrl = isSandbox ? 'https://youcanpay.com/sandbox' : 'https://youcanpay.com';
        const paymentURL = `${paymentBaseUrl}/payment-form/${tokenId}?lang=${currentLang}`;

       
        window.location.href = paymentURL;

       
    } catch (error) {
        console.error('Error during booking submission:', error);
        alert(`Error: ${error.message}. Please try again.`);
        
        
        if (confirmButtonGeneric) confirmButtonGeneric.disabled = false;
        if (editButtonGeneric) editButtonGeneric.disabled = false;
        if (confirmButtonTextGeneric) {
            confirmButtonTextGeneric.innerText = t['ConfirmButton'];
        }
    }
}


function handlePaymentStatusModal() {
    const hash = window.location.hash;
    if (!hash || (!hash.startsWith('#payment-success') && !hash.startsWith('#payment-failed'))) {
        return;
    }

    let hashParams = new URLSearchParams('');
    let hashBase = hash;

    if (hash.includes('?')) {
        const hashParts = hash.split('?');
        hashBase = hashParts[0]; 
        hashParams = new URLSearchParams(hashParts[1]); 
    }

    const success = hashParams.get('success');
    const message = hashParams.get('message');
    const transaction_id = hashParams.get('transaction_id');
    const t = translations[currentLang] || translations[bookingConfig.defaultLang];

    const isSuccessCallback = hashBase === '#payment-success' && (success === '1' || success === 'true');
    const isFailedCallback = hashBase === '#payment-failed' && (success === '0' || success === 'false');
    
    if ((isSuccessCallback && !transaction_id) || (!isSuccessCallback && !isFailedCallback)) {
        console.warn('Invalid or spoofed payment status hash detected. Cleaning URL and reloading.');
        cleanUrlHash(); 
        window.location.reload();
        return; 
    }

    if (paymentStatusModal && paymentStatusTitle && paymentStatusMessage && paymentSuccessIcon && paymentFailedIcon) {
        const closeButton = paymentStatusModal.querySelector('[data-lang-key="Close"]'); 
        if (closeButton) closeButton.innerText = t.Close;

        if (hashBase === '#payment-success' && (success === '1' || success === 'true')) {
            paymentStatusTitle.innerText = t.PaymentSuccessTitle;
            paymentStatusMessage.innerText = t.PaymentSuccessMessage;
            paymentSuccessIcon.classList.remove('hidden');
            paymentFailedIcon.classList.add('hidden');
            
           
            pushGtmEvent('purchase', {
                transaction_id: transaction_id,
               
                ecommerce: {
                    currency: 'MAD'
                }
            });

        } else {
            paymentStatusTitle.innerText = t.PaymentFailedTitle;
            paymentStatusMessage.innerText = message ? decodeURIComponent(message.replace(/\+/g, ' ')) : t.PaymentFailedMessage;
            paymentFailedIcon.classList.remove('hidden');
            paymentSuccessIcon.classList.add('hidden');
        }

        paymentStatusModal.classList.remove('modal-hidden');
        body.style.overflow = 'hidden';

        cleanUrlHash();
    }
}


function cleanUrlHash() {
    const currentSearch = new URLSearchParams(window.location.search);
    currentSearch.delete('success');
    currentSearch.delete('message');
    currentSearch.delete('code');
    currentSearch.delete('transaction_id');
    
    let newQuery = currentSearch.toString();
    const newUrl = window.location.pathname + (newQuery ? '?' + newQuery : '');
    
    try {
        history.replaceState(null, '', newUrl);
    } catch (e) {
        console.warn("Could not clean URL hash. This might be due to security restrictions.");
    }
}


window.closePaymentStatusModal = function() {
    if (paymentStatusModal) {
        paymentStatusModal.classList.add('modal-hidden');
    }
    body.style.overflow = 'auto';

    cleanUrlHash();
    window.location.reload();
}


function updatePricesUI(lang) {
    const t = translations[lang];
    if (!t) return;
    const currency = t.currency;
    const saveText = t.saveText;
    for (const courseKey in courseData) {
        const originalPrice = courseData[courseKey].originalPrice;
        const discountedPrice = Math.round((originalPrice * (1 - discountPercentage / 100)) / 50) * 50;
        document.querySelectorAll(`.original-price-${courseKey}`).forEach(el => el.textContent = `${originalPrice} ${currency}`);
        document.querySelectorAll(`.discounted-price-${courseKey}`).forEach(el => el.textContent = `${discountedPrice} ${currency}`);
        document.querySelectorAll(`.discount-badge-${courseKey}`).forEach(el => el.textContent = `${saveText} ${discountPercentage}%`);
    }
}

function switchLang(lang) {
    currentLang = lang;
    const htmlEl = document.documentElement;
    htmlEl.lang = lang;
    htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('.language-content').forEach(el => el.style.display = 'none');
    const langContent = document.getElementById(`lang-${lang}`);
    if (langContent) langContent.style.display = 'block';

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.id === `btn-${lang}`));
    
    document.querySelectorAll('.cta-ar, .cta-fr, .cta-en').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll(`.cta-${lang}`).forEach(el => el.classList.remove('hidden'));
    
    const langTranslations = translations[lang];
    if (langTranslations) {
        document.title = langTranslations.pageTitle;
        document.getElementById('modal-title').textContent = langTranslations.modalTitle;
        document.getElementById('modal-desc').textContent = langTranslations.modalDesc;
        document.getElementById('modal-email').placeholder = langTranslations.modalEmail;
        document.getElementById('modal-submit').textContent = langTranslations.modalSubmit;

        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) {
            if (lang === 'ar') {
                closeBtn.classList.remove('right-4'); closeBtn.classList.add('left-4');
            } else {
                closeBtn.classList.remove('left-4'); closeBtn.classList.add('right-4');
            }
        }
        updatePricesUI(lang);
    }

    localStorage.setItem('tadribLang', lang);

    try {
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        const currentHash = url.hash;
        if (currentHash && currentHash.match(/-(ar|fr|en)$/)) {
            url.hash = currentHash.slice(0, -3) + `-${lang}`;
        }
        history.replaceState(null, '', url.toString());
    } catch (e) {
        console.warn("Could not update URL. This is expected in sandboxed environments.");
    }
    
    updateGenericFormLanguage(lang);
    
    if (lang === 'ar') initThreeJS('hero-canvas-ar');
    else if (lang === 'fr') initThreeJS('hero-canvas-fr');
    else if (lang === 'en') initThreeJS('hero-canvas-en');
}

function detectAndSetLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const validLangs = ['ar', 'fr', 'en'];
    const defaultLang = 'fr';
    let langToSet = defaultLang;

    const langFromUrl = urlParams.get('lang');
    if (langFromUrl && validLangs.includes(langFromUrl)) {
        langToSet = langFromUrl;
    } else {
        const savedLang = localStorage.getItem('tadribLang');
        if (savedLang && validLangs.includes(savedLang)) {
            langToSet = savedLang;
        }
    }
    
    switchLang(langToSet);
}



window.openVideoModal = function(videoSrc) {
    if (!videoModal || !courseVideo) return;
    courseVideo.src = videoSrc;
    videoModal.classList.add('active');
    courseVideo.play();
}

window.closeVideoModal = function() {
    if (!videoModal || !courseVideo) return;
    videoModal.classList.remove('active');
    courseVideo.pause();
    courseVideo.src = ""; 
}



document.addEventListener('DOMContentLoaded', () => {
    
    detectAndSetLanguage();

    handlePaymentStatusModal();

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchLang(e.target.id.split('-')[1]));
    });

    document.querySelectorAll('button[onclick^="openContactModal"], a[href^="#contact"]').forEach(btn => {
        btn.addEventListener('click', () => {
            pushGtmEvent('cta_click', { 'cta_label': btn.innerText.trim() || 'Book Now' });
        });
    });

    if (brevoForm) {
        brevoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (brevoHoneypot && brevoHoneypot.value !== '') {
                console.warn('Bot detected (Honeypot filled)');
                return;
            }
            const email = brevoEmailInput.value.trim();
            if (validateAdvancedEmail(email)) {
                submitToBrevo(email, currentLang);
            }
        });
    }

    if (nextButtonGeneric) {
        nextButtonGeneric.addEventListener('click', () => {
            const isCourseValid = courseSelectGeneric?.checkValidity();
            const isQualValid = formGeneric.querySelector('input[name="qualification"]:checked');
            const isExpValid = formGeneric.querySelector('input[name="experience"]:checked');
            if (isCourseValid && isQualValid && isExpValid) {
                showStepGeneric(2);
            } else {
                formGeneric?.reportValidity();
            }
        });
    }

    if (backButtonStep2Generic) {
        backButtonStep2Generic.addEventListener('click', () => showStepGeneric(1));
    }

    if (editButtonGeneric) {
        editButtonGeneric.addEventListener('click', hideConfirmDialogGeneric);
    }

    if (formGeneric) {
        formGeneric.addEventListener('submit', function(e) {
            e.preventDefault();
            if(emailFormatErrorGeneric) emailFormatErrorGeneric.classList.add('hidden');
            if(phoneFormatErrorGeneric) phoneFormatErrorGeneric.classList.add('hidden');

            if (!fullNameInputGeneric.checkValidity() || !emailInputGeneric.checkValidity() || !phoneInputGeneric.checkValidity()) {
                formGeneric.reportValidity();
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInputGeneric.value)) {
                if(emailFormatErrorGeneric) emailFormatErrorGeneric.classList.remove('hidden');
                emailInputGeneric.focus();
                return;
            }
            if (phoneInputGeneric.value.replace(/\D/g, '').length < 9) {
                if(phoneFormatErrorGeneric) phoneFormatErrorGeneric.classList.remove('hidden');
                phoneInputGeneric.focus();
                return;
            }
            
            showConfirmDialogGeneric();
        });
    }

    if (confirmButtonGeneric) {
        confirmButtonGeneric.addEventListener('click', handleBookingSubmit);
    }
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        detectAndSetLanguage();
    }
});
