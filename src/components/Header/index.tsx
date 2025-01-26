import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { HStack } from "@chakra-ui/react";
import { HomeIcon, LogOutIcon, LucideUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ColorModeButton } from "../ui/color-mode";
import { WLogo } from "../ui/WLogo";
import styles from "./Header.module.css";

export function Header() {
  const { user, handleLogout } = useUser();
  const navigate = useNavigate();

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
          <WLogo />
          <HomeIcon onClick={() => navigate(paths.app.dashboard.getHref())} />
        </HStack>
        <HStack spaceX={4}>
          {user ? (
            <>
              <LucideUser
                onClick={() => console.log("nav to account")}
                data-testid="account-btn"
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
