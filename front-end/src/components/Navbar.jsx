import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../context/authContext";
import { getNotifications, markNotificationRead } from "../API/notifications";
import logo from "../assets/logo2.png";

const Bar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 2.4rem;
  min-height: 7.2rem;
  padding: 0 3.2rem;
  border-bottom: 1px solid rgba(232, 224, 212, 0.8);
  background: rgba(255, 253, 249, 0.94);
  box-shadow: 0 0.6rem 2.4rem rgba(43, 38, 32, 0.045);
  backdrop-filter: blur(16px);

  @media (max-width: 760px) {
    min-height: 6.4rem;
    padding: 0 1.6rem;
    gap: 1rem;
  }
`;

const Logo = styled(Link)`
  font-family: "Fraunces", Georgia, serif;
  font-size: 3rem;
  font-weight: 600;
  color: #2b2620;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const LogoImg = styled.img`
  display: block;
  width: 15rem;
  padding: 0;
  margin: 0;
  height: 6.4rem;
  object-fit: contain;

  @media (max-width: 760px) {
    width: 12rem;
    height: 5.6rem;
  }
`;
const Links = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  justify-content: space-between;
  margin-left: clamp(1.2rem, 3vw, 4.8rem);

  @media (max-width: 980px) {
    margin-left: 1rem;
  }

  @media (max-width: 760px) {
    position: absolute;
    top: calc(100% + 0.8rem);
    right: 1rem;
    left: 1rem;
    display: ${(props) => (props.$open ? "flex" : "none")};
    flex: none;
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
    margin: 0;
    padding: 1.4rem;
    border: 1px solid #e8e0d4;
    border-radius: 1.8rem;
    background: #fffdf9;
    box-shadow: 0 1.6rem 4rem rgba(43, 38, 32, 0.14);
  }
`;

const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 760px) {
    flex-wrap: wrap;
    gap: 0.4rem;
  }
`;

const ActionGroup = styled(LinkGroup)`
  gap: 0.8rem;
  @media (max-width: 760px) {
    justify-content: flex-start;
    padding-top: 0.8rem;
    border-top: 1px solid #eee6da;
  }
`;

const MenuButton = styled.button`
  display: none;
  width: 4.2rem;
  height: 4.2rem;
  margin-left: auto;
  border: 1px solid #e8e0d4;
  border-radius: 50%;
  background: #fff;
  color: #4a4238;
  cursor: pointer;

  svg {
    width: 2.2rem;
    height: 2.2rem;
  }

  @media (max-width: 760px) {
    display: grid;
    place-items: center;
  }
`;

const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.25rem;
  border: 0;
  border-radius: 999px;
  font-family: "Inter", sans-serif;
  font-size: 1.4rem;
  font-weight: 500;
  color: #4a4238;
  text-decoration: none;
  white-space: nowrap;
  background: transparent;
  cursor: pointer;
  transition:
    color 160ms ease,
    background 160ms ease;

  &:hover {
    color: #a9471f;
    background: #f8f1e7;
  }

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`;

const SignupButton = styled(Link)`
  font-family: "Inter", sans-serif;
  font-size: 1.4rem;
  font-weight: 650;
  color: #fff;
  background: linear-gradient(135deg, #e9782e, #c64d17);
  padding: 1.1rem 2rem;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 0.5rem 1.4rem rgba(193, 89, 42, 0.2);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0.8rem 1.8rem rgba(193, 89, 42, 0.28);
  }
`;

const IconLink = styled(Link)`
  font-family: "Inter", sans-serif;
  font-size: 1.4rem;
  font-weight: 550;
  color: #4a4238;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1rem;
  border-radius: 999px;

  &:hover {
    color: #a9471f;
    background: #f8f1e7;
  }

  svg {
    width: 2.2rem;
    height: 2.2rem;
  }
`;

const ProfileAvatar = styled.img`
  width: 3.8rem;
  height: 3.8rem;
  border: 2px solid #e8e0d4;
  border-radius: 50%;
  object-fit: cover;
`;

const NotificationWrap = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border: 0;
  border-radius: 50%;
  color: #4a4238;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #f5efe4;
  }
  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: 0.2rem;
  right: 0.1rem;
  min-width: 1.8rem;
  height: 1.8rem;
  display: grid;
  place-items: center;
  padding: 0 0.35rem;
  border: 2px solid #fff;
  border-radius: 99px;
  background: #c1592a;
  color: #fff;
  font:
    600 1rem/1 "Inter",
    sans-serif;
