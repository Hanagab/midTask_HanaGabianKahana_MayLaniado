// Programs Data
const jsonData = {
    "programs": [
        {
            "id": 1,
            "title": "המסייעת",
            "content": "מרכז השלטון המקומי בישראל והחברה למתנ״סים מפעילים את מיזם \"המסייעת\" אשר נותן מענה תעסוקה במקצועות במחסור",
            "link": "https://www.matnasim.org.il/program/hamesayat",
            "image": "masihat.png",
            "altText": "ילדה צעירה יושבת ליד שולחן וכותבת במחברת בפעילות לימודית אישית"
        },
        {
            "id": 2,
            "title": "פברואר יוצא מן הכלל",
            "content": "פברואר יוצא מן הכלל חודש להעלאת המודעות הציבורית ליצירת חברה מכלילה - א.נשים עם וללא מוגבלות",
            "link": "https://www.matnasim.org.il/program/februar-",
            "image": "febuery.png",
            "altText": "ילדים ומבוגרים עם וללא מוגבלות בפעילות משותפת בספרייה, כולל ילד עם הליכון וכלב נחייה"
        },
        {
            "id": 3,
            "title": "מחליפים מילה בקהילה",
            "content": "תוכנית להפחתת הקיטוב, הגברת הלכידות והחוסן החברתי, בשותפות אסטרטגית עם בית הנשיא",
            "link": "https://www.matnasim.org.il/program/bakehila",
            "image": "community.png",
            "altText": "מפגש קהילתי רב־משתתפים, אנשים משוחחים יחד באולם ציבורי במסגרת פעילות קהילתית"
        },
        {
            "id": 4,
            "title": "חינוך בחברה הערבית",
            "content": "החברה למתנ\"סים מנהלת ומפעילה עבור משרד החינוך תוכנית אסטרטגית לחברה הערבית הבדואית והדרוזית",
            "link": "https://www.matnasim.org.il/program/arab-homesh",
            "image": "arab.png",
            "altText": "כיתת לימוד בחברה הערבית, מורה עומדת ליד לוח ותלמידים יושבים בכיתה ומשתתפים בשיעור"
        },
        {
            "id": 5,
            "title": "יומלא",
            "content": "מסגרות לפעילות חינוכית המשכית לתלמידים ולתלמידות מהמגוון האוטיסטי, כזרוע ביצוע של משרד החינוך",
            "link": "https://www.matnasim.org.il/program/yomale",
            "image": "yomla.png",
            "altText": "ילדים יוצרים בדמויות מפלסטלינה סביב שולחן בפעילות חינוכית־יצירתית"
        },
        {
            "id": 6,
            "title": "באים לטוב",
            "content": "החברה למתנ\"סים, ביחד עם המשרד לשוויון חברתי, מפעילה את \"באים לטוב\" – המערך הלאומי להתנדבות אזרחים ותיקים",
            "link": "https://www.matnasim.org.il/program/baim-letov",
            "image": "good.png",
            "altText": "קבוצת אזרחים ותיקים עומדת במעגל ומחייכת למצלמה במסגרת פעילות חברתי"
        },
        {
            "id": 7,
            "title": "ליגת הנינג׳ה הלאומית",
            "content": "מתחמי אימון וליגת נינג'ה ארצית של החברה למתנ\"סים מאפשרת השתתפות שוויונית לנערים ונערות באירועים מחוזיים וארציים גדולים",
            "link": "https://www.matnasim.org.il/program/ninja-league",
            "image": "ninja.png",
            "altText": "ילדה מטפסת על מתקן נינג׳ה בפעילות ספורטיבית בהדרכת מדריך"
        }

    ]
}

// Flag indicating whether a SCORM connection to the LMS is active
let isScormConnected = false;

// Reference to the main form element (assigned after DOM is loaded)
let form;

let searchInput;


