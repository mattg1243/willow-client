import { User } from "@/types/api";
import { HStack } from "@chakra-ui/react";
import styles from "./Header.module.css";
import { paths } from "@/config/paths";
import { LucideUser } from "lucide-react";

type HeaderProps = {
  user: User | null | undefined;
};

export function Header({ user }: HeaderProps) {
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      className={styles.cont}>
      <p className="willow-cursive">W</p>
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
    </HStack>
  );
}
