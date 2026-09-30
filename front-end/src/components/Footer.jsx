// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import styled from "styled-components";
// import toast from "react-hot-toast";

// // Links with to: "#" are placeholders for pages that don't exist yet —
// // swap them for real routes as you build them. Real routes assumed:
// // /discover, /cuisines, /signup, /login (adjust if yours differ).
// const COLUMNS = [
//   {
//     title: "Explore",
//     links: [
//       { label: "Discover Recipes", to: "/discover" },
//       { label: "Cuisines", to: "/cuisines" },
//       { label: "Quick & Easy", to: "/discover" },
//       { label: "Popular This Week", to: "/discover" },
//     ],
//   },
//   {
//     title: "Community",
//     links: [
//       { label: "Join FiFood", to: "/signup" },
//       { label: "Log In", to: "/login" },
//       { label: "Share a Recipe", to: "/signup" },
//       { label: "Meet Food Lovers", to: "/signup" },
//     ],
//   },
//   {
//     title: "Company",
//     links: [
//       { label: "About Us", to: "#" },
//       { label: "Contact", to: "#" },
//       { label: "Careers", to: "#" },
//       { label: "Press Kit", to: "#" },
//     ],
//   },
// ];

// const SOCIALS = [
//   {
//     label: "Instagram",
//     icon: (
//       <>
//         <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//         <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//         <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//       </>
//     ),
//   },
//   {
//     label: "Facebook",
//     icon: (
//       <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//     ),
//   },
//   {
//     label: "Twitter",
//     icon: (
//       <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
//     ),
//   },
//   {
//     label: "YouTube",
//     icon: (
//       <>
//         <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
//         <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
//       </>
//     ),
//   },
// ];

// // Pages where the footer should not appear
// const HIDDEN_ON = ["/login", "/signup"];

// // Runs on every footer link click. Doing it in onClick (rather than reacting
// // to route changes) also covers clicking a link to the page you're already on.
// const scrollToTop = () => window.scrollTo(0, 0);

// export default function Footer() {
//   const { pathname } = useLocation();
//   const [email, setEmail] = useState("");

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
//       toast.error("Please enter a valid email address");
//       return;
//     }
//     // front-end only for now — nothing is stored anywhere
//     toast.success("Thanks for subscribing!");
//     setEmail("");
//   };

//   if (HIDDEN_ON.includes(pathname)) return null;

//   return (
//     <FooterWrap>
//       <Inner>
//         <Newsletter>
//           <div>
//             <NewsTitle>Get weekly recipes in your inbox</NewsTitle>
//             <NewsText>
//               One email a week. New favorites, quick dinners, no spam.
//             </NewsText>
//           </div>
//           <NewsForm onSubmit={handleSubscribe}>
//             <NewsInput
//               type="email"
//               placeholder="Your email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               aria-label="Email address"
//             />
//             <NewsButton type="submit">Subscribe</NewsButton>
//           </NewsForm>
//         </Newsletter>

//         <Grid>
//           <Brand>
//             <Logo to="/">
//               FiFood<Dot>.</Dot>
//             </Logo>
//             <Tagline>
//               Real recipes from real home cooks. Discover, cook, and share the
//               food you love.
//             </Tagline>
//             <Socials>
//               {SOCIALS.map((s) => (
//                 <SocialLink key={s.label} href="#" aria-label={s.label}>
//                   <svg
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     {s.icon}
//                   </svg>
//                 </SocialLink>
//               ))}
//             </Socials>
//           </Brand>

//           {COLUMNS.map((col) => (
//             <Column key={col.title}>
//               <ColTitle>{col.title}</ColTitle>
//               {col.links.map((link) => (
//                 <FooterLink key={link.label} to={link.to}>
//                   {link.label}
//                 </FooterLink>
//               ))}
//             </Column>
//           ))}