// Run initialization logic after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Render all program cards from the JSON data
    renderPrograms(jsonData.programs);

    // Navbar toggle elements (must be set BEFORE any early returns)
    const toggler = document.querySelector(".navbar-toggler");
    const menu = document.getElementById("mainNavbar");


    // If navbar elements are found, set up event listeners for collapse events
    if (toggler && menu) {
        // When the navigation menu is opened
        menu.addEventListener("shown.bs.collapse", () => {
            toggler.classList.add("is-open");
            toggler.setAttribute("aria-expanded", "true");
        });

        // When the navigation menu is closed
        menu.addEventListener("hidden.bs.collapse", () => {
            toggler.classList.remove("is-open");
            toggler.setAttribute("aria-expanded", "false");
        });
    }


    // Dropdown elements (button, hidden input, and dropdown items)
    const dropdownButton = document.getElementById("q2DropdownButton");
    const hiddenInput = document.getElementById("q2value");
    const items = document.querySelectorAll("#q2DropdownButton + .dropdown-menu .dropdown-item");

    // If dropdown elements are missing show a console message ansd exit
    if (!dropdownButton || !hiddenInput || items.length === 0) {
        console.log("Dropdown elements not found");
        return;
    }

    // Handle dropdown item selection
    items.forEach(item => {
        item.addEventListener("click", () => {
            const selectedText = item.textContent.trim();
            const selectedValue = item.dataset.value;

            // Display selected option text on the dropdown button
            dropdownButton.textContent = selectedText;

            // Store selected value in hidden input for validation and submission
            hiddenInput.value = selectedValue;

            // Update submit button state after selection
            updateSubmitBtnState();
        });
    });

    // Get the form element
    form = document.getElementById("form-fields");
    if (!form) {
        console.log("Form element not found");
        return;
    }

    // Listen to form changes to update validation and submit button state
    form.addEventListener("input", updateSubmitBtnState);
    form.addEventListener("change", updateSubmitBtnState);

    // Handle form submission and reset events
    form.addEventListener("submit", handleFormSubmit);
    form.addEventListener("reset", handleFormReset);

    // Initialize submit button state on load
    updateSubmitBtnState();


    // Initialize the global search input reference
    searchInput = document.getElementById("search-input");

    // Trigger live search and filtering whenever the user types in the search input field
    searchInput?.addEventListener("input", applySearch);

    // Reference to the email input field (used for real-time validation feedback)
    const emailInput = document.getElementById("q1input");

    // Listen for changes in the email input field to handle real-time validation feedback
    emailInput?.addEventListener("input", () => {
        // Reference to the email input field (used for real-time validation feedback)
        const article = document.getElementById("email-article");
        if (!article) return;

        // Get and trim the current email input value
        const email = emailInput.value.trim();

        // If the field is empty or contains a valid email, clear any existing error message
        if (email.length === 0 || emailValidIfProvided()) {
            clearEmailError();
        }
    });

    // Verify SCORM API availability
    if (!window.pipwerks || !pipwerks.SCORM) {
        console.warn("SCORM not found");
        return;
    }

    // Initialize SCORM connection
    isScormConnected = pipwerks.SCORM.init();
    if (!isScormConnected) {
        console.error("SCORM init failed");
        return;
    }

    // Fetch learner data from the LMS after successful SCORM initialization
    fetchUserData();

});


// Function responsible for rendering the programs list as cards
function renderPrograms(programs) {
    // Get the container element where program cards will be rendered
    const programsGrid = document.getElementById("programs-grid");

    if (!programsGrid) return;

    // Clear existing content from the grid
    programsGrid.innerHTML = "";

    // Iterate over the programs array and create a card for each program
    programs.forEach(program => {
        // Create a Bootstrap column wrapper for layout
        const col = document.createElement("div");
        col.setAttribute("class", "col-12 col-md-6 col-lg-3 d-flex justify-content-center");

        // Create the program card container
        const card = document.createElement("article");
        card.setAttribute("class", "program-card h-100");

        // Create image wrapper element
        const imgWrapper = document.createElement("div");
        imgWrapper.setAttribute("class", "program-img-wrapper");

        // Create and configure the program image
        const img = document.createElement("img");
        img.setAttribute("class", "program-img");
        img.setAttribute("src", `assets/${program.image}`);
        img.setAttribute("alt", program.altText);

        // Create the card body container
        const body = document.createElement("div");
        body.setAttribute("class", "program-body");

        // Create the program title as a clickable link
        const titleLink = document.createElement("a");
        titleLink.setAttribute("class", "program-title btn-brand");
        titleLink.setAttribute("href", program.link);
        titleLink.setAttribute("target", "_blank");
        titleLink.setAttribute("rel", "noopener");
        titleLink.appendChild(document.createTextNode(program.title));

        // Add an accessible label indicating the link opens in a new tab
        titleLink.setAttribute("aria-label", `${program.title} (נפתח בלשונית חדשה)`);

        // Create the program description text
        const text = document.createElement("p");
        text.setAttribute("class", "program-text");
        text.appendChild(document.createTextNode(program.content));

        // Build the card structure according to the DOM hierarchy
        imgWrapper.appendChild(img);
        card.appendChild(imgWrapper);

        body.appendChild(titleLink);
        body.appendChild(text);

        card.appendChild(body);
        col.appendChild(card);

        // Append the completed card to the programs grid
        programsGrid.appendChild(col);
    });
}


