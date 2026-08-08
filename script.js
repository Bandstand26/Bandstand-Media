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


const SIGNUP_API_URL =
  "";


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