//           <Column>
//             <ColTitle>Get in touch</ColTitle>
//             <ContactLine>hello@FiFood.app</ContactLine>
//             <ContactLine>+1 (555) 014-2290</ContactLine>
//             <ContactLine>
//               42 Spice Lane, Food District
//               <br />
//               Open Mon–Fri, 9am–6pm
//             </ContactLine>
//           </Column>
//         </Grid>

//         <Bottom>
//           <Copy>© {new Date().getFullYear()} FiFood. All rights reserved.</Copy>
//           <Legal>
//             <FooterLink to="#">Privacy Policy</FooterLink>
//             <FooterLink to="#">Terms of Service</FooterLink>
//             <FooterLink to="#">Cookies</FooterLink>
//           </Legal>
//         </Bottom>
//       </Inner>
//     </FooterWrap>
//   );
// }

// const FooterWrap = styled.footer`
//   background: #2b2620;
//   color: #d9cfbf;
//   font-family: "Inter", sans-serif;
//   /* margin-top: 4rem; */
// `;

// const Inner = styled.div`
//   max-width: 95rem;
//   margin: 0 auto;
//   padding: 56px 48px 28px;

//   @media (max-width: 600px) {
//     padding: 44px 24px 24px;
//   }
// `;

// const Newsletter = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 24px;
//   flex-wrap: wrap;
//   padding-bottom: 40px;
//   margin-bottom: 40px;
//   border-bottom: 1px solid #453d33;
// `;

// const NewsTitle = styled.h3`
//   font-family: "Fraunces", Georgia, serif;
//   font-size: 1.6rem;
//   font-weight: 600;
//   color: #fbf6ec;
//   margin: 0 0 6px;
// `;

// const NewsText = styled.p`
//   margin: 0;
//   font-size: 0.95rem;
//   color: #a89d8c;
// `;

// const NewsForm = styled.form`
//   display: flex;
//   gap: 10px;
//   flex-wrap: wrap;
// `;

// const NewsInput = styled.input`
//   width: 280px;
//   max-width: 100%;
//   padding: 12px 18px;
//   border-radius: 999px;
//   border: 1.5px solid #4f463a;
//   background: #35302a;
//   color: #fbf6ec;
//   font-size: 0.95rem;

//   &::placeholder {
//     color: #8f8474;
//   }

//   &:focus {
//     outline: none;
//     border-color: #f08c3a;
//   }
// `;

// const NewsButton = styled.button`
//   padding: 12px 26px;
//   border: none;
//   border-radius: 999px;
//   background: #db5f00;
//   color: #fff;
//   font-weight: 600;
//   font-size: 0.95rem;
//   cursor: pointer;
//   transition: background 0.15s ease;

//   &:hover {
//     background: #f06a06;
//   }
// `;

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: 1.6fr repeat(4, 1fr);
//   gap: 40px;

//   @media (max-width: 1000px) {
//     grid-template-columns: repeat(3, 1fr);
//   }

//   @media (max-width: 640px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
// `;

// const Brand = styled.div`
//   @media (max-width: 1000px) {
//     grid-column: 1 / -1;
//   }
// `;

// const Logo = styled(Link).attrs({ onClick: scrollToTop })`
//   font-family: "Fraunces", Georgia, serif;
//   font-size: 1.9rem;
//   font-weight: 700;
//   color: #fbf6ec;
//   text-decoration: none;
// `;

// const Dot = styled.span`
//   color: #f08c3a;
// `;

// const Tagline = styled.p`
//   max-width: 20rem;
//   margin: 14px 0 20px;
//   font-size: 0.95rem;
//   line-height: 1.6;
//   color: #a89d8c;
// `;

// const Socials = styled.div`
//   display: flex;
//   gap: 10px;
// `;

// const SocialLink = styled.a`
//   width: 38px;
//   height: 38px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 50%;
//   border: 1.5px solid #4f463a;
//   color: #d9cfbf;
//   transition: all 0.15s ease;

//   svg {
//     width: 17px;
//     height: 17px;
//   }