// Filters and displays programs based on the user's search input
function applySearch() {
    if (!searchInput) return;
    // Get the trimmed search query from the input field (or empty string if undefined)
    const q = (searchInput.value || "").trim().toLowerCase();

    // Filter programs whose title or content includes the search query
    const filtered = jsonData.programs.filter(p =>
        p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    );

    // Re-render the programs grid with the filtered results
    renderPrograms(filtered);

    // Show a message if no matching programs were found
    if (filtered.length === 0) {
        document.getElementById("empty-programs").innerHTML = "<p>לא נמצאו תוצאות התואמות את החיפוש.</p>";
    } else {
        // Clear the empty-results message when matches exist
        document.getElementById("empty-programs").innerHTML = "";
    }
}







/* =========================================
   SCORM Handeling
   ========================================= */

// Fetch learner information from the LMS using the SCORM API
function fetchUserData() {
    // Proceed only if a SCORM connection is active
    if (isScormConnected) {
        // Retrieve the learner's name from the LMS
        const userName = pipwerks.SCORM.get('cmi.core.student_name') || '';

        // If no name is found, log a message and exit
        if (!userName){
            console.log('User Name not found');
            return;
        }

        // Extract first name from "Last Name, First Name"
        let firstName = '';
        if (userName.includes(',')) {
            firstName = userName.split(',')[1].trim();
        }

        console.log('User Name:', firstName);

        // Display the learner's name in the UI if the element exists
        const nameElement = document.getElementById('user-name');
        if (nameElement && firstName) {
            nameElement.textContent = firstName;
        }
    }
}


window.addEventListener('beforeunload', saveAndCloseConnection);

// Save learner progress to the LMS and properly close the SCORM connection
function saveAndCloseConnection() {
    // Proceed only if a SCORM connection is active
    if (isScormConnected) {
        // Save current SCORM data to the LMS
        pipwerks.SCORM.save();

        // Quit the SCORM session
        pipwerks.SCORM.quit();
    }
}

// Report form interactions and completion status to the LMS via SCORM
function reportFormToLMS(interactions) {
    // Exit if there is no active SCORM connection
    if (!isScormConnected) return;

    // Validate that at least one interaction was answered and the email (if provided) is valid
    if (!atLeastOneinterction() || !emailValidIfProvided()) {
        console.log("Form not valid, not reporting to LMS");
        return;
    }

    showFormLoader();

    // Get the current number of stored SCORM interactions
    let i = parseInt(pipwerks.SCORM.get("cmi.interactions._count") || "0", 10);

    // Fallback to zero if the retrieved value is not a valid number
    if (!Number.isFinite(i)) i = 0;

    // Iterate over the interactions and store each one in the LMS
    interactions.forEach((interction) => {
        const base = `cmi.interactions.${i}.`;

        // Set interaction id
        pipwerks.SCORM.set(`${base}id`, interction.id);

        // Set interaction type 
        pipwerks.SCORM.set(`${base}type`, interction.type);

        // Set the learner's response for the interaction
        pipwerks.SCORM.set(`${base}student_response`, interction.student_response);
        i++;
    });

    // Save interactions data to the LMS
    pipwerks.SCORM.save();

    // Mark as completed
    let status = 'completed';
    pipwerks.SCORM.set('cmi.core.lesson_status', status);
    pipwerks.SCORM.save();

    // Close the SCORM session after a short delay to ensure data is saved
    setTimeout(() => {
        pipwerks.SCORM.quit();
        // Reset the form fields after submission
        form.reset();
        hideFormLoader();
        // Hide the form and show the thank-you message
        showThanksInsteadOfForm();
    }, 150);
}




/* =========================================
   Form validation (optional fields, at least one interctionwered)
   ========================================= */

