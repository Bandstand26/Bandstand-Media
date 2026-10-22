const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".main-nav a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   BLOG NAVIGATION
   ========================================================= */

if (mainNav && !mainNav.querySelector('a[href="blog.html"]')) {
  const blogLink = document.createElement("a");
  blogLink.href = "blog.html";
  blogLink.textContent = "Blog";

  const interestLink = mainNav.querySelector('a[href="#program-interest"]');

  if (interestLink) {
    mainNav.insertBefore(blogLink, interestLink);
  } else {
    mainNav.appendChild(blogLink);
  }
}

const footerLinks = document.querySelector(".footer-links");

if (footerLinks && !footerLinks.querySelector('a[href="blog.html"]')) {
  const blogFooterLink = document.createElement("a");
  blogFooterLink.href = "blog.html";
  blogFooterLink.textContent = "Blog";
  footerLinks.appendChild(blogFooterLink);
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* =========================================================
   DIRECTOR / COACH / CREATOR INTEREST FORM
   ========================================================= */

const programInterestSection = document.getElementById("program-interest");
const experiencesSection = document.getElementById("experiences");

if (programInterestSection && experiencesSection) {
  experiencesSection.insertAdjacentElement("afterend", programInterestSection);

  const eyebrow = programInterestSection.querySelector(".program-interest-eyebrow");
  const heading = programInterestSection.querySelector(".program-interest-copy h2");
  const description = programInterestSection.querySelector(".program-interest-copy p");

  if (eyebrow) {
    eyebrow.textContent = "BAND DIRECTORS • AUXILIARY COACHES • CREATORS";
  }

  if (heading) {
    heading.textContent = "BRING YOUR PROGRAM, BRAND OR CONTENT TO BANDSTAND";
  }

  if (description) {
    description.textContent =
      "Tell us about your band, auxiliary program, creator brand or media team and learn how BandStand can support livestreaming, virtual battles, Schedule Breaker, camps, classes, content creation, monetization and BandStand TV.";
  }

  const roleSelect = document.getElementById("programRole");
  if (roleSelect) {
    const existingRoles = new Set(
      Array.from(roleSelect.options).map(option => option.textContent.trim())
    );

    [
      "Content Creator",
      "Band Media Team",
      "Photographer / Videographer",
      "Social Media Creator",
      "Influencer / Personality",
      "Podcaster / Host"
    ].forEach(role => {
      if (!existingRoles.has(role)) {
        const option = document.createElement("option");
        option.textContent = role;
        option.value = role;
        roleSelect.appendChild(option);
      }
    });
  }

  const schoolLabel = programInterestSection.querySelector('label[for="programSchool"]');
  const unitLabel = programInterestSection.querySelector('label[for="programUnitName"]');

  if (schoolLabel) {
    schoolLabel.textContent = "School / Organization / Brand *";
  }

  if (unitLabel) {
    unitLabel.textContent = "Band / Auxiliary / Creator Name";
  }

  const interests = programInterestSection.querySelector(".program-interests");
  if (interests) {
    const existingValues = new Set(
      Array.from(interests.querySelectorAll('input[name="interest"]')).map(input => input.value)
    );

    [
      ["Creator Monetization", "Creator Monetization"],
      ["Content Creation & Distribution", "Content Creation & Distribution"],
      ["Brand Partnerships", "Brand Partnerships"]
    ].forEach(([value, label]) => {
      if (!existingValues.has(value)) {
        const wrapper = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "interest";
        input.value = value;
        wrapper.appendChild(input);
        wrapper.append(` ${label}`);
        interests.appendChild(wrapper);
      }
    });
  }

  const interestNavLink = Array.from(document.querySelectorAll(".main-nav a")).find(
    link => link.getAttribute("href") === "#program-interest"
  );

  if (interestNavLink) {
    interestNavLink.textContent = "Interest Form";
  }
}

/* =========================================================
   EMAIL SIGNUP
   ========================================================= */

const SIGNUP_API_URL = "https://6pnfk4d1eb.execute-api.us-east-2.amazonaws.com";
const signupForm = document.getElementById("signupForm");
const formMessage = document.getElementById("formMessage");

if (signupForm && formMessage) {
  signupForm.addEventListener("submit", async event => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const submitButton = signupForm.querySelector("button[type='submit']");

    if (!email) {
      formMessage.textContent = "Please enter a valid email address.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "JOINING...";
    formMessage.textContent = "";

    try {
      const response = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: document.getElementById("signupRole")?.value || "" })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to join right now.");
      }

      formMessage.textContent =
        data.message || "You're officially on the BandStand Media list!";
      signupForm.reset();
    } catch (error) {
      console.error(error);
      formMessage.textContent = "Something went wrong. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "JOIN THE LIST";
    }
  });
}

/* =========================================================
   INTEREST FORM SUBMISSION
   ========================================================= */

const PROGRAM_INTEREST_API_URL = "https://8ggnyo205m.execute-api.us-east-2.amazonaws.com";
const programInterestForm = document.getElementById("programInterestForm");
const programFormMessage = document.getElementById("programFormMessage");