//   &:hover {
//     background: #db5f00;
//     border-color: #db5f00;
//     color: #fff;
//   }
// `;

// const Column = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const ColTitle = styled.h4`
//   margin: 0 0 6px;
//   font-size: 0.8rem;
//   font-weight: 600;
//   letter-spacing: 2px;
//   text-transform: uppercase;
//   color: #fbf6ec;
// `;

// const FooterLink = styled(Link).attrs({ onClick: scrollToTop })`
//   color: #a89d8c;
//   text-decoration: none;
//   font-size: 0.95rem;
//   width: fit-content;
//   transition: color 0.15s ease;

//   &:hover {
//     color: #f08c3a;
//   }
// `;

// const ContactLine = styled.p`
//   margin: 0;
//   font-size: 0.95rem;
//   line-height: 1.5;
//   color: #a89d8c;
// `;

// const Bottom = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 12px;
//   margin-top: 48px;
//   padding-top: 22px;
//   border-top: 1px solid #453d33;
// `;

// const Copy = styled.p`
//   margin: 0;
//   font-size: 0.88rem;
//   color: #8f8474;
// `;

// const Legal = styled.div`
//   display: flex;
//   gap: 22px;
//   flex-wrap: wrap;

//   a {
//     font-size: 0.88rem;
//   }
// `;

import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { subscribeToNewsletter } from "../API/newsletter";
import { AuthContext } from "../context/authContext";

// Links with to: "#" are placeholders for pages that don't exist yet —
// swap them for real routes as you build them. Real routes assumed:
// /discover, /cuisines, /signup, /login (adjust if yours differ).
const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Discover Recipes", to: "/discover" },
      { label: "Cuisines", to: "/#cuisines" },
      { label: "Quick & Easy", to: "/#quick-and-easy" },
      { label: "Popular This Week", to: "/discover" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Join FiFood", to: "/signup" },
      { label: "Log In", to: "/login" },
      { label: "Share a Recipe", to: "/signup" },
      { label: "Meet Food Lovers", to: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "#" },
      { label: "Careers", to: "#" },
      { label: "Press Kit", to: "#" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "Facebook",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "Twitter",
    icon: (
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    ),
  },
  {
    label: "YouTube",
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  },
];

// Pages where the footer should not appear
const HIDDEN_ON = ["/login", "/signup"];

// Runs on every footer link click. Doing it in onClick (rather than reacting
// to route changes) also covers clicking a link to the page you're already on.
const scrollToTop = () => window.scrollTo(0, 0);

export default function Footer() {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const columns = user
    ? COLUMNS.map((column) => ({
        ...column,
        links: column.links
          .filter((link) => !["Join FiFood", "Log In"].includes(link.label))
          .map((link) =>
            link.label === "Share a Recipe"
              ? { ...link, to: "/create-recipe" }
              : link.label === "Meet Food Lovers"
                ? { ...link, to: "/discover-friends" }
                : link,
          ),
      }))
    : COLUMNS;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const res = await subscribeToNewsletter(trimmed);
      toast.success(res.message);
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ?? "Something went wrong, please try again",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <FooterWrap>
      <Inner>
        <Newsletter>
          <div>
            <NewsTitle>Get weekly recipes in your inbox</NewsTitle>
            <NewsText>
              One email a week. New favorites, quick dinners, no spam.
            </NewsText>
            {/* <NewsText>
              && get notifacation when someone you follow add a recipe
            </NewsText> */}
          </div>
          <NewsForm onSubmit={handleSubscribe}>
            <NewsInput
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <NewsButton type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Subscribe"}
            </NewsButton>
          </NewsForm>
        </Newsletter>

        <Grid>
          <Brand>
            <Logo to="/">
              FiFood<Dot>.</Dot>
            </Logo>
            <Tagline>
              Real recipes from real home cooks. Discover, cook, and share the
              food you love.
            </Tagline>
            <Socials>
              {SOCIALS.map((s) => (
                <SocialLink key={s.label} href="#" aria-label={s.label}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </SocialLink>
              ))}
            </Socials>
          </Brand>

          {columns.map((col) => (
            <Column key={col.title}>
              <ColTitle>{col.title}</ColTitle>
              {col.links.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </Column>
          ))}

          <Column>
            <ColTitle>Get in touch</ColTitle>
            <ContactLine>hello@fifood.app</ContactLine>
            <ContactLine>+1 (555) 014-2290</ContactLine>
            <ContactLine>
              42 Spice Lane, Food District
              <br />
              Open Mon–Fri, 9am–6pm
            </ContactLine>
          </Column>
        </Grid>

        <Bottom>
          <Copy>
            © {new Date().getFullYear()} FiFood. All rights reserved.
          </Copy>
          <Legal>
            <FooterLink to="#">Privacy Policy</FooterLink>
            <FooterLink to="#">Terms of Service</FooterLink>
            <FooterLink to="#">Cookies</FooterLink>
          </Legal>
        </Bottom>
      </Inner>
    </FooterWrap>
  );
}

