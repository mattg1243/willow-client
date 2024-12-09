import { User } from "@/types/api";
import { HStack } from "@chakra-ui/react";
import styles from "./Header.module.css";
import { paths } from "@/config/paths";
import { LucideUser } from "lucide-react";
import { ColorModeButton } from "../ui/color-mode";
import { WLogo } from "../ui/WLogo";

type HeaderProps = {
  user: User | null | undefined;
};

export function Header({ user }: HeaderProps) {
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
          paddingTop: "36px"
        }}>
        <WLogo />
        <HStack>
          {user ? (
            <LucideUser
              onClick={() => console.log("nav to account")}
              data-testid="account-btn"
            />
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