if (programInterestForm && programFormMessage) {
  programInterestForm.addEventListener("submit", async event => {
    event.preventDefault();

    const submitButton = programInterestForm.querySelector("button[type='submit']");
    const interests = Array.from(
      programInterestForm.querySelectorAll("input[name='interest']:checked")
    ).map(input => input.value);

    const data = {
      name: document.getElementById("programNameField")?.value.trim() || "",
      email: document.getElementById("programEmail")?.value.trim().toLowerCase() || "",
      phone: document.getElementById("programPhone")?.value.trim() || "",
      role: document.getElementById("programRole")?.value || "",
      school: document.getElementById("programSchool")?.value.trim() || "",
      schoolLevel: document.getElementById("programSchoolLevel")?.value || "",
      city: document.getElementById("programCity")?.value.trim() || "",
      state: document.getElementById("programState")?.value.trim() || "",
      programName: document.getElementById("programUnitName")?.value.trim() || "",
      programSize: document.getElementById("programSize")?.value || "",
      interests,
      notes: document.getElementById("programNotes")?.value.trim() || ""
    };

    submitButton.disabled = true;
    submitButton.textContent = "SUBMITTING...";
    programFormMessage.textContent = "";

    try {
      const response = await fetch(PROGRAM_INTEREST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit.");
      }

      programFormMessage.textContent =
        result.message || "Thank you! BandStand Media will be in touch.";
      programInterestForm.reset();
    } catch (error) {
      console.error(error);
      programFormMessage.textContent = "Something went wrong. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "SUBMIT PROGRAM INTEREST";
    }
  });
}

/* =========================================================
   BANDSTAND DEMO NAVIGATION
   ========================================================= */

const demoNavButtons = document.querySelectorAll(".demo-nav");
const demoPanels = document.querySelectorAll(".demo-panel");

demoNavButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.demo;

    demoNavButtons.forEach(item => item.classList.remove("active"));
    demoPanels.forEach(panel => panel.classList.remove("active"));

    button.classList.add("active");

    const targetPanel = document.getElementById(`demo-${target}`);
    if (targetPanel) targetPanel.classList.add("active");
  });
});

document
  .querySelectorAll(".bandstand-demo button:not(.demo-nav)")
  .forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      if (button.classList.contains("demo-gold-button")) {
        const original = button.textContent;
        button.textContent = "DEMO PREVIEW ONLY";

        setTimeout(() => {
          button.textContent = original;
        }, 1400);
      }
    });
  });


/* Écriture product showcase on the BandStand Media homepage */
(() => {
  const experiences = document.getElementById("experiences");
  if (!experiences || document.getElementById("ecriture-showcase")) return;
  const section = document.createElement("section");
  section.id = "ecriture-showcase";
  section.setAttribute("aria-labelledby", "ecriture-heading");
  section.style.cssText = "padding:clamp(55px,8vw,110px) 6%;background:linear-gradient(135deg,#191b20,#08090b);border-top:1px solid #45474c;border-bottom:1px solid #45474c";
  section.innerHTML = `
    <div style="max-width:1120px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:45px;align-items:center">
      <div>
        <p style="color:#e5c785;letter-spacing:.22em;font-size:12px;font-weight:800">NEW FROM BANDSTAND MEDIA · PRODUCT PREVIEW</p>
        <h2 id="ecriture-heading" style="font-size:clamp(48px,7vw,86px);letter-spacing:-.05em;line-height:1.1;margin:12px 0">Écriture</h2>
        <p style="font-size:23px;color:#fff">Write the sound. Design the movement.</p>
        <p style="color:#b9bbc4;line-height:1.8">A next-generation workspace concept for marching-band arranging, drill design, and show planning. Explore the product vision, illustrative screen previews, and a hands-on test workspace.</p>
        <a href="ecriture.html" style="display:inline-block;margin-top:18px;padding:14px 22px;border-radius:6px;background:#e5c785;color:#111;text-decoration:none;font-weight:800">EXPLORE ÉCRITURE →</a>
      </div>
      <div aria-label="Illustrative Écriture interface preview" style="border:1px solid #5b5d64;border-radius:14px;overflow:hidden;background:#14161a;box-shadow:0 20px 45px #0008">
        <div style="padding:14px 20px;background:#26292e;color:#eee;font-weight:800;letter-spacing:.1em">ÉCRITURE <span style="float:right;color:#e5c785;font-size:12px">SCORE · DRILL · SHOW</span></div>
        <div style="padding:24px"><div style="color:#b9bbc4;font-size:12px;margin-bottom:16px">TEST SCHOOL / SCORE PREVIEW</div><div style="background:#e8e5df;border-radius:5px;padding:28px 18px"><div style="height:90px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 10px,#858585 11px,#858585 12px,transparent 13px,transparent 14px);background-size:100% 56px;background-repeat:no-repeat;background-position:center"></div></div><p style="color:#b9bbc4;font-size:12px;margin-bottom:0">Illustrative preview — not live notation software</p></div>
      </div>
    </div>`;
  experiences.insertAdjacentElement("afterend", section);
  const nav = document.getElementById("mainNav");
  if (nav && !nav.querySelector('a[href="ecriture.html"]')) {
    const a = document.createElement("a");
    a.href = "ecriture.html";
    a.textContent = "Écriture";
    nav.insertBefore(a, nav.querySelector(".nav-cta"));
  }
})();