// Handle form submission: validate inputs, show feedback, report to SCORM, and reset the form
function handleFormSubmit(e) {
    // Prevent the default browser form submission behavior (page reload)
    e.preventDefault();

    // Require at least one answered question before allowing submission
    if (!atLeastOneinterction()) {
        // Update the submit button state to reflect current validation status
        updateSubmitBtnState();
        return;
    }

    // Email is optional, but if provided it must be valid
    if (!emailValidIfProvided()) {
        // Locate the email question article to display an error message and scroll to it
        const article = document.getElementById("q1-title")?.closest("article");
        if (article) {
            // Show validation error message next to the email field
            setEmailError();
            // Scroll the page to the invalid field for better UX
            scrollToElement(article);
        }
        return;
    }

    // Clear any previous validation errors
    clearEmailError();

    // No connection to the LMS - show error toast and stop form submission
    if (!isScormConnected) {
        showLmsErrorToast();
        return;
    }

    // Collect the current form interactions
    const interctions = getFormInteractions();

    // Report the collected interactions to the LMS via SCORM
    reportFormToLMS(interctions);


}


// Collect the user's form responses for reporting to the LMS
function getFormInteractions() {
    // Retrieve and trim the email input value (Q1)
    const email = (document.getElementById("q1input")?.value || "").trim();

    // Retrieve and trim the selected dropdown value (Q2)
    const topic = (document.getElementById("q2value")?.value || "").trim();

    // Retrieve the selected radio button value (Q3)
    const helpful = form?.querySelector('input[name="q3"]:checked')?.value || "";

    // Return a normalized list of interactions with default values for unanswered questions
    return [
        { id: "q1", type: "fill-in", student_response: email || "not_provided" },
        { id: "q2", type: "fill-in", student_response: topic || "not_provided" },
        { id: "q3", type: "choice", student_response: helpful || "not_provided" }
    ];
}






/* -------------------------
   Validations
-------------------------- */

// Check whether the user answered at least one question in the form
function atLeastOneinterction() {
    // Q1: Retrieve and trim the email input value (optional field)
    const email = (document.getElementById("q1input")?.value || "").trim();

    // Q2: Retrieve and trim the hidden input value from the dropdown selection
    const q2 = (document.getElementById("q2value")?.value || "").trim();

    // Q3: Check if any radio option is selected
    const q3Checked = !!form.querySelector('input[name="q3"]:checked');

    // Return true if at least one field contains a value
    return email.length > 0 || q2.length > 0 || q3Checked;
}


// Validate the email field only if a value was provided
function emailValidIfProvided() {
    // Retrieve and trim the email input value
    const email = (document.getElementById("q1input")?.value || "").trim();

    // If the email field is empty, consider it valid (optional field)
    if (email.length === 0) return true;

    // Expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Return true if the email matches the regex pattern, otherwise false
    return emailRegex.test(email);
}


/* -------------------------
   UI helpers
-------------------------- */

// Update the submit button's state based on whether the form has any answered fields
function updateSubmitBtnState() {
    // Get the submit button element
    const submitBtn = document.getElementById("btn-check");
    if (!submitBtn) return;

    // If at least one question was answered, enable the submit button
    if (atLeastOneinterction()) {
        submitBtn.classList.add("btn-active");
        submitBtn.classList.remove("btn-not-active");
        submitBtn.disabled = false;
    } else {
        // Otherwise, disable the submit button and apply inactive styling
        submitBtn.classList.add("btn-not-active");
        submitBtn.classList.remove("btn-active");
        submitBtn.disabled = true;
    }
}

// Add an email-only validation error UI (message + styling)
function setEmailError() {
    // Get the email question container by its fixed ID
    const article = document.getElementById("email-article");
    if (!article) return;

    // Mark the email article as having an error
    article.classList.add("has-error");

    // Mark the email input as invalid
    const input = document.getElementById("q1input");
    if (input) input.classList.add("is-invalid");

    // Create or reuse the validation feedback element
    let msg = article.querySelector(".invalid-feedback");
    if (!msg) {
        msg = document.createElement("div");
        msg.className = "invalid-feedback d-block mt-2";
        article.appendChild(msg);
    }

    // Set the error message text
    msg.textContent = "אנא הזן/י כתובת מייל תקינה או השאר/י את השדה ריק.";
}


