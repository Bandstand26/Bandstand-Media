/* =========================================================
   KEEP PROGRAM INTEREST FORM AT THE TOP OF THE HOMEPAGE
   ========================================================= */

const programInterestSection =
  document.getElementById("program-interest");

const homeMain =
  document.querySelector("main");

if (programInterestSection && homeMain) {
  homeMain.insertBefore(
    programInterestSection,
    homeMain.firstElementChild
  );
}


const menuButton =
  document.getElementById(
    "menuButton"
  );


const mainNav =
  document.getElementById(
    "mainNav"
  );


menuButton.addEventListener(
  "click",
  () => {

    const isOpen =
      mainNav
        .classList
        .toggle(
          "open"
        );


    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  }
);



document
  .querySelectorAll(
    ".main-nav a"
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          mainNav
            .classList
            .remove(
              "open"
            );


          menuButton
            .setAttribute(
              "aria-expanded",
              "false"
            );

        }
      );

    }
  );



document
  .getElementById(
    "year"
  )
  .textContent =
  new Date().getFullYear();



/*
=========================================
EMAIL SIGNUP
=========================================

When we connect the AWS email API,
put the API address between these quotes.

Example:

const SIGNUP_API_URL =
"https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/signup";

*/


const SIGNUP_API_URL = "https://6pnfk4d1eb.execute-api.us-east-2.amazonaws.com";


const signupForm =
  document.getElementById(
    "signupForm"
  );


const formMessage =
  document.getElementById(
    "formMessage"
  );


signupForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const email =
      document
        .getElementById(
          "email"
        )
        .value
        .trim()
        .toLowerCase();


    const submitButton =
      signupForm
        .querySelector(
          "button[type='submit']"
        );


    if (!email) {

      formMessage.textContent =
        "Please enter a valid email address.";

      return;

    }


    if (!SIGNUP_API_URL) {

      formMessage.textContent =
        "Thanks for joining the BandStand Media movement. Email registration will activate when the signup system goes live.";

      signupForm.reset();

      return;

    }


    submitButton.disabled =
      true;


    submitButton.textContent =
      "JOINING...";


    formMessage.textContent =
      "";


    try {


      const response =
        await fetch(
          SIGNUP_API_URL,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify(
                {
                  email
                }
              )

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to join right now."
        );

      }


      formMessage.textContent =
        data.message ||
        "You're officially on the BandStand Media list!";


      signupForm.reset();


    }

    catch (error) {


      console.error(
        error
      );


      formMessage.textContent =
        "Something went wrong. Please try again.";


    }

    finally {


      submitButton.disabled =
        false;


      submitButton.textContent =
        "JOIN THE LIST";


    }

  }
);


const PROGRAM_INTEREST_API_URL = "https://8ggnyo205m.execute-api.us-east-2.amazonaws.com";

const programInterestForm =
  document.getElementById("programInterestForm");

const programFormMessage =
  document.getElementById("programFormMessage");

if (programInterestForm) {

  programInterestForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const submitButton =
        programInterestForm.querySelector("button[type='submit']");

      const interests =
        Array.from(
          programInterestForm.querySelectorAll(
            "input[name='interest']:checked"
          )
        ).map(input => input.value);

      const data = {
        name: document.getElementById("programNameField").value.trim(),
        email: document.getElementById("programEmail").value.trim().toLowerCase(),
        phone: document.getElementById("programPhone").value.trim(),
        role: document.getElementById("programRole").value,
        school: document.getElementById("programSchool").value.trim(),
        schoolLevel: document.getElementById("programSchoolLevel").value,
        city: document.getElementById("programCity").value.trim(),
        state: document.getElementById("programState").value.trim(),
        programName: document.getElementById("programUnitName").value.trim(),
        programSize: document.getElementById("programSize").value,
        interests: interests,
        notes: document.getElementById("programNotes").value.trim()
      };

      submitButton.disabled = true;
      submitButton.textContent = "SUBMITTING...";
      programFormMessage.textContent = "";

      try {

        const response =
          await fetch(
            PROGRAM_INTEREST_API_URL,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
            }
          );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to submit.");
        }

        programFormMessage.textContent =
          result.message ||
          "Thank you! BandStand Media will be in touch.";

        programInterestForm.reset();

      } catch (error) {

        console.error(error);

        programFormMessage.textContent =
          "Something went wrong. Please try again.";

      } finally {

        submitButton.disabled = false;
        submitButton.textContent = "SUBMIT PROGRAM INTEREST";
      }
    }
  );
}


/* =========================================================
   BANDSTAND DEMO NAVIGATION
   ========================================================= */

const demoNavButtons =
  document.querySelectorAll(".demo-nav");

const demoPanels =
  document.querySelectorAll(".demo-panel");

demoNavButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target =
      button.dataset.demo;

    demoNavButtons.forEach(item =>
      item.classList.remove("active")
    );

    demoPanels.forEach(panel =>
      panel.classList.remove("active")
    );

    button.classList.add("active");

    const targetPanel =
      document.getElementById(
        `demo-${target}`
      );

    if (targetPanel) {
      targetPanel.classList.add("active");
    }

  });

});


/* Prevent demo-only buttons from acting like real features */

document
  .querySelectorAll(
    ".bandstand-demo button:not(.demo-nav)"
  )
  .forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      if (
        button.classList.contains(
          "demo-gold-button"
        )
      ) {

        const original =
          button.textContent;

        button.textContent =
          "DEMO PREVIEW ONLY";

        setTimeout(() => {
          button.textContent =
            original;
        }, 1400);

      }

    });

  });

