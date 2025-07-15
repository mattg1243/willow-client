import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { system } from "@/theme";
import { HStack } from "@chakra-ui/react";
import { LogOutIcon, LucideUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ColorModeButton } from "../ui/color-mode";
import { WLogo } from "../ui/WLogo";
import styles from "./Header.module.css";

export function Header() {
  const { user, handleLogout } = useUser();
  const navigate = useNavigate();

  const currentPath = window.location.pathname;

  const onLogoClick = () => {
    if (currentPath !== paths.home.path) {
      navigate(paths.home.path)
    }
  }

  if (window.innerWidth > 480) {
    return (
      <HStack
        justifyContent="space-between"
        alignItems="center"
        textAlign="center"
        className={styles.cont}
        style={{
          margin: 0,
          padding: "16px",
          paddingTop: "36px",
        }}>
        <HStack spaceX={8}>
          <WLogo onClick={onLogoClick}/>
          {user ? (
            <>
              <Button
                variant="plain"
                onClick={() => navigate(paths.app.dashboard.getHref())}
                style={{
                  color:
                    currentPath === paths.app.dashboard.getHref()
                      ? system.token("colors.primary.500")
                      : undefined,
                }}>
                Clients
              </Button>
              <Button
                variant="plain"
                onClick={() => navigate(paths.app.payouts.getHref())}
                style={{
                  color: currentPath.startsWith(paths.app.payouts.getHref())
                    ? system.token("colors.primary.500")
                    : undefined,
                }}>
                Payouts
              </Button>
            </>
          ) : null}
        </HStack>
        <HStack spaceX={4}>
          {user ? (
            <>
              <LucideUser
                onClick={() => navigate(paths.app.profile.getHref())}
                data-testid="account-btn"
                style={{
                  color:
                    currentPath === paths.app.profile.getHref()
                      ? system.token("colors.primary.500")
                      : undefined,
                }}
              />
              <LogOutIcon onClick={handleLogout} size={18} />
            </>
          ) : (
            <a href={paths.auth.login.path} data-testid="login-link">
              Log in
            </a>
          )}
          <ColorModeButton />
        </HStack>
      </HStack>
    );
  } else {
    return <></>;
  }
}
