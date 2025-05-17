import { useEffect } from "react";

export default function useSectionObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".sidebar .nav-link");
    const mainContent = document.querySelector(".main-content");

    const observerOptions = {
      root: mainContent,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const navLink = document.querySelector(`#nav-${sectionId}`);

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          navLink?.classList.add("active");
        } else {
          entry.target.classList.remove("visible");
          navLink?.classList.remove("active");
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);
}