const FooterWrap = styled.footer`
  background: #2b2620;
  color: #d9cfbf;
  font-family: "Inter", sans-serif;
  /* margin-top: 4rem; */
`;

const Inner = styled.div`
  max-width: 95rem;
  margin: 0 auto;
  padding: 56px 48px 28px;

  @media (max-width: 600px) {
    padding: 44px 24px 24px;
  }
`;

const Newsletter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding-bottom: 40px;
  margin-bottom: 40px;
  border-bottom: 1px solid #453d33;
`;

const NewsTitle = styled.h3`
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #fbf6ec;
  margin: 0 0 6px;
`;

const NewsText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #a89d8c;
`;

const NewsForm = styled.form`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const NewsInput = styled.input`
  width: 280px;
  max-width: 100%;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1.5px solid #4f463a;
  background: #35302a;
  color: #fbf6ec;
  font-size: 0.95rem;

  &::placeholder {
    color: #8f8474;
  }

  &:focus {
    outline: none;
    border-color: #f08c3a;
  }
`;

const NewsButton = styled.button`
  padding: 12px 26px;
  border: none;
  border-radius: 999px;
  background: #db5f00;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f06a06;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr repeat(4, 1fr);
  gap: 40px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Brand = styled.div`
  @media (max-width: 1000px) {
    grid-column: 1 / -1;
  }
`;

const Logo = styled(Link).attrs({ onClick: scrollToTop })`
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #fbf6ec;
  text-decoration: none;
`;

const Dot = styled.span`
  color: #f08c3a;
`;

const Tagline = styled.p`
  max-width: 20rem;
  margin: 14px 0 20px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #a89d8c;
`;

const Socials = styled.div`
  display: flex;
  gap: 10px;
`;

const SocialLink = styled.a`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid #4f463a;
  color: #d9cfbf;
  transition: all 0.15s ease;

  svg {
    width: 17px;
    height: 17px;
  }

  &:hover {
    background: #db5f00;
    border-color: #db5f00;
    color: #fff;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColTitle = styled.h4`
  margin: 0 0 6px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fbf6ec;
`;

const FooterLink = styled(Link).attrs({ onClick: (event) => {
  if (!event.currentTarget.getAttribute("href")?.includes("#")) scrollToTop();
} })`
  color: #a89d8c;
  text-decoration: none;
  font-size: 0.95rem;
  width: fit-content;
  transition: color 0.15s ease;

  &:hover {
    color: #f08c3a;
  }
`;

const ContactLine = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #a89d8c;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 48px;
  padding-top: 22px;
  border-top: 1px solid #453d33;
`;

const Copy = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #8f8474;
`;

const Legal = styled.div`
  display: flex;
  gap: 22px;
  flex-wrap: wrap;

  a {
    font-size: 0.88rem;
  }
`;