`;

const NotificationPanel = styled.div`
  position: absolute;
  z-index: 30;
  top: calc(100% + 1.2rem);
  right: -5rem;
  width: min(36rem, calc(100vw - 2rem));
  overflow: hidden;
  border: 1px solid #e8e0d4;
  border-radius: 1.4rem;
  background: #fffdf9;
  box-shadow: 0 1.6rem 4rem rgba(43, 38, 32, 0.16);
`;

const PanelHeading = styled.div`
  padding: 1.6rem 1.8rem;
  border-bottom: 1px solid #eee6da;
  color: #2b2620;
  font:
    700 1.7rem "Fraunces",
    Georgia,
    serif;
`;

const NotificationList = styled.div`
  max-height: 38rem;
  overflow-y: auto;
`;

const NotificationEntry = styled(Link)`
  font-size: 1.3rem;
  display: block;
  padding: 1.4rem 1.8rem;
  border-bottom: 1px solid #f1ebe2;
  color: #4a4238;
  text-decoration: none;
  background: ${(props) => (props.$unread ? "#fff7ec" : "transparent")};

  &:hover {
    background: #f8f1e7;
  }
  strong {
    color: #2b2620;
  }
  span {
    display: block;
    margin-top: 0.4rem;
    color: #8a7f6e;
    font-size: 1.2rem;
  }
`;

const EmptyNotifications = styled.p`
  margin: 0;
  padding: 2rem 1.8rem;
  color: #8a7f6e;
  font-size: 1.5rem;
`;

const AccountWrap = styled.div`
  position: relative;
`;

const AccountButton = styled.button`
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border: 1px solid #e8e0d4;
  border-radius: 50%;
  background: #fff;
  color: #4a4238;
  cursor: pointer;
  transition:
    color 150ms ease,
    background 150ms ease,
    border-color 150ms ease;

  &:hover,
  &[aria-expanded="true"] {
    border-color: #dfcbb4;
    background: #f8f1e7;
    color: #a9471f;
  }
  svg {
    width: 2.1rem;
    height: 2.1rem;
  }
`;

const AccountPanel = styled.div`
  position: absolute;
  z-index: 30;
  top: calc(100% + 1rem);
  right: 0;
  width: 23rem;
  overflow: hidden;
  padding: 0.6rem;
  border: 1px solid #e8e0d4;
  border-radius: 1.4rem;
  background: #fffdf9;
  box-shadow: 0 1.6rem 4rem rgba(43, 38, 32, 0.16);
`;

const AccountHeading = styled.div`
  padding: 1rem 1.2rem 1.2rem;
  border-bottom: 1px solid #eee6da;
  color: #8a7f6e;
  font-size: 1.2rem;
`;

const AccountItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1.2rem;
  border: 0;
  border-radius: 0.9rem;
  background: transparent;
  color: #3e3932;
  font:
    500 1.35rem "Inter",
    sans-serif;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: #f8f1e7;
    color: #a9471f;
  }
`;

