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


/* Écriture — silver-and-black branded homepage feature */
(() => {
  const experiences = document.getElementById("experiences");
  if (!experiences || document.getElementById("ecriture-showcase")) return;
  const section = document.createElement("section");
  section.id = "ecriture-showcase";
  section.setAttribute("aria-labelledby", "ecriture-heading");
  section.style.cssText = "position:relative;overflow:hidden;padding:clamp(65px,8vw,115px) 6%;background:radial-gradient(ellipse at 85% 25%,#32343a 0%,#101115 42%,#030304 85%);color:#e9e9eb;border-block:1px solid #83868c";
  section.innerHTML = `
    <div style="position:absolute;inset:0;pointer-events:none;opacity:.22;background:linear-gradient(142deg,transparent 0%,transparent 19%,#a4a7af 19.2%,transparent 19.8%,transparent 78%,#c9cbd1 78.2%,transparent 79%)"></div>
    <div style="position:relative;max-width:1120px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:45px;align-items:center">
      <div>
        <p style="font-size:12px;font-weight:800;letter-spacing:.23em;color:#c4c6cc">BANDSTAND MEDIA · LIVE NOW · 14-DAY TRIAL</p>
        <div aria-hidden="true" style="font:clamp(70px,10vw,125px) Georgia,serif;line-height:1;color:#e3e4e8;text-shadow:0 2px 0 #777,0 7px 18px #fff3">É</div>
        <h2 id="ecriture-heading" style="font:400 clamp(36px,5vw,64px) Georgia,serif;letter-spacing:.16em;line-height:1.15;margin:8px 0 22px;color:#f3f3f4;text-shadow:0 2px 8px #ffffff25">ÉCRITURE</h2>
        <p style="font:italic 600 clamp(22px,3vw,33px) Georgia,serif;line-height:1.35;letter-spacing:.025em;color:#ededf0;margin:0 0 20px">WRITE THE SOUND.<br>DESIGN THE MOVEMENT.</p>
        <p style="color:#c3c5cb;line-height:1.85">An all-in-one music arranging, drill design, and show-planning platform built for marching bands. Écriture is live, ready to purchase, and offers a 14-day trial.</p>
        <p style="font-size:12px;letter-spacing:.12em;color:#c9cbd0;margin-top:24px">MUSIC ARRANGING &nbsp;·&nbsp; DRILL DESIGN &nbsp;·&nbsp; SHOW PLANNING</p>
        <a href="https://getecriture.com/" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:22px;padding:15px 24px;border-radius:6px;background:linear-gradient(120deg,#7f8188,#f3f3f4 46%,#a4a6ad);border:1px solid #f4f4f4;color:#101114;text-decoration:none;font-weight:800;box-shadow:0 4px 22px #ffffff2a">GET ÉCRITURE · START 14-DAY TRIAL →</a>
      </div>
      <div aria-label="Écriture score and drill design illustration" style="border:1px solid #777b82;border-radius:14px;overflow:hidden;background:#0c0d10;box-shadow:0 20px 50px #000a,0 0 25px #c6c8d01c">
        <div style="padding:15px 18px;background:linear-gradient(90deg,#1c1d22,#33353a);border-bottom:1px solid #74767e;font:16px Georgia,serif;letter-spacing:.15em;color:#e9e9ec">ÉCRITURE <span style="float:right;font:11px Arial,sans-serif;letter-spacing:.08em;color:#c4c5c9">SCORE · DRILL · SHOW</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px">
          <div style="background:#191b1f;border:1px solid #50535a;padding:12px;min-height:215px"><p style="color:#e0e0e4;font-size:11px;letter-spacing:.12em;margin:0 0 18px">ARRANGING / SCORE</p><div style="height:130px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 9px,#c4c5c8 10px,#c4c5c8 11px,transparent 12px,transparent 13px);background-size:100% 62px;background-repeat:repeat-y;color:#f4f4f4;padding:12px 4px;font:22px Georgia,serif;letter-spacing:.2em">♪ ♫ ♩<br><br>♬ ♪ ♩</div></div>
          <div style="background:#1b2723;border:1px solid #747b78;padding:12px;min-height:215px"><p style="color:#e0e0e4;font-size:11px;letter-spacing:.12em;margin:0 0 14px">DRILL / FIELD VIEW</p><div style="height:150px;display:grid;place-items:center;background:repeating-linear-gradient(to bottom,transparent 0,transparent 28px,#bfc5c04a 29px,#bfc5c04a 30px);font-size:19px;line-height:1.7;letter-spacing:.25em;color:#e7e7e8;text-align:center">● ● ● ●<br>● ● ● ●<br>● ● ● ●</div></div>
        </div>
        <div style="padding:12px 18px;background:#22242a;color:#bfc1c8;font-size:12px;letter-spacing:.08em;text-align:center">ARRANGE THE MUSIC. DESIGN THE FIELD. BUILD THE SHOW.</div>
      </div>
    </div>`;
  experiences.insertAdjacentElement("afterend", section);
  const nav = document.getElementById("mainNav");
  if (nav && !Array.from(nav.querySelectorAll("a")).some(a => a.href === "https://getecriture.com/")) {
    const link = document.createElement("a");
    link.href = "https://getecriture.com/";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Écriture";
    nav.insertBefore(link, nav.querySelector(".nav-cta"));
  }
})();

