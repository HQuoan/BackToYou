import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  &, &.light-mode {
  /* Grey */
  --color-grey-0: #fff;
  --color-grey-50: #f9fafb;
  --color-grey-100: #f3f4f6;
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;

  --color-blue-100: #e0f2fe;
  --color-blue-700: #0369a1;
  --color-green-100: #dcfce7;
  --color-green-700: #15803d;
  --color-green-800: #166534;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;
  --color-indigo-100: #e0e7ff;
  --color-indigo-700: #4338ca;

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

    /* New colors for labels */
    --color-pending-100: #fef9c3; /* Light yellow for pending */
    --color-pending-700: #a16207; /* Darker yellow */
    --color-processing-100: #e0f2fe; /* Reuse blue for processing */
    --color-processing-700: #0369a1;
    --color-approved-100: #dcfce7; /* Reuse green for approved */
    --color-approved-700: #15803d;
    --color-rejected-100: #fee2e2; /* Reuse red for rejected */
    --color-rejected-700: #b91c1c;
    --color-normal-100: #e5e7eb; /* Reuse silver for normal */
    --color-normal-700: #374151;
    --color-priority-100: #ffedd5; /* Light orange for priority */
    --color-priority-700: #c2410c; /* Darker orange */
    --color-found-100: #dcfce7; /* Reuse green for found */
    --color-found-700: #15803d;
    --color-fake-100: #f3e8ff; /* Light purple for fake */
    --color-fake-700: #6d28d9; /* Darker purple */
    --color-lost-100: #e0e7ff; /* Reuse indigo for lost */
    --color-lost-700: #4338ca;

     /* Colors for REPORT_TITLES */
    --color-fake_report-100: #f3e8ff; /* Reuse fake colors for FAKE_REPORT */
    --color-fake_report-700: #6d28d9;
    --color-request_remove_post-100: #fee2e2; /* Reuse rejected colors for REQUEST_REMOVE_POST */
    --color-request_remove_post-700: #b91c1c;
    --color-feedback-100: #e5e7eb; /* Reuse normal colors for FEEDBACK */
    --color-feedback-700: #374151;
    --color-claim_owner-100: #e0e7ff; /* Reuse lost colors for CLAIM_OWNER */
    --color-claim_owner-700: #4338ca;
    --color-found_lost_item-100: #dcfce7; /* Reuse found colors for FOUND_LOST_ITEM */
    --color-found_lost_item-700: #15803d;

        --color-founded-100: #dcfce7; /* Reuse green for found */
    --color-founded-700: #15803d;


  --backdrop-color: rgba(255, 255, 255, 0.1);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  

    --image-grayscale: 0;
  --image-opacity: 100%;
  }
  
  &.dark-mode {
    --color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

  /* New colors for labels in dark mode */
    --color-pending-100: #854d0e; /* Darker yellow */
    --color-pending-700: #fef9c3;
    --color-processing-100: #075985; /* Reuse blue */
    --color-processing-700: #e0f2fe;
    --color-approved-100: #166534; /* Reuse green */
    --color-approved-700: #dcfce7;
    --color-rejected-100: #fee2e2; /* Reuse red */
    --color-rejected-700: #b91c1c;
    --color-normal-100: #374151; /* Reuse silver */
    --color-normal-700: #f3f4f6;
    --color-priority-100: #c2410c; /* Darker orange */
    --color-priority-700: #ffedd5;
    --color-found-100: #166534; /* Reuse green */
    --color-found-700: #dcfce7;
    --color-fake-100: #6d28d9; /* Darker purple */
    --color-fake-700: #f3e8ff;
    --color-lost-100: #3730a3; /* Reuse indigo */
    --color-lost-700: #e0e7ff;

        /* Colors for REPORT_TITLES in dark mode */
    --color-fake_report-100: #6d28d9; /* Reuse fake colors */
    --color-fake_report-700: #f3e8ff;
    --color-request_remove_post-100: #fee2e2; /* Reuse rejected colors */
    --color-request_remove_post-700: #b91c1c;
    --color-feedback-100: #374151; /* Reuse normal colors */
    --color-feedback-700: #f3f4f6;
    --color-claim_owner-100: #3730a3; /* Reuse lost colors */
    --color-claim_owner-700: #e0e7ff;
    --color-found_lost_item-100: #166534; /* Reuse found colors */
    --color-found_lost_item-700: #dcfce7;

        --color-founded-100: #166534; /* Reuse green */
    --color-founded-700: #dcfce7;


--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
  }
  
  /* Indigo */
  --color-brand-50: #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-200: #c7d2fe;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-800: #3730a3;
  --color-brand-900: #312e81;
  
  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;


}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Poppins", sans-serif;
  color: var(--color-grey-700);

  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

/* Parent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

`;

export default GlobalStyles;

/*
FOR DARK MODE

--color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
*/