const LogoutItem = styled(AccountItem)`
  color: #aa4036;
  &:hover {
    background: #fff0ed;
    color: #8d2b24;
  }
`;

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notificationRef = useRef(null);
  const accountRef = useRef(null);
  const navRef = useRef(null);

  const userId = user?._id;
  useEffect(() => {
    let isCurrent = true;
    if (!userId) return undefined;

    getNotifications()
      .then((res) => {
        if (isCurrent) setNotifications(res.data ?? []);
      })
      .catch(() => {});

    return () => {
      isCurrent = false;
    };
  }, [userId]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
      if (!navRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const toggleNotifications = () => {
    const willOpen = !notificationsOpen;
    setNotificationsOpen(willOpen);
    if (willOpen) {
      getNotifications()
        .then((res) => setNotifications(res.data ?? []))
        .catch(() => {});
    }
  };

  const openNotification = (id) => {
    setNotifications((items) =>
      items.map((item) =>
        item._id === id
          ? { ...item, readAt: item.readAt ?? new Date().toISOString() }
          : item,
      ),
    );
    markNotificationRead(id).catch(() => {});
    setNotificationsOpen(false);
  };

  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return (
    <Bar ref={navRef}>
      <Logo to="/">
        <LogoImg src={logo} alt="FiFood home" />
      </Logo>
      <MenuButton
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          {menuOpen ? (
            <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
          ) : (
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </MenuButton>

      {user ? (
        <Links
          $open={menuOpen}
          onClick={(event) => {
            if (event.target.closest("a")) setMenuOpen(false);
          }}
        >
          <LinkGroup>
            <NavLink to="/discover">Discover</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/create-recipe">Add Recipe</NavLink>
          </LinkGroup>
          <ActionGroup>
            <IconLink to="/discover-friends">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-9"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </IconLink>
            <IconLink to="/favorites">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <span>Favorites</span>
            </IconLink>
            <NotificationWrap ref={notificationRef}>
              <BellButton
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={toggleNotifications}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4.5-5.8V4a1.5 1.5 0 0 0-3 0v1.2A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <UnreadBadge>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </UnreadBadge>
                )}
              </BellButton>
              {notificationsOpen && (
                <NotificationPanel>
                  <PanelHeading>Notifications</PanelHeading>
                  <NotificationList>
                    {notifications.length === 0 ? (
                      <EmptyNotifications>
                        You’re all caught up.
                      </EmptyNotifications>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationEntry
                          key={notification._id}
                          to={`/recipe/${notification.recipe?._id}`}
                          $unread={!notification.readAt}
                          onClick={() => openNotification(notification._id)}
                        >
                          <strong>
                            {notification.actor?.name ?? "Someone"}
                          </strong>{" "}
                          added a recipe:{" "}
                          {notification.recipe?.title ?? "View recipe"}.
                          <span>Go check it out</span>
                        </NotificationEntry>
                      ))
                    )}
                  </NotificationList>
                </NotificationPanel>
              )}
            </NotificationWrap>
            <NavLink
              to={`/profile/${user._id}`}
              aria-label={`${user.name}'s profile`}
            >
              {user.photo && !user.photo.includes("default-profile-img") ? (
                <ProfileAvatar
                  src={user.photo}
                  alt={`${user.name}'s profile`}
                />
              ) : (
                <svg
                  className="w-9 h-9"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </NavLink>
            <AccountWrap ref={accountRef}>
              <AccountButton
                type="button"
                aria-label="Account settings"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.55 2.55l-.1-.1a1.8 1.8 0 0 0-3.07 1.27v.18a1.8 1.8 0 0 1-3.6 0v-.15a1.8 1.8 0 0 0-3.07-1.27l-.1.1a1.8 1.8 0 1 1-2.55-2.55l.1-.1a1.8 1.8 0 0 0-1.27-3.07h-.18a1.8 1.8 0 0 1 0-3.6h.15a1.8 1.8 0 0 0 1.27-3.07l-.1-.1A1.8 1.8 0 1 1 7 2.61l.1.1a1.8 1.8 0 0 0 3.07-1.27v-.18a1.8 1.8 0 0 1 3.6 0v.15a1.8 1.8 0 0 0 3.07 1.27l.1-.1a1.8 1.8 0 1 1 2.55 2.55l-.1.1a1.8 1.8 0 0 0 1.27 3.07h.18a1.8 1.8 0 0 1 0 3.6h-.15A1.8 1.8 0 0 0 19.4 15Z" transform="translate(1 1) scale(.92)" />
                </svg> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                  />
                </svg>
              </AccountButton>
              {accountOpen && (
                <AccountPanel>
                  <AccountHeading>Signed in as {user.name}</AccountHeading>
                  <AccountItem to={`/profile/${user._id}`}>
                    <span>My profile</span>
                  </AccountItem>
                  <AccountItem to="/edit-profile">
                    <span>Edit profile</span>
                  </AccountItem>
                  <AccountItem to="/change-password">
                    <span>Change password</span>
                  </AccountItem>
                  <LogoutItem
                    as="button"
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    <span>Log out</span>
                  </LogoutItem>
                </AccountPanel>
              )}
            </AccountWrap>
          </ActionGroup>
        </Links>
      ) : (
        <Links
          $open={menuOpen}
          onClick={(event) => {
            if (event.target.closest("a")) setMenuOpen(false);
          }}
        >
          <LinkGroup>
            <NavLink to="/discover">Discover</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/about">About</NavLink>
          </LinkGroup>
          <ActionGroup>
            <NavLink to="/login">Log in</NavLink>
            <SignupButton to="/signup">Sign up</SignupButton>
          </ActionGroup>
        </Links>
      )}
    </Bar>
  );
}

export default Navbar;