/* Podiumora: band program administration — coming soon */
(() => {
  if (document.getElementById("podiumora-coming-soon")) return;
  const section = document.createElement("section");
  section.id = "podiumora-coming-soon";
  section.setAttribute("aria-labelledby", "podiumora-heading");
  section.style.cssText = "padding:clamp(65px,8vw,110px) 6%;background:#f7f5f0;color:#091c34;border-block:1px solid #d6c6a1";
  section.innerHTML = `
    <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));align-items:center;gap:45px">
      <div>
        <p style="font-size:12px;letter-spacing:.22em;font-weight:800;color:#9d792f">A BANDSTAND MEDIA BRAND · NOW LIVE · 14-DAY TRIAL</p>
        <h2 id="podiumora-heading" style="font-family:Georgia,serif;font-size:clamp(42px,6vw,75px);font-weight:500;letter-spacing:.08em;line-height:1.1;margin:18px 0 12px;color:#071c34">PODIUMORA</h2>
        <p style="font-weight:700;font-size:20px;letter-spacing:.12em;color:#102742">YOUR PROGRAM. YOUR PODIUM.</p>
        <p style="line-height:1.85;color:#33445a">Podiumora is live and available for purchase, with a 14-day trial. The band program management platform gives directors and their staff a more organized way to run their programs. From administrative coordination and program communications to managing staff, members, and everyday operations, Podiumora brings the business of running a band into one connected workspace.</p>
        <p style="line-height:1.85;color:#33445a">For creative work, Podiumora connects with <strong>Écriture</strong>, BandStand Media’s arranging and drill-design workspace, so directors can manage their programs while planning the music and movement that bring them to life.</p>
        <a href="https://lepodium.site" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#102742;color:#fff;text-decoration:none;padding:14px 22px;border-radius:5px;font-weight:800;margin-top:14px">EXPLORE PODIUMORA · START 14-DAY TRIAL</a>
      </div>
      <div style="border:1px solid #d6c6a1;border-radius:18px;background:#fff;padding:clamp(26px,5vw,54px);box-shadow:0 18px 40px #10274215;text-align:center">
        <img src="images/podiumora-logo.webp" alt="Podiumora — Your Program. Your Podium. A BandStand Media Brand" loading="lazy" style="display:block;width:min(100%,420px);height:auto;margin:0 auto;border-radius:50%;background:#07172b" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <p style="display:none;color:#102742;font-family:Georgia,serif;font-size:32px">PODIUMORA</p>
        <div style="height:1px;background:#d6c6a1;margin:28px 0"></div>
        <p style="font-size:14px;line-height:1.7;color:#46566a">Program administration · Staff coordination · Communications · Écriture integration</p>
        <p style="font-size:12px;font-weight:800;letter-spacing:.2em;color:#9d792f;margin-top:26px">NOW LIVE · AVAILABLE TO PURCHASE · 14-DAY TRIAL</p>
      </div>
    </div>`;
  const ecriture = document.getElementById("ecriture-showcase");
  const experiences = document.getElementById("experiences");
  const anchor = ecriture || experiences;
  if (anchor) anchor.insertAdjacentElement("afterend", section);
  else document.querySelector("main")?.appendChild(section);
  const nav = document.getElementById("mainNav");
  if (nav && !nav.querySelector('a[href="#podiumora-coming-soon"]')) {
    const link = document.createElement("a");
    link.href = "#podiumora-coming-soon";
    link.textContent = "Podiumora";
    nav.insertBefore(link, nav.querySelector(".nav-cta"));
  }
})();