// Clear the email-only validation error UI (message + styling)
function clearEmailError() {
    // Get the email question container by its fixed ID
    const article = document.getElementById("email-article");
    if (!article) return;

    // Remove the general error class
    article.classList.remove("has-error");

    // Remove invalid styling from the email input
    const input = document.getElementById("q1input");
    if (input) input.classList.remove("is-invalid");

    // Remove the validation feedback message if it exists
    const msg = article.querySelector(".invalid-feedback");
    if (msg) msg.remove();
}

// Display an error toast when there is no connection to the LMS
function showLmsErrorToast() {
    // Get the LMS error toast element from the DOM
    const toastEl = document.getElementById("lmsErrorToast");
    if (!toastEl) return;

    // Initialize a Bootstrap Toast instance
    const toast = new bootstrap.Toast(toastEl);

    // Show the toast to the user
    toast.show();
}

// Show the form loader and hide the form elements during submission
function showFormLoader() {
    // Reference to the form element that should be hidden during submission
    const formEl = document.getElementById("form-fields");

    // Reference to the form header (hidden to avoid duplicate titles during loading)
    const headerEl = document.querySelector("#full-form .form-wrapper header");

    // Reference to the loader container shown while submitting data
    const loaderEl = document.getElementById("form-loader");

    // Reference to the thank-you message (hidden to prevent overlap with the loader)
    const thanksEl = document.getElementById("thanks-box");

    // Ensure the thank-you message is hidden when entering the loading state
    if (thanksEl) thanksEl.classList.add("d-none");

    // Hide the form fields while data is being submitted
    if (formEl) formEl.classList.add("d-none");

    // Hide the form header during the loading state
    if (headerEl) headerEl.classList.add("d-none");

    // Show the loader and move focus to it for accessibility (screen readers)
    if (loaderEl) {
        loaderEl.classList.remove("d-none");
        loaderEl.focus();
    }
}

// Hide the form loader after submission is complete
function hideFormLoader() {
    // Reference to the loader container displayed during form submission
    const loaderEl = document.getElementById("form-loader");

    // Hide the loader after the submission process is complete
    if (loaderEl) loaderEl.classList.add("d-none");
}

// Display the thank-you message after a successful form submission
function showThanksInsteadOfForm() {
    // Reference to the thank-you message container
    const thanksEl = document.getElementById("thanks-box");

    // Exit if the thank-you element does not exist in the DOM
    if (!thanksEl) return;

    // Show the thank-you message
    thanksEl.classList.remove("d-none");

    // Move focus to the thank-you message for accessibility (screen readers)
    thanksEl.focus();
}



/* -------------------------
   Scroll helpers
-------------------------- */

// Smoothly scroll the page to a specific element with an offset from the top
function scrollToElement(el) {
    // Calculate the vertical position of the element relative to the page,
    // including current scroll position and an offset (e.g., for a fixed header)
    const y = el.getBoundingClientRect().top + window.pageYOffset - 120;

    // Scroll smoothly to the calculated position
    window.scrollTo({ top: y, behavior: "smooth" });
}

// Scroll smoothly to a specific section on the page by its element ID
function scrollToSection(sectionId) {
    // Retrieve the section element using the provided ID
    const section = document.getElementById(sectionId);

    // If the section exists, scroll to it using the shared scroll helper
    if (section) scrollToElement(section);
}



/* =========================
   Clear helpers
   ========================= */

// Handle form reset
function handleFormReset(e) {
    // Get the form element that triggered the reset event
    const f = e.currentTarget;

    // Delay execution to allow the browser's native reset to complete first
    setTimeout(() => {
        // Reset the dropdown UI (button text and hidden value)
        resetDropdownUI(f);

        // Clear email validation error if it exists
        const emailArticle = f.querySelector("#q1input")?.closest("article");
        if (emailArticle) {
            clearEmailError();
        }

        // Reset all radio button selections
        resetRadios(f);

        // Update the submit button state after reset
        updateSubmitBtnState();
    }, 0);
}

// Reset the dropdown UI to its default state
function resetDropdownUI(f) {
    // Clear the hidden input value used for form submission and validation
    const hidden = f.querySelector("#q2value");
    if (hidden) hidden.value = "";

    // Reset the dropdown button text to its default placeholder
    const btn = f.querySelector("#q2DropdownButton");
    if (btn) btn.textContent = "בחר/י מבין האפשרויות";
}

// Reset all radio button selections within the form
function resetRadios(f) {
    // Find all radio inputs inside the form and uncheck them
    f.querySelectorAll('input[type="radio"]').forEach(r => {
        r.checked = false;
    });
}
















